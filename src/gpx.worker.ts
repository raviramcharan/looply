import {parseGPX} from './gpx';
self.onmessage=(event:MessageEvent<string>)=>{try{self.postMessage({result:parseGPX(event.data)})}catch(e){self.postMessage({error:(e as Error).message})}};
