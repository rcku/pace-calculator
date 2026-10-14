import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { gunzipSync, brotliDecompressSync } from "node:zlib";
import { Window } from "happy-dom";

test("compressed assets reproduce the built files exactly", async () => {
  for (const name of ["index.html", "app.min.js", "style.min.css"]) {
    const url = new URL(`../dist/${name}`, import.meta.url),
      bytes = await readFile(url);
    assert.deepEqual(
      gunzipSync(await readFile(new URL(url.href + ".gz"))),
      bytes,
    );
    assert.deepEqual(
      brotliDecompressSync(await readFile(new URL(url.href + ".br"))),
      bytes,
    );
  }
});
test("production HTML and bundle initialize without source imports", async () => {
  const html = await readFile(
    new URL("../dist/index.html", import.meta.url),
    "utf8",
  );
  assert.match(html, /style.min.css/);
  assert.match(html, /app.min.js/);
  assert.doesNotMatch(html, /type="module"/);
  const window = new Window({
    settings: {
      disableCSSFileLoading: true,
      disableJavaScriptFileLoading: true,
    },
  });
  try {
    window.document.write(html);
    window.eval(
      await readFile(new URL("../dist/app.min.js", import.meta.url), "utf8"),
    );
    assert.equal(
      window.document.querySelectorAll("#race-list .race-row").length,
      18,
    );
    window.document.getElementById("vdot-tab").click();
    assert.equal(
      window.document.querySelectorAll("#training-rows tr").length,
      5,
    );
    assert.match(
      window.document.querySelector("footer").textContent,
      /Built with OpenAI Codex/,
    );
  } finally {
    await window.happyDOM.close();
  }
});
