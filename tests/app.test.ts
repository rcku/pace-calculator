import test, { beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { mountApp } from "./helpers/app.ts";

let app: Awaited<ReturnType<typeof mountApp>>;
beforeEach(async () => {
    app = await mountApp();
});
afterEach(async () => {
    await app.cleanup();
});

test("pace results update across units and distances", () => {
    const { window, get, input, click, change } = app;
    assert.equal(
        window.document.querySelectorAll("#race-list .race-row").length,
        18,
    );
    assert.equal(input("pace-min").value, "4");
    assert.equal(input("pace-sec").value, "5");
    assert.match(get("race-list").textContent, /0:40:50/);
    click(window.document.querySelector('#pace-panel [data-unit="mi"]'));
    assert.match(get("pace-badge").textContent, /\/ mile/);
    change("pace-min", "8");
    change("pace-sec", "0");
    assert.match(get("race-list").textContent, /0:08:00/);
});

test("mode tabs support pointer and keyboard navigation", () => {
    const { get, click, key } = app;
    click(get("time-tab"));
    assert.equal(get("time-panel").hidden, false);
    assert.equal(get("pace-panel").hidden, true);
    key("time-tab", "ArrowRight");
    assert.equal(get("vdot-tab").getAttribute("aria-selected"), "true");
    key("vdot-tab", "Home");
    assert.equal(get("pace-tab").getAttribute("aria-selected"), "true");
    key("pace-tab", "End");
    assert.equal(get("vdot-tab").getAttribute("aria-selected"), "true");
});

test("invalid pace, finish time, and VDOT show errors and clear results", () => {
    const { get, click, change, input } = app;
    change("pace-sec", "60");
    assert.equal(get("error").hidden, false);
    assert.equal(get("pace-badge").textContent, "—");
    change("pace-sec", "0");
    assert.equal(get("error").hidden, true);
    click(get("time-tab"));
    change("seconds", "60");
    assert.equal(input("vdot-input").value, "");
    assert.equal(get("error").hidden, false);
    change("seconds", "0");
    assert.equal(get("error").hidden, true);
    click(get("vdot-tab"));
    change("vdot-input", "");
    assert.equal(get("training-rows").textContent, "");
    assert.equal(get("error").hidden, false);
});

test("target finish changes synchronize equivalent race and training VDOT", () => {
    const { window, get, input, click, change } = app;
    click(get("time-tab"));
    assert.equal(input("distance").value, "42.195");
    assert.equal(input("hours").value, "2");
    assert.equal(input("minutes").value, "52");
    assert.equal(get("target-vdot").textContent, "56.5");
    change("distance", "10");
    change("hours", "0");
    change("minutes", "50");
    assert.equal(input("vdot-input").value, "40.0");
    assert.equal(get("target-vdot").textContent, "40.0");
    click(get("vdot-tab"));
    assert.equal(
        window.document.querySelectorAll("#vdot-race-list .race-row").length,
        4,
    );
    assert.equal(
        window.document.querySelectorAll("#training-rows .training-pace-row")
            .length,
        5,
    );
    assert.match(get("vdot-race-list").textContent, /\/ km/);
    change("vdot-input", "45");
    assert.equal(get("vdot-badge").textContent, "VDOT 45");
    click(get("time-tab"));
    assert.equal(input("vdot-input").value, "40.0");
});

test("custom distances accept miles", () => {
    const { get, click, change } = app;
    click(get("time-tab"));
    change("distance", "custom");
    change("custom-distance", "5");
    change("distance-unit", "mi");
    change("hours", "0");
    change("minutes", "40");
    assert.match(get("equivalent").textContent, /8:00 min \/ mile/);
    assert.match(get("target-detail").textContent, /5 miles/);
});

test("conversion navigation preserves pace and highlights only valid input", () => {
    const { window, get, click, change, navigate } = app;
    const currentRows = () =>
        window.document.querySelectorAll(
            '#pace-conversions tr[aria-current="true"]',
        );
    assert.equal(window.document.querySelector("#pace-conversions"), null);
    assert.equal(
        get("conversion-link").getAttribute("href"),
        "#pace-conversion",
    );
    navigate("#pace-conversion");
    assert.equal(window.document.querySelector("#race-results"), null);
    assert.equal(
        window.document.querySelectorAll("#pace-conversions tr").length,
        51,
    );
    assert.match(currentRows()[0].textContent, /4:05Your pace6:34/);
    change("pace-sec", "15");
    assert.equal(currentRows().length, 1);
    assert.match(currentRows()[0].textContent, /4:15Your pace6:50/);
    change("pace-sec", "60");
    assert.equal(currentRows().length, 0);
    change("pace-sec", "30");
    navigate("");
    assert.equal(window.document.querySelector("#pace-conversions"), null);
    assert.match(get("pace-badge").textContent, /4:30/);
    click(window.document.querySelector('#pace-panel [data-unit="mi"]'));
    change("pace-min", "8");
    change("pace-sec", "0");
    navigate("#pace-conversion");
    assert.match(currentRows()[0].textContent, /4:58Your pace8:00/);
});

test("theme preference persists across calculator and conversion views", async () => {
    const { window, click, navigate } = app;
    const themeButton = () => window.document.querySelector(".theme-toggle");
    assert.equal(window.document.documentElement.dataset.theme, "dark");
    click(themeButton());
    assert.equal(window.document.documentElement.dataset.theme, "light");
    assert.equal(window.localStorage.getItem("stride-theme"), "light");
    assert.equal(
        themeButton()?.getAttribute("aria-label"),
        "Switch to dark mode",
    );
    navigate("#pace-conversion");
    assert.equal(window.document.documentElement.dataset.theme, "light");
    click(themeButton());
    assert.equal(window.document.documentElement.dataset.theme, "dark");
    assert.equal(window.localStorage.getItem("stride-theme"), "dark");
    const { readTheme } = await import("../src/theme.ts");
    assert.equal(readTheme(), "dark");
});

test("training workout sections expand independently and keep pace updates", () => {
    const { get, click, change } = app;
    click(get("vdot-tab"));
    const examples = [
        ["easy-run", "Recovery run"],
        ["marathon", "Marathon blocks"],
        ["threshold", "2 km cruise intervals"],
        ["interval", "Three-minute intervals"],
        ["repetition", "200 m repeats"],
    ];
    for (const [type, example] of examples) {
        const toggle = get(`training-${type}-toggle`);
        const workouts = get(`training-${type}-workouts`);
        assert.equal(toggle.getAttribute("aria-expanded"), "false");
        assert.equal(toggle.getAttribute("aria-controls"), workouts.id);
        assert.equal(workouts.closest("tr")?.hasAttribute("hidden"), true);
        click(toggle);
        assert.equal(toggle.getAttribute("aria-expanded"), "true");
        assert.equal(workouts.closest("tr")?.hasAttribute("hidden"), false);
        assert.match(workouts.textContent, new RegExp(example));
    }
    const before = get("training-rows").textContent;
    change("vdot-input", "50");
    assert.notEqual(get("training-rows").textContent, before);
    for (const [type] of examples) {
        const toggle = get(`training-${type}-toggle`);
        assert.equal(toggle.getAttribute("aria-expanded"), "true");
        click(toggle);
        assert.equal(toggle.getAttribute("aria-expanded"), "false");
        assert.equal(
            get(`training-${type}-workouts`)
                .closest("tr")
                ?.hasAttribute("hidden"),
            true,
        );
    }
});

test("marathon examples show distance options, strides, and fitness-specific repeat guidance", () => {
    const { window, get, click, change } = app;
    click(get("vdot-tab"));
    assert.match(
        window.document.querySelector(".training-context")!.textContent,
        /80–120 km\/week/,
    );
    click(get("training-repetition-toggle"));
    const repetition = get("training-repetition-workouts");
    for (const name of [
        "300 m repeats",
        "400 m repeats",
        "600 m repeats",
        "Strides",
    ]) {
        assert.ok(repetition.textContent.includes(name));
    }
    const r600 = () =>
        Array.from(repetition.querySelectorAll("li")).find(
            (item) =>
                item.querySelector("strong")?.textContent ===
                "600 m repeats · R",
        )!;
    assert.match(r600().textContent, /4–6 × 600 m/);
    assert.match(r600().textContent, /1:57 per repeat/);
    change("vdot-input", "50");
    assert.match(r600().textContent, /2:10.*2-minute R limit/);
    assert.doesNotMatch(r600().textContent, /4–6 × 600 m/);
    click(get("training-interval-toggle"));
    const intervals = get("training-interval-workouts");
    for (const name of [
        "400 m repeats",
        "600 m repeats",
        "800 m repeats",
        "1 km repeats",
    ]) {
        assert.ok(intervals.textContent.includes(name));
    }
    assert.match(intervals.textContent, /3:50 per repeat/);
    assert.match(intervals.textContent, /2:53–3:50 of easy jogging/);
    click(get("training-easy-run-toggle"));
    assert.match(get("training-easy-run-workouts").textContent, /24–32 km/);
    assert.match(get("training-easy-run-workouts").textContent, /strides/);
});
