import { GitHubLink } from "./components/GitHubLink.tsx";
import type { Theme } from "./theme.ts";
import { Header } from "./components/Header.tsx";
import { type Unit } from "./distances.ts";
import { calculate, paceResult, type PaceInput } from "./model.ts";
import { TimeInputs, UnitSwitch } from "./components/Inputs.tsx";
import { PaceConversions } from "./components/PaceConversions.tsx";

export function PaceConversionPage({
    theme,
    onToggleTheme,
    pace,
    unit,
    onPaceChange,
    onUnitChange,
}: {
    theme: Theme;
    onToggleTheme: () => void;
    pace: PaceInput;
    unit: Unit;
    onPaceChange: (pace: PaceInput) => void;
    onUnitChange: (unit: Unit) => void;
}) {
    const result = calculate(() => paceResult(pace, unit));
    const fields = ["minutes", "seconds"] as const;
    return (
        <main class="conversion-page">
            <Header theme={theme} onToggleTheme={onToggleTheme} conversion />
            <section class="intro">
                <span class="kicker">PACE CONVERSION</span>
                <h1>
                    Find the same pace.
                    <br />
                    <span>In either unit.</span>
                </h1>
                <p>
                    Convert between min/km and min/mile, or compare common
                    paces.
                </p>
            </section>
            <section class="conversion-tool" aria-label="Pace conversion">
                <div class="controls">
                    <UnitSwitch
                        unit={unit}
                        onChange={onUnitChange}
                        label="Pace unit"
                    />
                    <TimeInputs
                        fields={fields.map((key) => ({
                            id: `pace-${key === "minutes" ? "min" : "sec"}`,
                            label: key,
                            value: pace[key],
                            max: key === "minutes" ? 999 : 59,
                        }))}
                        onChange={(index, value) =>
                            onPaceChange({ ...pace, [fields[index]]: value })
                        }
                    />
                    <p
                        id="error"
                        class="error"
                        role="alert"
                        hidden={!result.error}
                    >
                        {result.error}
                    </p>
                </div>
                <div class="conversion-chart">
                    <PaceConversions current={result.data?.secKm} />
                </div>
            </section>
            <footer>
                <GitHubLink />
                <a class="chart-link" href="#">
                    Back to calculator
                </a>
            </footer>
        </main>
    );
}
