# Deployment

🤖 Created with OpenAI Codex

Never edit `dist/` directly: each build regenerates it. It contains `index.html`, fingerprinted minified JavaScript/CSS under `assets/`, the MIT license, and `.nojekyll`. Fingerprinted filenames avoid stale browser caches after deployments.

Run `npm run check` to verify and build the site, then `npm run preview` to inspect it locally. `npm run build` generates the same production files without running checks. Publish the entire `dist/` directory to a static host.

Pull requests run formatting checks, tests, and a production build. Pushes to `main` run the same checks, then publish the generated `dist/` artifact to GitHub Pages. In repository settings, Pages must use **GitHub Actions** as its publishing source. Node.js 24 is used in CI.

See [development](development.md) for build and preview commands.

## iPhone Home Screen

Open [Stride](https://rcku.github.io/stride/) in Safari, choose **Share → Add to Home Screen**, and leave **Open as Web App** enabled if shown. The installed app is named Stride and launches the calculator in standalone mode. If an existing installation retains its old icon, remove its Home Screen entry and add it again.

The manifest and icon URLs are relative so they work under the GitHub Pages `/stride/` path. `public/icons/stride.svg` is the editable icon source; export opaque square PNGs at 180, 192, and 512 pixels to replace the corresponding files in that directory. Keep the arrow inside the central safe area so system icon masks do not crop it. iOS supplies the rounded corners.

The layout respects device safe areas in portrait and landscape, uses a compact header in standalone mode on phones, and updates the browser theme color when the theme changes. Offline caching is not included; launching still requires a network connection.
