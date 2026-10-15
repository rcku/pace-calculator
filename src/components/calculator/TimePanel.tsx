import {
    MILE_KM,
    raceDistances,
    milesText,
    unitLabel,
    type Unit,
} from "../../distances.ts";
import { clock, paceText } from "../../calculations.ts";
import type { Mode, FinishInput, timeResult } from "../../model.ts";
import { PanelHeading, TimeInputs, UnitSwitch } from "../Inputs.tsx";
const finishFields = ["hours", "minutes", "seconds"] as const;

export function TimePanel({
    mode,
    finish,
    unit,
    onFinishChange,
    onUnitChange,
}: {
    mode: Mode;
    finish: FinishInput;
    unit: Unit;
    onFinishChange: (finish: FinishInput) => void;
    onUnitChange: (unit: Unit) => void;
}) {
    return (
        <div
            id="time-panel"
            role="tabpanel"
            aria-labelledby="time-tab"
            hidden={mode !== "time"}
        >
            <PanelHeading
                step="01 / YOUR TARGET FINISH"
                title="What’s your finish-time goal?"
                hint="Choose a distance and enter your finish time."
            />
            <label class="field-label" for="distance">
                Distance
            </label>
            <select
                id="distance"
                value={finish.distance}
                onInput={(event) =>
                    onFinishChange({
                        ...finish,
                        distance: event.currentTarget.value,
                    })
                }
            >
                {raceDistances.map(([name, km]) => (
                    <option key={km} value={km}>
                        {name} ({milesText(km)})
                    </option>
                ))}
                <option value="custom">Custom distance</option>
            </select>
            <div id="custom-fields" hidden={finish.distance !== "custom"}>
                <label class="field-label" for="custom-distance">
                    Custom distance
                </label>
                <div class="custom-row">
                    <input
                        id="custom-distance"
                        type="number"
                        min="0.001"
                        step="any"
                        value={finish.customDistance}
                        onInput={(event) =>
                            onFinishChange({
                                ...finish,
                                customDistance: event.currentTarget.value,
                            })
                        }
                    />
                    <select
                        id="distance-unit"
                        aria-label="Custom distance unit"
                        value={finish.customUnit}
                        onInput={(event) =>
                            onFinishChange({
                                ...finish,
                                customUnit: event.currentTarget.value as Unit,
                            })
                        }
                    >
                        <option value="km">km</option>
                        <option value="mi">miles</option>
                    </select>
                </div>
            </div>
            <TimeInputs
                finish
                fields={finishFields.map((key) => ({
                    id: key,
                    label: key,
                    value: finish[key],
                    max: key === "hours" ? 999 : 59,
                }))}
                onChange={(index, value) =>
                    onFinishChange({
                        ...finish,
                        [finishFields[index]]: value,
                    })
                }
            />
            <UnitSwitch
                unit={unit}
                onChange={onUnitChange}
                label="Result pace unit"
            />
        </div>
    );
}

export function TimeResults({
    mode,
    unit,
    time,
}: {
    mode: Mode;
    unit: Unit;
    time?: ReturnType<typeof timeResult>;
}) {
    return (
        <div id="target-results" hidden={mode !== "time"} aria-live="polite">
            <span class="step">02 / YOUR AVERAGE PACE</span>
            <h2>Here’s your target pace.</h2>
            <div class="target-big" id="target-pace">
                {time
                    ? paceText(time.secKm * (unit === "mi" ? MILE_KM : 1))
                    : "—"}
                <span>
                    {time
                        ? `min / ${unitLabel(unit)}`
                        : "Enter valid values to calculate"}
                </span>
            </div>
            <div class="equivalent" id="equivalent">
                {time &&
                    `Equivalent to ${paceText(time.secKm * (unit === "km" ? MILE_KM : 1))} min / ${unitLabel(unit === "km" ? "mi" : "km")}`}
            </div>
            <div class="vdot-card">
                <div class="vdot-heading">
                    <span>Target VDOT</span>
                    <strong id="target-vdot">{time?.score || "—"}</strong>
                </div>
                <p id="vdot-note">
                    {!time
                        ? "Enter a valid distance and finish time to estimate target VDOT."
                        : time.score
                          ? "Goal fitness estimated from this race time, not a laboratory VO₂max measurement. Use a recent race result to estimate current fitness."
                          : "VDOT cannot be meaningfully estimated for this distance and time."}
                </p>
            </div>
            <div class="target-detail" id="target-detail">
                {time &&
                    `${clock(time.seconds)} finish time over ${time.label}.`}
            </div>
            <p class="target-note">
                Find your rhythm and hold it from start to finish.
            </p>
        </div>
    );
}
