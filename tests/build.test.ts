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

test("Home Screen metadata and icons work under the GitHub Pages subpath", async () => {
    const html = await readFile(
        new URL("../dist/index.html", import.meta.url),
        "utf8",
    );
    const window = new Window();
    try {
        window.document.write(html);
        const pageUrl = new URL("https://rcku.github.io/stride/");
        const manifestHref = window.document
            .querySelector('link[rel="manifest"]')
            ?.getAttribute("href");
        assert.ok(manifestHref);
        const manifestUrl = new URL(manifestHref, pageUrl);
        assert.equal(manifestUrl.pathname, "/stride/manifest.webmanifest");
        const manifest = JSON.parse(
            await readFile(
                new URL("../dist/" + manifestHref, import.meta.url),
                "utf8",
            ),
        );
        for (const member of ["id", "start_url", "scope"]) {
            assert.equal(
                new URL(manifest[member], manifestUrl).href,
                pageUrl.href,
            );
        }
        assert.equal(manifest.display, "standalone");
        const appleHref = window.document
            .querySelector('link[rel="apple-touch-icon"]')
            ?.getAttribute("href");
        assert.ok(appleHref);
        const images = [
            ...manifest.icons,
            { src: appleHref, sizes: "180x180" },
        ];
        assert.ok(
            manifest.icons.some((icon: { purpose: string }) =>
                icon.purpose.split(" ").includes("maskable"),
            ),
        );
        for (const icon of images) {
            const url = new URL(icon.src, manifestUrl);
            assert.ok(url.pathname.startsWith("/stride/icons/"));
            const png = await readFile(
                new URL("../dist/" + icon.src, import.meta.url),
            );
            assert.equal(
                png.subarray(0, 8).toString("hex"),
                "89504e470d0a1a0a",
            );
            assert.equal(
                `${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`,
                icon.sizes,
            );
        }
    } finally {
        await window.happyDOM.close();
    }
});
