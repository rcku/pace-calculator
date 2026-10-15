import type { Unit } from "../../distances.ts";
import { races, unitLabel } from "../../distances.ts";
import { paceText } from "../../calculations.ts";
import type { Mode, PaceInput, paceResult } from "../../model.ts";
import { PanelHeading, TimeInputs, UnitSwitch } from "../Inputs.tsx";
import { ResultsHeading, RaceTable } from "../Results.tsx";
const paceFields = ["minutes", "seconds"] as const;

export function PacePanel({
    mode,
    pace,
    unit,
    onPaceChange,
    onUnitChange,
}: {
    mode: Mode;
    pace: PaceInput;
    unit: Unit;
    onPaceChange: (pace: PaceInput) => void;
    onUnitChange: (unit: Unit) => void;
}) {
    return (
        <div
            id="pace-panel"
            role="tabpanel"
            aria-labelledby="pace-tab"
            hidden={mode !== "pace"}
        >
            <PanelHeading
                step="01 / YOUR RUNNING PACE"
                title="How fast are you running?"
                hint="Enter your average pace per kilometer or mile."
            />
            <UnitSwitch unit={unit} onChange={onUnitChange} label="Pace unit" />
            <TimeInputs
                fields={paceFields.map((key) => ({
                    id: `pace-${key === "minutes" ? "min" : "sec"}`,
                    label: key,
                    value: pace[key],
                    max: key === "minutes" ? 999 : 59,
                }))}
                onChange={(index, value) =>
                    onPaceChange({ ...pace, [paceFields[index]]: value })
                }
            />
            <p class="example">Your pace. Every distance.</p>
        </div>
    );
}

export function PaceResults({
    mode,
    unit,
    result,
}: {
    mode: Mode;
    unit: Unit;
    result?: ReturnType<typeof paceResult>;
}) {
    return (
        <div id="race-results" hidden={mode !== "pace"}>
            <ResultsHeading
                step="02 / YOUR FINISH TIMES"
                title="Pick your starting line."
                id="pace-badge"
                badge={
                    result
                        ? `${paceText(result.seconds)} / ${unitLabel(unit)}`
                        : "—"
                }
            />
            <RaceTable
                id="race-list"
                races={[...races].reverse()}
                finishTime={result ? (km) => result!.secKm * km : undefined}
            />
        </div>
    );
}
