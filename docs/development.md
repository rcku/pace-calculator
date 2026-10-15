# Development

🤖 Created with OpenAI Codex

## Get started

Install Node.js 24 or newer, then run:

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:5173`. Edit files in `src/`; Vite automatically refreshes the browser after changes.

## Project structure

```text
src/                     Readable application source
  index.html             Page metadata and application mount point
  main.tsx               Preact entry point
  App.tsx                Shared state, navigation, and calculator composition
  components/            Shared header, inputs, results, and calculator panels
  model.ts               Typed input validation and unit conversions
  calculations.ts        Pure pace and VDOT calculations
  distances.ts           Typed shared distance definitions
  style.css              Stylesheet entry point
  styles/                Theme tokens, layout, controls, results, and conversion styles
docs/                    Development, deployment, calculations, and contribution guides
public/                  Static files copied by Vite
vite.config.ts           Vite and plugin configuration
tests/                   TypeScript calculation, UI, and build regression tests
.github/workflows/       Pull-request checks and GitHub Pages publishing
dist/                    Generated production files; ignored by Git
```

## Commands

| Command                | Purpose                                                                    |
| ---------------------- | -------------------------------------------------------------------------- |
| `npm run dev`          | Start the development server with live reload                              |
| `npm run typecheck`    | Check application, test, and Vite configuration types                      |
| `npm test`             | Run calculation, workout, and UI regression tests                          |
| `npm run build`        | Bundle and minify JavaScript/CSS into `dist/`; copy the license            |
| `npm run preview`      | Preview `dist/` after a build                                              |
| `npm run test:build`   | Verify the generated production application                                |
| `npm run check`        | Check formatting and types, run tests, build, and verify production output |
| `npm run format`       | Format the repository                                                      |
| `npm run format:check` | Check formatting without changing files                                    |

Preact is the only runtime npm dependency. One `tsconfig.json` checks application, test, and Vite configuration code in strict mode with browser and Node types. Vite transpiles TS/TSX and bundles Preact into the static website. Versions are recorded in `package-lock.json` for reproducible installation.

## Build tools

All tools are installed by `npm ci` from `package.json`; there are no custom build scripts to maintain:

- **Preact + TypeScript:** typed components and shared state, checked with `tsc` without emitting files.
- **Vite + @preact/preset-vite:** development server, production bundling and JavaScript/CSS minification, and preview.
- **cpy-cli:** copy the license into the production output.
- **tsx + Happy DOM:** run TypeScript tests and exercise the application in a simulated browser.
- **Prettier:** consistent source and documentation formatting.

`npm run check` runs type checking once before the tests and production build. `npm run build` only generates production files, so use `check` for full verification before publishing. The output contains normal HTML and separate minified assets; there is no standalone HTML export or precompressed sidecar generation.

See [deployment](deployment.md) for publishing and [contributing](contributing.md) for pull requests.

## Theme preference

The theme toggle is available on the calculator and pace-conversion view. A saved `stride-theme` preference in browser local storage takes precedence over the device theme at startup. If storage is unavailable, theme switching still works for the current session. Colors are defined as shared CSS variables in `src/styles/tokens.css`. Each stylesheet keeps its responsive rules alongside its base rules.

## Test organization

`tests/calculations.test.ts` covers the pure formulas. `tests/workouts.test.ts` checks VDOT-based repeat durations and intensity limits. `tests/app.test.ts` uses a fresh mounted application for each interaction scenario, with setup and cleanup in `tests/helpers/app.ts`. `tests/build.test.ts` loads the generated HTML and JavaScript to verify that the production application initializes and its main interactions work.

## Formatting

Prettier reads four-space indentation and LF line endings from `.editorconfig`. `npm run format` and `npm run format:check` scan the repository; `.prettierignore` excludes generated output and the lockfile. There is no separate Prettier configuration.
