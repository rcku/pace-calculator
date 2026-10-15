# Deployment

🤖 Created with OpenAI Codex

Never edit `dist/` directly: each build regenerates it. It contains `index.html`, fingerprinted minified JavaScript/CSS under `assets/`, the MIT license, and `.nojekyll`. Fingerprinted filenames avoid stale browser caches after deployments.

Run `npm run check` to verify and build the site, then `npm run preview` to inspect it locally. `npm run build` generates the same production files without running checks. Publish the entire `dist/` directory to a static host.

Pull requests run formatting checks, tests, and a production build. Pushes to `main` run the same checks, then publish the generated `dist/` artifact to GitHub Pages. In repository settings, Pages must use **GitHub Actions** as its publishing source. Node.js 24 is used in CI.

See [development](development.md) for build and preview commands.
