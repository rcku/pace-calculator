# Stride — Running pace calculator

🤖 Built with OpenAI Codex

[Open the calculator](https://rcku.github.io/pace-calculator/)

A responsive Preact + TypeScript browser calculator with three modes:

- **Pace → time:** finish times for track distances through the marathon.
- **Time → pace:** kilometer/mile pace and target VDOT for preset or custom distances.
- **VDOT → time:** equivalent race times, race paces, and estimated training paces.

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
  App.tsx                Shared state and three calculator modes
  components/            Reusable inputs, race tables, and training results
  model.ts               Typed input validation and unit conversions
  calculations.ts        Pure pace and VDOT calculations
  distances.ts           Typed shared distance definitions
  style.css              Responsive styles
public/                  Static files copied by Vite
vite.config.js           Vite and plugin configuration
tests/                   Calculation, UI, and build regression tests
.github/workflows/       Pull-request checks and GitHub Pages publishing
dist/                    Generated production files; ignored by Git
```

## Commands

| Command              | Purpose                                                                               |
| -------------------- | ------------------------------------------------------------------------------------- |
| `npm run dev`        | Vite development server with live reload                                              |
| `npm run typecheck`  | Check application types without emitting files                                        |
| `npm test`           | Run calculation and UI regression tests                                               |
| `npm run build`      | Compile/bundle JS and minify HTML/CSS; generate gzip/Brotli copies                    |
| `npm run compile`    | Alias for the production build                                                        |
| `npm run preview`    | Vite preview of `dist/` after a build                                                 |
| `npm run test:build` | Verify the production bundle and compressed assets after a build                      |
| `npm run check`      | Check formatting, run tests, type-check, build, and verify production/portable output |
| `npm run format`     | Format source, configuration, tests, and documentation                                |
| `npm run export`     | Build and export a portable HTML file into `../outputs/`                              |

Preact is the only runtime npm dependency. TypeScript checks the application in strict mode; Vite transpiles TS/TSX and bundles Preact into the static website. Vite, its minification/compression/single-file plugins, cpy-cli, Prettier, and Happy DOM are development-only tools. Versions are recorded in `package-lock.json` for reproducible installation.

## Build tools

All tools are installed by `npm ci` from `package.json`; there are no custom scripts to maintain:

- **Preact + TypeScript:** typed components and shared state, checked with `tsc --noEmit`.
- **Vite + @preact/preset-vite:** development server, production JS/CSS bundling and minification, and preview.
- **vite-plugin-minify:** HTML minification.
- **vite-plugin-compression2:** gzip and Brotli sidecars.
- **vite-plugin-singlefile:** portable HTML with JavaScript and CSS inlined.
- **cpy-cli:** copy the license and portable export to their destinations.

The portable build is generated in `portable/index.html`, then copied into `../outputs/running-pace-calculator.html`. It requires no local JavaScript/CSS files or server. Google Fonts are optional external resources; offline use falls back to system fonts.

## Build output and deployment

Never edit `dist/` directly: each build regenerates it. It contains minified `index.html`, fingerprinted JavaScript/CSS under `assets/`, their `.gz` and `.br` compressed copies, the MIT license, and `.nojekyll`. Fingerprinted filenames avoid stale browser caches after deployments.

The page uses ordinary minified assets. Precompressed copies are provided for hosts that support content negotiation; GitHub Pages is not configured here to serve those sidecars automatically.

Pull requests run formatting checks, tests, and a production build. Pushes to `main` run the same checks, then publish the generated `dist/` artifact to GitHub Pages. In repository settings, Pages must use **GitHub Actions** as its publishing source. Node.js 24 is used in CI.

## Calculation model

Constant-pace finish times use exact kilometer/mile conversions. VDOT uses the Daniels–Gilbert equations, and equivalent race times invert those equations numerically. Training paces are formula-based estimates and may differ from official V.O2 tables. Use a recent race result to estimate current training fitness. The UI includes the estimation method and a [training-intensity reference](https://vdoto2.com/learn-more/training-definitions).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the development workflow and attribution requirements.

## License

[MIT](LICENSE). Copyright (c) 2026 rcku. Third-party build tools and hosted fonts retain their respective licenses.
