# Stride — Running pace calculator

🤖 Built with OpenAI Codex

A responsive running calculator with pace-to-time, time-to-pace, and VDOT-to-time modes. Includes equivalent race performances and estimated training paces in kilometers and miles.

Website: https://rcku.github.io/pace-calculator/

## Edit and publish

Edit `dist/index.html`, `dist/style.css`, or `dist/app.js`, then commit and push to `main`. The GitHub Pages workflow checks JavaScript syntax and publishes `dist/` automatically. No build or dependencies are required.

GitHub Pages must use **Settings → Pages → Source → GitHub Actions**.

## Calculations

Race times in pace-to-time mode assume a constant pace. VDOT uses the Daniels–Gilbert equations. Training paces are formula-based estimates and may differ from official V.O2 tables. Use a recent race performance to estimate current training fitness.

## License

Licensed under the [MIT License](LICENSE). Copyright (c) 2026 rcku.
