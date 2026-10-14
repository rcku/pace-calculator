# Deployment

🤖 Created with OpenAI Codex

Never edit `dist/` directly: each build regenerates it. It contains minified `index.html`, fingerprinted JavaScript/CSS under `assets/`, their `.gz` and `.br` compressed copies, the MIT license, and `.nojekyll`. Fingerprinted filenames avoid stale browser caches after deployments.

The page uses ordinary minified assets. Precompressed copies are provided for hosts that support content negotiation; GitHub Pages is not configured here to serve those sidecars automatically.

Pull requests run formatting checks, tests, and a production build. Pushes to `main` run the same checks, then publish the generated `dist/` artifact to GitHub Pages. In repository settings, Pages must use **GitHub Actions** as its publishing source. Node.js 24 is used in CI.

See [development](development.md) for build and preview commands.
