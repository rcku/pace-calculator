import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Window, type Element } from "happy-dom";

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
  const previousDocument = Object.getOwnPropertyDescriptor(
    globalThis,
    "document",
  );
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: window.document,
  });
  const get = (id: string) => {
    const element = window.document.getElementById(id);
    assert.ok(
      element instanceof window.HTMLElement,
      `Missing HTML element #${id}`,
    );
    return element;
  };
  const input = (id: string) => {
    const element = get(id);
    assert.ok(
      element instanceof window.HTMLInputElement ||
        element instanceof window.HTMLSelectElement,
    );
    return element;
  };
  const { act } = await import("preact/test-utils");
  const click = (element: Element | null) => {
    assert.ok(element instanceof window.HTMLElement);
    return act(() => element.click());
  };
  const change = (id: string, value: string) =>
    act(() => {
      input(id).value = value;
      get(id).dispatchEvent(new window.Event("input", { bubbles: true }));
    });
  try {
    await act(async () => {
      await import("../src/main.tsx");
    });
    assert.equal(document.querySelectorAll("#race-list .race-row").length, 18);
    assert.match(get("race-list").textContent, /0:55:00/);
    click(get("time-tab"));
    change("minutes", "50");
    assert.equal(input("vdot-input").value, "40.0");
    click(get("vdot-tab"));
    assert.equal(
      document.querySelectorAll("#vdot-race-list .race-row").length,
      4,
    );
    assert.equal(document.querySelectorAll("#training-rows tr").length, 5);
    assert.match(get("vdot-race-list").textContent, /\/ km/);
    change("vdot-input", "");
    assert.equal(get("training-rows").textContent, "");
    assert.equal(get("error").hidden, false);
    click(get("time-tab"));
    change("distance", "custom");
    change("custom-distance", "5");
    change("distance-unit", "mi");
    change("minutes", "40");
    assert.match(get("equivalent").textContent, /8:00 min \/ mile/);
    change("seconds", "60");
    assert.equal(input("vdot-input").value, "");
    change("seconds", "0");
    assert.equal(get("error").hidden, true);
    click(get("pace-tab"));
    click(window.document.querySelector('#pace-panel [data-unit="mi"]'));
    assert.match(get("pace-badge").textContent, /\/ mile/);
    act(() => {
      get("pace-tab").dispatchEvent(
        new window.KeyboardEvent("keydown", { key: "End", bubbles: true }),
      );
    });
    assert.equal(get("vdot-tab").getAttribute("aria-selected"), "true");
  } finally {
    if (previousDocument)
      Object.defineProperty(globalThis, "document", previousDocument);
    else Reflect.deleteProperty(globalThis, "document");
    await window.happyDOM.close();
  }
});
