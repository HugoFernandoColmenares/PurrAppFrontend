# Frontend

Angular client for Purr, a local text-to-speech studio. One screen, **Estudio**, sends text and a voice to the PurrPy API, waits for synthesis, and plays the WAV the service returns.

The app uses Angular 22 standalone components, signals, and `HttpClient`. The API base URL is the `API_BASE_URL` injection token and defaults to `http://127.0.0.1:8000`. An empty token value keeps the calls relative (`/api/v1/...`) for a same-origin proxy.

## Structure

`core` is the shared layer. `pages` holds the screen. There is no `shared` folder until a widget is used by more than one page.

```text
src/app/
├── core/
│   ├── config/        API base URL
│   ├── models/        speech request, track, and voice catalog
│   ├── mappers/       request, API errors, and display labels
│   └── services/      SpeechApiService
└── pages/studio/      lazy-loaded Estudio screen
```

Types stay in `core/models`. Injectable services stay in `core/services`. The page does not call `HttpClient` itself.

**Author:** [HugoFernandoColmenares](https://github.com/HugoFernandoColmenares)

## Guides

Local notes, kept out of git:

- [Architecture](docs/files/architecture_guidelines.md) — product, API contract, screen, and Angular shape.
- [Design](docs/files/design_guidelines.md) — color, type, layout, and CSS rules.

## Development server

```bash
ng serve
```

Open `http://localhost:4200/`. The dev server reloads when source files change.

The backend does not declare CORS yet. A page on port 4200 cannot call `http://127.0.0.1:8000` from the browser until the API allows that origin or a proxy serves both from one host.

## Scripts

| Command | What it does |
| --- | --- |
| `ng build` | Production build in `dist/frontend/` |
| `ng test --watch=false` | Unit tests with Vitest |
| `npm run e2e` | Playwright tests in Chromium against `ng serve` |

End-to-end tests mock `POST /api/v1/speech/generate`, so they do not need the speech engine. They also write the studio screenshots to `docs/screenshots/`:

- `estudio-inicial.png`
- `estudio-generando.png`
- `estudio-listo.png`
- `estudio-error.png`
- `estudio-movil.png`

## Code scaffolding

```bash
ng generate component component-name
```

`ng generate --help` lists the other schematics.

## Additional resources

[Angular CLI overview](https://angular.dev/tools/cli)
