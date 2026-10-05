import {routingHeaders} from './routingKey';
import {haversine,type Coordinate} from './domain';
export const routingCapabilities={profile:'foot-walking',maxPoints:50,maxDistanceMeters:200000,surfaces:false,elevation:false};
const cache=new Map<string,Coordinate[]>();
export const clearRoutingCache=()=>cache.clear();
export async function pedestrianSegment(from:Coordinate,to:Coordinate,signal:AbortSignal):Promise<Coordinate[]>{
const key=JSON.stringify([from.slice(0,2),to.slice(0,2)]);if(cache.has(key))return cache.get(key)!;
if(haversine(from,to)>routingCapabilities.maxDistanceMeters)throw Error('Maximaal 200 km tussen routepunten in deze planner.');
const response=await fetch('/api/route',{method:'POST',headers:routingHeaders(),body:JSON.stringify({coordinates:[from.slice(0,2),to.slice(0,2)]}),signal});
const data=await response.json();if(!response.ok)throw Error(data.error||'Route berekenen mislukt.');
if(!Array.isArray(data.coordinates)||data.coordinates.length<2||data.coordinates.some((c:unknown)=>!Array.isArray(c)||!Number.isFinite(c[0])||!Number.isFinite(c[1])||Math.abs(c[0])>180||Math.abs(c[1])>90))throw Error('De routedienst gaf ongeldige geometrie terug.');
if(signal.aborted)throw new DOMException('Afgebroken','AbortError');
cache.set(key,data.coordinates);if(cache.size>200)cache.delete(cache.keys().next().value!);return data.coordinates;
}
