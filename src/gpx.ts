import {SaxesParser,type SaxesTagNS} from 'saxes';
import {emptyRoute,type Coordinate,type Annotation,type Route,type Segment} from './domain';
/** Namespace-aware streaming parser, shared by the worker and tests. Never resolves external resources. */
export function parseGPX(xml:string):{routes:Route[];warnings:string[]}{
if(new Blob([xml]).size>10*1024*1024)throw Error('Het bestand is groter dan 10 MiB.');
if(/<!DOCTYPE|<!ENTITY/i.test(xml))throw Error('DOCTYPE en XML-entiteiten zijn niet toegestaan.');
const parser=new SaxesParser({xmlns:true});
const tracks:Route[]=[],routes:Route[]=[],annotations:Annotation[]=[];let waypointName='';const stack:string[]=[];
let current:Route|null=null,segment:Segment|null=null,point:Coordinate|null=null,text='',count=0,waypoints=0,extensions=false,rootSeen=false;
const attr=(tag:SaxesTagNS,key:string)=>Object.values(tag.attributes).find(a=>a.local===key)?.value;
parser.on('opentag',tag=>{const local=tag.local;stack.push(local);text='';if(stack.length===1){rootSeen=true;if(local!=='gpx')throw Error('Dit is geen GPX-bestand.');if(!['1.0','1.1'].includes(attr(tag,'version')||''))throw Error('Alleen GPX 1.0 en 1.1 worden ondersteund.');}
if(local==='extensions')extensions=true;
if((local==='trk'||local==='rte')&&stack.length===2){current={...emptyRoute(),source:'gpx',status:'valid',provider:'GPX · originele geometrie'};if(local==='rte'){segment={mode:'imported',coordinates:[]};current.segments.push(segment);}}
if(local==='trkseg'&&current&&stack.at(-2)==='trk'){segment={mode:'imported',coordinates:[]};current.segments.push(segment);}
if(['trkpt','rtept','wpt'].includes(local)){if(++count>100000)throw Error('Maximaal 100.000 punten per import.');const lon=attr(tag,'lon'),lat=attr(tag,'lat');if(lon===undefined||lat===undefined||lon.trim()===''||lat.trim()===''||!Number.isFinite(Number(lon))||!Number.isFinite(Number(lat))||Math.abs(Number(lon))>180||Math.abs(Number(lat))>90)throw Error('Het bestand bevat ongeldige coördinaten.');point=[Number(lon),Number(lat)];if(local==='wpt'){waypoints++;waypointName='Markering '+waypoints;}}
});
parser.on('text',value=>{text+=value});parser.on('cdata',value=>{text+=value});
parser.on('closetag',tag=>{const local=tag.local,parent=stack.at(-2);if(local==='name'&&parent==='wpt')waypointName=text.trim()||waypointName;if(local==='name'&&current&&(parent==='trk'||parent==='rte'))current.name=text.trim();if(local==='desc'&&current&&(parent==='trk'||parent==='rte'))current.description=text.trim();if(local==='ele'&&point&&['trkpt','rtept','wpt'].includes(parent||'')){if(!text.trim()||!Number.isFinite(Number(text)))throw Error('Het bestand bevat ongeldige hoogte.');point[2]=Number(text);}
if((local==='trkpt'&&parent==='trkseg')||(local==='rtept'&&parent==='rte')){if(segment&&point)segment.coordinates.push(point);point=null;}
if(local==='wpt'&&point){annotations.push({name:waypointName,coordinate:point});point=null;}
if((local==='trk'||local==='rte')&&stack.length===2&&current){if(!current.segments.length||current.segments.some(s=>s.coordinates.length<2))throw Error('Elk track- of routesegment moet minimaal twee punten bevatten.');current.name||=`GPX-route ${tracks.length+routes.length+1}`;(local==='trk'?tracks:routes).push(current);current=null;segment=null;}
stack.pop();text='';});
parser.on('error',()=>{throw Error('Dit is geen geldig XML-bestand.');});parser.write(xml).close();if(!rootSeen)throw Error('Het bestand is leeg.');const result=tracks.length?tracks:routes;if(!result.length&&waypoints)result.push({...emptyRoute(),name:'GPX-markeringen',source:'gpx',markers:annotations,provider:'GPX · losse markeringen'});if(!result.length)throw Error('Geen bruikbare route gevonden.');for(const route of result)route.markers=annotations;
return {routes:result,warnings:[...(!tracks.length&&routes.length?['Routepunten geïmporteerd; verbindingen zijn niet op beloopbaarheid gecontroleerd.']:[]),...(waypoints?[`${waypoints} losse markeringen worden apart bewaard en beïnvloeden de route niet.${!tracks.length&&!routes.length?' Dit is geen complete hardlooproute.':''}`]:[]),...(extensions?['Onbekende GPX-extensions worden bij export niet behouden.']:[])]};
}
