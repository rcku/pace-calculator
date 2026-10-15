import type { Theme } from "../theme.ts";
import { ThemeToggle } from "./ThemeToggle.tsx";

export function Header({
    theme,
    onToggleTheme,
    conversion = false,
}: {
    theme: Theme;
    onToggleTheme: () => void;
    conversion?: boolean;
}) {
    const actions = (
        <div class="header-actions">
            <a
                id={conversion ? undefined : "conversion-link"}
                class="chart-link"
                href={conversion ? "#" : "#pace-conversion"}
            >
                {conversion
                    ? "← Back to calculator"
                    : "Pace conversion chart ↗"}
            </a>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
    );
    return (
        <header>
            <a class="brand" href="#" aria-label="Stride home">
                <span class="mark">↗</span> stride
                <span class="brand-dot">.</span>
            </a>
            {conversion ? (
                actions
            ) : (
                <div class="header-tools">
                    <span class="eyebrow">THE RUNNING PACE CALCULATOR</span>
                    {actions}
                </div>
            )}
        </header>
    );
}
