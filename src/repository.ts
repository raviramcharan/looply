import {openDB} from 'idb';
import type {Route} from './domain';
const db=openDB('looply',1,{upgrade(db){db.createObjectStore('routes',{keyPath:'id'});db.createObjectStore('drafts');}});
export const repository={all:async():Promise<Route[]> => (await db).getAll('routes'),save:async(route:Route)=>(await db).put('routes',route),remove:async(id:string)=>(await db).delete('routes',id),draft:async():Promise<Route|undefined>=>(await db).get('drafts','current'),saveDraft:async(route:Route)=>(await db).put('drafts',route,'current'),clearDraft:async()=>(await db).delete('drafts','current'),merge:async(routes:Route[])=>{const tx=(await db).transaction('routes','readwrite');for(const route of routes)await tx.store.put(route);await tx.done;}};
