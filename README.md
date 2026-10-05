# Looply

A Dutch, map-first running route planner. React + TypeScript + Vite, MapLibre, IndexedDB, a small Express API, and a production app-shell service worker. No account, analytics, or cloud storage.

## Run locally

Use Node 22.12+ (or a current LTS) and npm.

```sh
npm ci
cp .env.example .env
npm run dev
```

Open http://localhost:5173. The API runs on port 3001. The development process must have outbound network access for search and routing; the browser loads map tiles directly.

### Enable real pedestrian routing

1. Open **Instellingen → Kaarten & routing**.
2. Get your Standard API key from https://account.heigit.org/ (official information: https://api.heigit.org/).
3. Paste the key, choose **Test verbinding**, then **Opslaan**. No server restart is needed.
4. Add points with **Volg de paden** enabled.

Personal keys are stored in sessionStorage for this tab, with an in-memory fallback if storage is blocked. They are masked by default, removable, never included in backups, and forwarded in a request header to Looply's backend, then only to HeiGIT's routing endpoint. They are not written to server configuration and cannot alter another user's key. Test uses one fixed public route in Heidelberg; it does not submit the user's route/location. Keys must be sent over HTTPS in production. Configure your hosting logs to redact `X-ORS-API-Key` and `Authorization` if logging headers.

Alternatively, an operator can set `ORS_API_KEY=your-key` in `.env` and restart the server. That server key remains private; personal keys take precedence per request. Clearing a personal key restores the optional server fallback. Without either key, routing returns a configuration error and manual/GPX features remain available.

The provider endpoint was updated to `https://api.heigit.org/openrouteservice/v2/directions/foot-walking/geojson` per the [official migration notice](https://ask.openrouteservice.org/t/deprecating-api-openrouteservice-org-in-favour-of-api-heigit-org/7912).

A Dutch route guide is available through **Zo werkt het**, through Settings, and as [a downloadable Markdown file](public/handleiding.md).

```sh
npm test       # domain and mocked-provider tests
npm run build # type checking, Vite assets, generated service worker
npm start     # serve dist and the API on port 3001
```

Deploy the Node service behind HTTPS. Do not deploy just `dist` unless `/api` is separately provided. HTTPS is required for production geolocation, sharing and service workers. The service worker caches only same-origin application assets, never provider tiles or API responses. It is registered in production builds only.

## Implemented

- Real interactive OpenFreeMap map, panning, zoom, scale, visible attribution, camera preference, fit-to-route, reduced-color map option.
- Debounced, cancellable place search through the backend. Selecting a result centers the map; adding is explicit.
- Point insertion, deletion, reorder, marker dragging, tap-to-move, and coordinate entry for keyboard access.
- A-to-B, return-to-start and out-and-back; reverse, undo/redo and guarded reset.
- Explicit manual segments, distinct dashed rendering, geometry-based distance and user-set running pace.
- Pedestrian routing adapter with abort/revision protection, bounded cache, failure states, and explicit acceptance for snap offsets above 100 m. UI maximum: 50 points and 200 km.
- IndexedDB saved routes and separate drafts, restore after reload, library search/filter/sort, geometry previews, duplicate, favorite, delete confirmation, cancel edits.
- GPX 1.0/1.1 namespace-aware import in a worker, selection/preview, validation and 10 MiB / 100,000-point limits. Tracks, routes, disjoint segments, elevations and independent waypoint annotations are retained. Waypoints-only files never become fabricated routes.
- Full-geometry GPX 1.1 track export, name/description, elevation when present, separate track segments and explicit points. Share when supported, download fallback. Stale routes cannot export.
- Versioned JSON backup, validated merge preview, duplicate IDs imported as copies; existing routes are not erased.
- User-triggered browser location, accuracy circle, timestamp/stale state, explicit following and watcher cleanup.
- Responsive three-position mobile sheet, coordinate-entry alternative, keyboard dialogs, focus trap, labels, reduced motion, and status announcements.
- Install manifest and generated production app-shell service worker. Local data survives offline; online maps/search/routing remain network services.

## Accuracy and data

Coordinates are WGS84 `[longitude, latitude, elevation?]`. Distance is the sum of haversine distances over full geometry within each segment, using radius 6,371,008.8 m; gaps are never connected. Provider walking duration is never used: running time = geometry kilometres × pace seconds/km. Full geometry is stored; only library SVG previews are simplified (at most roughly 1,500 displayed points per segment). GPX round-trips preserve numeric geometry exactly in unit tests; operational tolerance is 1e-7 degrees. Original track timestamps and unknown extensions are not exported; the app does not invent activity data. Out-and-back reverses the outbound geometry and may conflict with unusual directional path restrictions.

IndexedDB database `looply`, version 1: `routes` keyed by ID and `drafts` keyed by `current`. Writes and backup merges use transactions. Route schema version is 1; unknown backup versions are rejected rather than guessed. Camera is the only localStorage preference. Browser/origin/device data can be cleared or evicted; backups are necessary. Precise route coordinates do not go into app URLs or logs.

## Verification

`npm test` passes 36 tests covering distance, pace, gaps, reversal, GPX 1.0/1.1/namespaces, multiple tracks, missing elevations, annotations-only input, XML/DOCTYPE/range errors, exact GPX round-trip, stale export protection, backup validation, provider failures, cancellation and limits. `npm run build` passes.

Interactive browser checks performed: map rendering, keyboard navigation, coordinate-based manual creation, out-and-back doubling (0.88 → 1.76 km), save → reload → library persistence, GPX worker import preview → save → reopen, settings, and mobile breakpoint inspection. Test records are explicitly named `Test — …`. `tests/fixtures/test-route.gpx` is synthetic test geometry, not a verified running route.

API settings were browser-checked with a fictitious test value: save → reload → masked recovery → remove. The test value was removed afterwards. Guide navigation and download-link availability were also checked. Key handling and upstream authentication errors are covered with mocked tests; a successful live credential check still requires a user key.

## Remaining verification and limitations

- No ORS credential was supplied, so **real routing and provider snap behaviour have not been smoke-tested**. The search provider was verified with a real public Vondelpark query.
- Actual iPhone/Android GPS, file sharing, installation, storage eviction, offline production launch, and screen-reader testing still need device QA. This is not a WCAG certification.
- Browser automation checked critical flows interactively; there is not yet a standalone Playwright CI suite or a database failure-injection suite.
- Large imports use a worker, but a 100,000-point import performance benchmark has not been run on a midrange phone.
- GPX route-point files are kept as unverified imported geometry with a warning. “Maak bewerkbare kopie” explicitly samples up to approximately 16 routepoints and can change geometry after recalculation; the saved original remains intact.
- Imported track timing/extensions are not retained by export. App-specific manual/routed metadata is retained by JSON backup, not standard GPX.
- Backend request limits are in-memory per IP (40/minute), not a distributed production quota service. For multiple instances, add shared rate limits and provider-budget monitoring. Configure trusted proxy handling for your hosting environment rather than trusting arbitrary forwarded headers.
- Provider credentials are not bundled. Native background tracking, elevation analysis, surface preferences, automatic target-distance loops, social features, cloud sync and direct watch integrations are not included.

See [IMPLEMENTATION.md](./IMPLEMENTATION.md) for requirements coverage and provider choices.
