import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { gunzipSync, brotliDecompressSync } from "node:zlib";
import { Window } from "happy-dom";

test("compressed assets reproduce the built files exactly", async () => {
  const files = (
    await readdir(new URL("../dist/", import.meta.url), { recursive: true })
  ).filter((name) => /\.(html|js|css)$/.test(name));
  assert.equal(files.length, 3);
  for (const name of files) {
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
  assert.match(html, /assets\/[^" ]+\.css/);
  assert.match(html, /assets\/[^" ]+\.js/);

  const window = new Window({
    settings: {
      disableCSSFileLoading: true,
      disableJavaScriptFileLoading: true,
    },
  });
  try {
    window.document.write(html);
    const script = window.document.querySelector("script[src]");
    assert.ok(script);
    const source = script.getAttribute("src");
    assert.ok(source);
    window.eval(
      await readFile(new URL("../dist/" + source, import.meta.url), "utf8"),
    );
    assert.equal(
      window.document.querySelectorAll("#race-list .race-row").length,
      18,
    );
    const tab = window.document.getElementById("vdot-tab");
    assert.ok(tab instanceof window.HTMLElement);
    tab.click();
    await window.happyDOM.waitUntilComplete();
    assert.equal(
      window.document.querySelectorAll("#training-rows tr").length,
      5,
    );
    const footer = window.document.querySelector("footer");
    assert.ok(footer);
    assert.match(footer.textContent, /Built with OpenAI Codex/);
  } finally {
    await window.happyDOM.close();
  }
});
