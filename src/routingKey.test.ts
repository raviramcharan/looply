import {beforeEach,afterEach,it,expect,vi} from 'vitest';
import {getRoutingKey,setRoutingKey,routingHeaders} from './routingKey';
beforeEach(()=>{const items=new Map<string,string>();vi.stubGlobal('sessionStorage',{getItem:(k:string)=>items.get(k)||null,setItem:(k:string,v:string)=>items.set(k,v),removeItem:(k:string)=>items.delete(k)});setRoutingKey('')});
afterEach(()=>{setRoutingKey('');vi.unstubAllGlobals()});
it('trims and remembers the personal key only in session storage',()=>{expect(setRoutingKey('  test-placeholder-key  ')).toBe(true);expect(getRoutingKey()).toBe('test-placeholder-key');expect(sessionStorage.getItem('looply-routing-key')).toBe('test-placeholder-key')});
it('clears the saved key and omits the request header',()=>{setRoutingKey('test-placeholder-key');setRoutingKey('');expect(getRoutingKey()).toBe('');expect(routingHeaders()).toEqual({'Content-Type':'application/json'});expect(sessionStorage.getItem('looply-routing-key')).toBeNull()});
it('transmits the key in a header, never a URL',()=>{setRoutingKey('test-placeholder-key');expect(routingHeaders()['X-ORS-API-Key']).toBe('test-placeholder-key')});
it('rejects malformed values without overwriting a working key',()=>{setRoutingKey('test-placeholder-key');expect(()=>setRoutingKey('bad\nheader-key')).toThrow();expect(getRoutingKey()).toBe('test-placeholder-key')});
it('remains usable in memory when browser storage is blocked',()=>{vi.stubGlobal('sessionStorage',{setItem(){throw Error()},removeItem(){throw Error()}});expect(setRoutingKey('test-placeholder-key')).toBe(false);expect(getRoutingKey()).toBe('test-placeholder-key');setRoutingKey('');expect(getRoutingKey()).toBe('')});
