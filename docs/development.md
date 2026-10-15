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

| Command              | Purpose                                                                               |
| -------------------- | ------------------------------------------------------------------------------------- |
| `npm run dev`        | Vite development server with live reload                                              |
| `npm run typecheck`  | Check application and test types without emitting files                               |
| `npm test`           | Run calculation and UI regression tests                                               |
| `npm run build`      | Compile/bundle JS and minify HTML/CSS; generate gzip/Brotli copies                    |
| `npm run compile`    | Alias for the production build                                                        |
| `npm run preview`    | Vite preview of `dist/` after a build                                                 |
| `npm run test:build` | Verify the production bundle and compressed assets after a build                      |
| `npm run check`      | Check formatting, run tests, type-check, build, and verify production/portable output |
| `npm run format`     | Format source, configuration, tests, and documentation                                |
| `npm run export`     | Build a portable HTML file at `portable/index.html`                                   |

Preact is the only runtime npm dependency. TypeScript checks the application in strict mode with browser types (`tsconfig.json`), and tests/build configuration with Node types (`tsconfig.node.json`); Vite transpiles TS/TSX and bundles Preact into the static website. Vite, its minification/compression/single-file plugins, cpy-cli, Prettier, and Happy DOM are development-only tools. Versions are recorded in `package-lock.json` for reproducible installation.

## Build tools

All tools are installed by `npm ci` from `package.json`; there are no custom scripts to maintain:

- **Preact + TypeScript:** typed components and shared state, checked with `tsc --noEmit`.
- **Vite + @preact/preset-vite:** development server, production JS/CSS bundling and minification, and preview.
- **vite-plugin-minify:** HTML minification.
- **vite-plugin-compression2:** gzip and Brotli sidecars.
- **vite-plugin-singlefile:** portable HTML with JavaScript and CSS inlined.
- **cpy-cli:** copy the license into the production output.

The portable build is generated in `portable/index.html` inside the repository. Copy this file wherever you need it after building; the project commands do not write outside the checkout. It requires no local JavaScript/CSS files or server. Google Fonts are optional external resources; offline use falls back to system fonts.

See [deployment](deployment.md) for publishing and [contributing](contributing.md) for pull requests.

## Theme preference

The theme toggle is available on the calculator and pace-conversion view. A saved `stride-theme` preference in browser local storage takes precedence over the device theme at startup. If storage is unavailable, theme switching still works for the current session. Colors are defined as shared CSS variables in `src/styles/tokens.css`. Each stylesheet keeps its responsive rules alongside its base rules.

## Test organization

`tests/calculations.test.ts` covers the pure formulas. `tests/app.test.ts` uses a fresh mounted application for each interaction scenario, with setup and cleanup in `tests/helpers/app.ts`. Build tests discover generated assets and verify each compressed copy; they do not assume a fixed number of bundles. Portable-output tests verify the standalone HTML.
