import { useEffect, useState } from "preact/hooks";

export type Theme = "light" | "dark";
const storageKey = "stride-theme";

export function readTheme(): Theme {
    try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved === "light" || saved === "dark") return saved;
    } catch {
        // Theme switching also works when browser storage is unavailable.
    }
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(readTheme);
    useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);
    function toggleTheme() {
        const next = theme === "light" ? "dark" : "light";
        setTheme(next);
        try {
            window.localStorage.setItem(storageKey, next);
        } catch {
            // Keep the selected theme for this session without storage.
        }
    }
    return { theme, toggleTheme };
}
