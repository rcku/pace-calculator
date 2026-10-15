import { TrainingPaces } from "../TrainingPaces.tsx";
import { equivalentFinishTime } from "../../calculations.ts";
import { equivalentRaces } from "../../distances.ts";
import type { Mode } from "../../model.ts";
import { PanelHeading } from "../Inputs.tsx";
import { RaceTable, ResultsHeading } from "../Results.tsx";

export function VdotPanel({
    mode,
    vdot,
    onVdotChange,
}: {
    mode: Mode;
    vdot: string;
    onVdotChange: (vdot: string) => void;
}) {
    return (
        <div
            id="vdot-panel"
            role="tabpanel"
            aria-labelledby="vdot-tab"
            hidden={mode !== "vdot"}
        >
            <PanelHeading
                step="01 / YOUR VDOT"
                title="One score. Four starting lines."
                hint="Enter a VDOT score to see equivalent race performances."
            />
            <label class="field-label" for="vdot-input">
                VDOT score
            </label>
            <input
                id="vdot-input"
                class="vdot-input"
                type="text"
                inputMode="decimal"
                value={vdot}
                onInput={(event) => {
                    const input = event.currentTarget;
                    input.value = input.value.replace(/,/g, ".");
                    onVdotChange(input.value);
                }}
            />
            <p class="target-note">
                Use your current score or explore a target VDOT.
            </p>
        </div>
    );
}

export function VdotResults({ mode, score }: { mode: Mode; score?: number }) {
    return (
        <div id="vdot-results" hidden={mode !== "vdot"}>
            <ResultsHeading
                step="02 / EQUIVALENT RACE TIMES"
                title="Your race equivalents."
                id="vdot-badge"
                badge={score ? `VDOT ${score}` : "—"}
            />
            <RaceTable
                id="vdot-race-list"
                races={equivalentRaces}
                showPace
                finishTime={
                    score ? (km) => equivalentFinishTime(km, score!) : undefined
                }
            />
            <p class="target-note">
                Estimated performances at the same VDOT, assuming you are
                prepared for each distance. These use distance-specific race
                paces.
            </p>
            <TrainingPaces score={score} />
        </div>
    );
}
