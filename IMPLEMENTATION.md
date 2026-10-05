# Implementation notes

The user's build request superseded the attached document's design-only first-phase instruction. Product defaults: Dutch responsive web app, km/m/min per km, running only, anonymous local storage, Amsterdam initial map, optional location, online map/search/routing, no analytics.

## Providers and architecture

- MapLibre GL JS renders maps; it does not supply routing or map data. OpenFreeMap Positron supplies the base style/tiles with a small color adjustment. Visible credit links include OpenFreeMap, OpenMapTiles and OpenStreetMap. Source: https://openfreemap.org/quick_start/ and https://maplibre.org/maplibre-gl-js/docs/.
- Photon is the default search service behind `/api/search`, chosen for a working no-key search experience. Public endpoint availability is not an SLA; high-volume production should use a contracted or self-hosted service. Source: https://photon.komoot.io/.
- openrouteservice uses the protected `foot-walking` GeoJSON endpoint, explicitly described as pedestrian routing for running planning. API key comes from the server environment or a personal key submitted per request from the current tab. Source: https://openrouteservice.org/dev/ and https://openrouteservice.org/restrictions/.
- Alternative: MapTiler for hosted map styles/geocoding and GraphHopper for hosted foot routing. Their authenticated plans add supplier billing/configuration but may suit a contracted production service. No cost estimate or quota claim has been invented. See https://www.maptiler.com/cloud/ and https://docs.graphhopper.com/.
- Application caps are deliberately independent of provider limits: 50 waypoints, 200 km calculated route, 40 API calls per IP per minute, 64 KiB request body, fixed upstream URLs. No arbitrary URL proxy.
- `MapCanvas.tsx`: renderer, markers, location accuracy and camera. `routing.ts`: capability constants and pedestrian adapter. `repository.ts`: IndexedDB transactions. `gpx.ts` + `gpx.worker.ts`: SAX parser and worker. `domain.ts`: typed model, measurements, serializers and backup validation. `App.tsx`: editor history, revision/abort ownership, screens and interactions. `server.mjs`: protected adapters.

## API contracts

- `GET /api/config` → `{routing:boolean}`; never returns credentials.
- `GET /api/search?q=` → `[{coordinate:[lon,lat], label, context}]`; 3–150 characters, debounce client-side, 10 second upstream timeout.
- `POST /api/route` with `{coordinates:[[lon,lat],...]}` → `{coordinates:[[lon,lat],...]}`; validated 2–50 positions, foot-walking, 18 second timeout. Errors are `{error:string}` with meaningful HTTP status.

## Requirement coverage

| Requirements | Implementation / verification |
|---|---|
| MAP-01 | Interactive real map, controls, scale, attribution, bounds fit. Browser-checked. |
| SEARCH-01 | Cancellable search, results/context, explicit point add, failure feedback. Real provider read smoke test passed. |
| PLAN-01 | Typed point model + ORS adapter. Credential required for real routing smoke test. |
| PLAN-02 | Select, move, drag, insert, remove and up/down controls; keyboard coordinate entry. |
| PLAN-03 | Snapshot undo/redo, redo invalidation, guarded reset, reversed geometry/directional re-routing. |
| PLAN-04 | A-to-B, calculated return-to-start, mirrored out-and-back. Distance doubling browser-checked. |
| PLAN-05 | Explicit dashed manual geometry; no automatic error fallback. |
| METRIC-01 | Full-geometry distance and selected pace, null/unavailable elevation. Domain-tested. |
| SAVE-01 | Save/edit/reopen, duplicate, favorite/delete and original-version restore. Persistence browser-checked. |
| SAVE-02 | Name/tag search, distance/favorite/source filters, name/distance/date ordering, local geometry previews. |
| DRAFT-01 | Separate draft writes after edits, restore-or-discard after reload. |
| GPX-01 | Worker parsing, namespaces, version checks, limits, tracks/routes/annotations, selection preview; fixture import browser-checked. |
| GPX-02 | Full geometry, multiple segments, escaped text, elevation, safe filename, download/share fallback; round-trip tested. |
| GPS-01 | Optional fix, accuracy circle, time/staleness, explicit follow/stop, stop on map pan or leaving planner. Real device QA pending. |
| MOBILE-01 | Three-position panel, tap-to-move, reorder buttons, keyboard entry. Breakpoint inspected; physical-device QA pending. |
| BACKUP-01 | Versioned JSON, validated non-destructive merge, duplicate-ID policy, metadata. Domain-tested. |

No later-release features are shown as working controls. ELEV, PREF, LOOP, POI expansion, SYNC, SHARE, DRAW, FOLLOW navigation, RECORD, full OFFLINE and DEVICE remain future modules as the source specification requested.

## Specific boundaries requiring follow-up

- End-to-end automated provider races, database write-failure injection, all 20 source acceptance scenarios on physical mobile hardware, and quantified performance/a11y audits remain verification work.
- There is no arbitrary target-distance round-trip generator; “Rondje” connects the last point back to the first.
- Layer options are the real standard map and a desaturated version of that same map, not satellite or terrain.
- Saved route opening doubles as the detail screen, with metrics, editing, export, and metadata in the save dialog.
- Geolocation is device positioning, not guaranteed satellite GPS. No fixes are automatically uploaded. Foreground following is not turn-by-turn navigation or activity recording.

## Suggested acceptance budgets

Measure on an actual midrange phone: editor-control response <100 ms, map pan at least 30 fps, up to 100,000 GPX points parsed in a worker within 5 seconds, IndexedDB write of typical 10 km route <250 ms. These are targets, not measured claims. Provider latency is measured separately with the configured account and deployment.

## Personal key settings and route guide

Personal keys use sessionStorage (memory fallback), never backups or server-wide configuration. POST `/api/routing-key/test` checks a fixed public route using the supplied `X-ORS-API-Key` header or server fallback; no key is echoed. `/api/route` accepts that same header. Both responses are no-store. The provider URL uses the new HeiGIT endpoint. The Dutch guide covers route shapes, segment modes, editing, errors, metrics, GPX and local backups.
