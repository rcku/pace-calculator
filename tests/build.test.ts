import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Window } from "happy-dom";

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
            await readFile(
                new URL("../dist/" + source, import.meta.url),
                "utf8",
            ),
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
            window.document.querySelectorAll(
                "#training-rows .training-pace-row",
            ).length,
            5,
        );
        const footer = window.document.querySelector("footer");
        assert.ok(footer);
        assert.doesNotMatch(footer.textContent, /Built with OpenAI Codex/);
        const repository = footer.querySelector(
            'a[href="https://github.com/rcku/stride"]',
        );
        assert.ok(repository?.querySelector("svg"));
    } finally {
        await window.happyDOM.close();
    }
});
