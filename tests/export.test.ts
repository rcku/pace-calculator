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
            window.document.querySelectorAll(
                'script[src],link[rel="stylesheet"]',
            ).length,
            0,
        );
        assert.ok(window.document.querySelector("style"));
        const scriptElement = window.document.querySelector("script");
        assert.ok(scriptElement);
        const script = scriptElement.textContent;
        window.happyDOM.settings.disableJavaScriptEvaluation = false;
        window.eval(script);
        assert.equal(
            window.document.querySelectorAll("#race-list .race-row").length,
            18,
        );
        const timeTab = window.document.getElementById("time-tab");
        assert.ok(timeTab instanceof window.HTMLElement);
        timeTab.click();
        await window.happyDOM.waitUntilComplete();
        const target = window.document.getElementById("target-vdot");
        assert.ok(target);
        assert.equal(target.textContent, "56.5");
        const vdotTab = window.document.getElementById("vdot-tab");
        assert.ok(vdotTab instanceof window.HTMLElement);
        vdotTab.click();
        await window.happyDOM.waitUntilComplete();
        assert.equal(
            window.document.querySelectorAll(
                "#training-rows .training-pace-row",
            ).length,
            5,
        );
        const thresholdToggle = window.document.getElementById(
            "training-threshold-toggle",
        );
        assert.ok(thresholdToggle instanceof window.HTMLElement);
        thresholdToggle.click();
        await window.happyDOM.waitUntilComplete();
        assert.equal(thresholdToggle.getAttribute("aria-expanded"), "true");
        const workouts = window.document.getElementById(
            "training-threshold-workouts",
        );
        assert.ok(workouts);
        assert.equal(workouts.closest("tr")?.hasAttribute("hidden"), false);
        assert.match(workouts.textContent, /2 km cruise intervals/);
        window.location.hash = "#pace-conversion";
        window.dispatchEvent(new window.Event("hashchange"));
        await window.happyDOM.waitUntilComplete();
        assert.equal(window.document.querySelector("#race-results"), null);
        const footer = window.document.querySelector("footer");
        assert.ok(footer);
        assert.ok(
            footer?.querySelector(
                'a[href="https://github.com/rcku/stride"] svg',
            ),
        );
        assert.doesNotMatch(footer.textContent, /Built with OpenAI Codex/);
        assert.equal(
            window.document.querySelectorAll("#pace-conversions tr").length,
            51,
        );
        const rows = Array.from(
            window.document.querySelectorAll("#pace-conversions tr"),
        );
        for (const pace of [
            "2:35",
            "2:40",
            "3:05",
            "3:10",
            "4:20",
            "5:50",
            "5:55",
            "6:00",
            "6:30",
            "10:00",
        ]) {
            assert.ok(
                rows.some((row) =>
                    row.querySelector("th")?.textContent.startsWith(pace),
                ),
                `Missing chart pace ${pace}`,
            );
        }
        assert.ok(window.document.querySelector('a[href="#"]'));
        window.location.hash = "";
        window.dispatchEvent(new window.Event("hashchange"));
        await window.happyDOM.waitUntilComplete();
        assert.equal(window.document.querySelector("#pace-conversions"), null);
        assert.equal(
            window.document
                .getElementById("vdot-tab")
                ?.getAttribute("aria-selected"),
            "true",
        );
    } finally {
        await window.happyDOM.close();
    }
});
