import { readFile, writeFile, mkdir } from "node:fs/promises";
const output = new URL("../../outputs/", import.meta.url);
await mkdir(output, { recursive: true });
let html = await readFile(
  new URL("../dist/index.html", import.meta.url),
  "utf8",
);
const css = (
  await readFile(new URL("../dist/style.min.css", import.meta.url), "utf8")
).replace(/@import\s+url\([^;]+;/g, "");
const js = await readFile(
  new URL("../dist/app.min.js", import.meta.url),
  "utf8",
);
html = html
  .replace(/<link\b[^>]*href="style.min.css"[^>]*>/, `<style>${css}</style>`)
  .replace(
    /<script\b[^>]*src="app.min.js"[^>]*><\/script>/,
    `<script>${js.replace(/<\/script/gi, "<\\/script")}</script>`,
  )
  .replace('href="./"', 'href="#"');
await writeFile(new URL("running-pace-calculator.html", output), html);
console.log(
  "Exported self-contained calculator to outputs/running-pace-calculator.html",
);
