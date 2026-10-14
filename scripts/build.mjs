import { build } from "esbuild";
import { minify } from "html-minifier-terser";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { gzipSync, brotliCompressSync, constants } from "node:zlib";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = path.join(root, "dist");
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await build({
  absWorkingDir: root,
  entryPoints: ["src/app.js"],
  outfile: "dist/app.min.js",
  bundle: true,
  minify: true,
  format: "iife",
  target: ["es2020"],
  charset: "utf8",
  banner: { js: "/*! MIT · 🤖 Built with OpenAI Codex */" },
});
await build({
  absWorkingDir: root,
  entryPoints: ["src/style.css"],
  outfile: "dist/style.min.css",
  minify: true,
  target: ["es2020"],
  charset: "utf8",
});
const html = (await readFile(path.join(root, "src/index.html"), "utf8"))
  .replace('href="style.css"', 'href="style.min.css"')
  .replace('type="module" src="app.js"', 'defer src="app.min.js"');
await writeFile(
  path.join(dist, "index.html"),
  await minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
  }),
);
await writeFile(path.join(dist, ".nojekyll"), "");
await writeFile(
  path.join(dist, "LICENSE"),
  await readFile(path.join(root, "LICENSE")),
);
// Precompressed copies are useful for hosts configured for content negotiation.
for (const name of await readdir(dist)) {
  if (!/\.(html|css|js)$/.test(name)) continue;
  const content = await readFile(path.join(dist, name));
  const gzip = gzipSync(content, { level: 9 });
  const brotli = brotliCompressSync(content, {
    params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
  });
  await writeFile(path.join(dist, `${name}.gz`), gzip);
  await writeFile(path.join(dist, `${name}.br`), brotli);
  console.log(
    `${name}: ${content.length} bytes; gzip ${gzip.length}; brotli ${brotli.length}`,
  );
}
