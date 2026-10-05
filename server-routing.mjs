export const ORS_ENDPOINT='https://api.heigit.org/openrouteservice/v2/directions/foot-walking/geojson';
export function resolveRoutingKey(header, fallback) {
  const key=(header===undefined?fallback||'':header).trim();
  if(!key)throw Object.assign(Error('Voeg je openrouteservice API-sleutel toe via Instellingen, of kies bewust Handmatig.'),{status:503});
  if(!/^[\x21-\x7E]{10,4096}$/.test(key))throw Object.assign(Error('Ongeldige API-sleutel. Plak de volledige sleutel zonder spaties in Instellingen.'),{status:400});
  return key;
}
export async function requestPedestrianRoute(key,coordinates,fetcher=fetch) {
  const response=await fetcher(ORS_ENDPOINT,{method:'POST',headers:{Authorization:key,'Content-Type':'application/json'},body:JSON.stringify({coordinates,instructions:false}),signal:AbortSignal.timeout(18000)});
  if(!response.ok){const status=response.status;const message=status===401||status===403?'De API-sleutel is ongeldig of heeft geen toegang. Controleer je sleutel in het HeiGIT-dashboard.':status===429?'Je routelimiet is bereikt. Bekijk je verbruik in het HeiGIT-dashboard of probeer later opnieuw.':'De routedienst kon geen route berekenen. Probeer later opnieuw of verplaats een routepunt.';throw Object.assign(Error(message),{status:[401,403,429].includes(status)?status:502});}
  const data=await response.json();const geometry=data.features?.[0]?.geometry?.coordinates;if(!Array.isArray(geometry)||geometry.length<2)throw Object.assign(Error('De routedienst gaf geen geldige route terug.'),{status:502});return geometry;
}
export function routingError(res,error){res.status(error.status||502).json({error:error.status?error.message:'De routedienst is niet bereikbaar. Probeer opnieuw.'});}
