import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Window } from "happy-dom";

test("calculator UI updates all modes, units, and invalid-input states", async () => {
  const window = new Window({
    settings: {
      disableCSSFileLoading: true,
      disableJavaScriptFileLoading: true,
    },
  });
  window.document.write(
    await readFile(new URL("../src/index.html", import.meta.url), "utf8"),
  );
  globalThis.document = window.document;
  const get = (id) => document.getElementById(id);
  const change = (id, value) => {
    get(id).value = value;
    get(id).dispatchEvent(new window.Event("input", { bubbles: true }));
  };
  try {
    await import("../src/app.js");
    assert.equal(document.querySelectorAll("#race-list .race-row").length, 18);
    assert.match(get("race-list").textContent, /0:55:00/);
    get("time-tab").click();
    change("minutes", "50");
    assert.equal(get("vdot-input").value, "40.0");
    get("vdot-tab").click();
    assert.equal(
      document.querySelectorAll("#vdot-race-list .race-row").length,
      4,
    );
    assert.equal(document.querySelectorAll("#training-rows tr").length, 5);
    assert.match(get("vdot-race-list").textContent, /\/ km/);
    change("vdot-input", "");
    assert.equal(get("training-rows").textContent, "");
    assert.equal(get("error").hidden, false);
    get("time-tab").click();
    change("distance", "custom");
    change("custom-distance", "5");
    change("distance-unit", "mi");
    change("minutes", "40");
    assert.match(get("equivalent").textContent, /8:00 min \/ mile/);
    change("seconds", "60");
    assert.equal(get("vdot-input").value, "");
    change("seconds", "0");
    assert.equal(get("error").hidden, true);
    get("pace-tab").click();
    document.querySelector('#pace-panel [data-unit="mi"]').click();
    assert.match(get("pace-badge").textContent, /\/ mile/);
    get("pace-tab").dispatchEvent(
      new window.KeyboardEvent("keydown", { key: "End", bubbles: true }),
    );
    assert.equal(get("vdot-tab").getAttribute("aria-selected"), "true");
  } finally {
    delete globalThis.document;
    await window.happyDOM.close();
  }
});
