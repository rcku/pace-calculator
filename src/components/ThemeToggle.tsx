import { Icon } from "./Icon.tsx";
import type { Theme } from "../theme.ts";

export function ThemeToggle({
    theme,
    onToggle,
}: {
    theme: Theme;
    onToggle: () => void;
}) {
    const dark = theme === "dark";
    return (
        <button
            class="theme-toggle"
            type="button"
            aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
            aria-pressed={dark}
            onClick={onToggle}
        >
            <Icon name={dark ? "sun" : "moon"} />
            <span class="theme-toggle-label">
                {dark ? "Light" : "Dark"} mode
            </span>
        </button>
    );
}
