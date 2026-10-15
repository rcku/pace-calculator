# Contributing

🤖 Created with OpenAI Codex

1. Fork the repository and create a branch for your change.
2. Use Node.js 24 or newer and install dependencies with `npm ci`.
3. Edit the readable files in `src/`. Do not commit generated `dist/` files or `node_modules/`.
4. Add regression tests for changes to calculations or user interactions.
5. Run `npm run format` and `npm run check` before opening a pull request.
6. Explain the user-visible change and relevant validation in your PR description.

Use `npm run dev` while developing and `npm run build` followed by `npm run preview` to inspect the production version. The application uses Preact and strict TypeScript. Put reusable UI components in `src/components/`, input validation in `src/model.ts`, and pure formulas in `src/calculations.ts`. Vite handles JSX and TypeScript; `npm run check` runs type checking once before tests and the production build.

Use four spaces for indentation; `.editorconfig` defines this convention for editors and Prettier.

Keep changes focused and preserve accessible labels, keyboard navigation, and responsive layouts. Report bugs through GitHub Issues with the inputs, expected result, and actual result.

## AI attribution

For AI-generated or materially modified work, name the tool truthfully. For OpenAI Codex contributions, include a blank line followed by `🤖 Built with OpenAI Codex` in commit messages, and an **AI assistance** section containing `🤖 Created with OpenAI Codex` in PR descriptions. Preserve human attribution and existing copyright/license notices.

See [development](development.md) for project structure and commands.
