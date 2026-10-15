import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Window, type Element } from "happy-dom";

export async function mountApp() {
    const window = new Window({
        settings: {
            disableCSSFileLoading: true,
            disableJavaScriptFileLoading: true,
        },
    });
    window.localStorage.setItem("stride-theme", "dark");
    window.document.write(
        await readFile(
            new URL("../../src/index.html", import.meta.url),
            "utf8",
        ),
    );
    const previousWindow = Object.getOwnPropertyDescriptor(
        globalThis,
        "window",
    );
    const previousDocument = Object.getOwnPropertyDescriptor(
        globalThis,
        "document",
    );
    Object.defineProperty(globalThis, "window", {
        configurable: true,
        value: window,
    });
    Object.defineProperty(globalThis, "document", {
        configurable: true,
        value: window.document,
    });
    const { act } = await import("preact/test-utils");
    const { render, h } = await import("preact");
    const { App } = await import("../../src/App.tsx");
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
    const click = (element: Element | null) => {
        assert.ok(element instanceof window.HTMLElement);
        return act(() => element.click());
    };
    const change = (id: string, value: string) =>
        act(() => {
            input(id).value = value;
            get(id).dispatchEvent(new window.Event("input", { bubbles: true }));
        });
    const navigate = (hash: string) =>
        act(() => {
            window.location.hash = hash;
            window.dispatchEvent(new window.Event("hashchange"));
        });
    const key = (id: string, key: string) =>
        act(() => {
            get(id).dispatchEvent(
                new window.KeyboardEvent("keydown", { key, bubbles: true }),
            );
        });
    const cleanup = async () => {
        try {
            act(() => render(null, get("app")));
        } finally {
            if (previousWindow)
                Object.defineProperty(globalThis, "window", previousWindow);
            else Reflect.deleteProperty(globalThis, "window");
            if (previousDocument)
                Object.defineProperty(globalThis, "document", previousDocument);
            else Reflect.deleteProperty(globalThis, "document");
            await window.happyDOM.close();
        }
    };
    try {
        await act(async () => render(h(App, {}), get("app")));
    } catch (error) {
        await cleanup();
        throw error;
    }
    return { window, get, input, click, change, navigate, key, cleanup };
}
