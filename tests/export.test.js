import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Window } from "happy-dom";

test("portable HTML works without local scripts or stylesheets", async () => {
  const window = new Window({
    settings: {
      disableCSSFileLoading: true,
      disableJavaScriptFileLoading: true,
      disableJavaScriptEvaluation: true,
    },
  });
  try {
    window.document.write(
      await readFile(
        new URL("../portable/index.html", import.meta.url),
        "utf8",
      ),
    );
    assert.equal(
      window.document.querySelectorAll('script[src],link[rel="stylesheet"]')
        .length,
      0,
    );
    assert.ok(window.document.querySelector("style"));
    const script = window.document.querySelector("script").textContent;
    window.happyDOM.settings.disableJavaScriptEvaluation = false;
    window.eval(script);
    assert.equal(
      window.document.querySelectorAll("#race-list .race-row").length,
      18,
    );
    window.document.getElementById("time-tab").click();
    assert.equal(
      window.document.getElementById("target-vdot").textContent,
      "35.8",
    );
    window.document.getElementById("vdot-tab").click();
    assert.equal(
      window.document.querySelectorAll("#training-rows tr").length,
      5,
    );
  } finally {
    await window.happyDOM.close();
  }
});
