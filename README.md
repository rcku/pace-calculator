# Stride — Running pace calculator

🤖 Built with OpenAI Codex

[Open the calculator](https://rcku.github.io/pace-calculator/)

A responsive browser calculator with three modes:

- **Pace → time:** finish times for track distances through the marathon.
- **Time → pace:** kilometer/mile pace and target VDOT for preset or custom distances.
- **VDOT → time:** equivalent race times, race paces, and estimated training paces.

## Get started

Install Node.js 24 or newer, then run:

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:5173`. Edit files in `src/` and refresh your browser to see changes.

## Project structure

```text
src/                     Readable application source
  index.html             Accessible UI and page content
  style.css              Responsive styles
  app.js                 UI state and event handlers
  calculations.js        Pure pace and VDOT calculations
  distances.js           Shared distance definitions
scripts/
  build.mjs              Bundle, minify, and compress production files
  serve.mjs              Local source/production preview server
  export.mjs             Export a self-contained HTML calculator
tests/                   Calculation, UI, and build regression tests
.github/workflows/       Pull-request checks and GitHub Pages publishing
dist/                    Generated production files; ignored by Git
```

## Commands

| Command              | Purpose                                                            |
| -------------------- | ------------------------------------------------------------------ |
| `npm run dev`        | Serve readable source locally                                      |
| `npm test`           | Run calculation and UI regression tests                            |
| `npm run build`      | Compile/bundle JS and minify HTML/CSS; generate gzip/Brotli copies |
| `npm run compile`    | Alias for the production build                                     |
| `npm run preview`    | Serve `dist/` after a build                                        |
| `npm run test:build` | Verify the production bundle and compressed assets after a build   |
| `npm run check`      | Check formatting, run tests, build, and verify build output        |
| `npm run format`     | Format source, scripts, tests, and documentation                   |
| `npm run export`     | Build and export a portable HTML file into `../outputs/`           |

There are no runtime npm dependencies. esbuild, the HTML minifier, Prettier, and Happy DOM are development-only tools. Versions are recorded in `package-lock.json` for reproducible installation.

## Build output and deployment

Never edit `dist/` directly: each build regenerates it. It contains `index.html`, `app.min.js`, `style.min.css`, their `.gz` and `.br` compressed copies, the MIT license, and `.nojekyll`.

The page uses ordinary minified assets. Precompressed copies are provided for hosts that support content negotiation; GitHub Pages is not configured here to serve those sidecars automatically.

Pull requests run formatting checks, tests, and a production build. Pushes to `main` run the same checks, then publish the generated `dist/` artifact to GitHub Pages. In repository settings, Pages must use **GitHub Actions** as its publishing source. Node.js 24 is used in CI.

## Calculation model

Constant-pace finish times use exact kilometer/mile conversions. VDOT uses the Daniels–Gilbert equations, and equivalent race times invert those equations numerically. Training paces are formula-based estimates and may differ from official V.O2 tables. Use a recent race result to estimate current training fitness. The UI includes the estimation method and a [training-intensity reference](https://vdoto2.com/learn-more/training-definitions).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the development workflow and attribution requirements.

## License

[MIT](LICENSE). Copyright (c) 2026 rcku. Third-party build tools and hosted fonts retain their respective licenses.
