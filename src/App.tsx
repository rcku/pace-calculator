import { useState } from "preact/hooks";
import { clock, paceText, equivalentFinishTime } from "./calculations.ts";
import {
  MILE_KM,
  races,
  raceDistances,
  equivalentRaces,
  milesText,
  unitLabel,
  type Unit,
} from "./distances.ts";
import {
  calculate,
  paceResult,
  timeResult,
  vdotScore,
  convertPace,
  initialPace,
  initialFinish,
  type Mode,
  type FinishInput,
} from "./model.ts";
import { PanelHeading, TimeInputs, UnitSwitch } from "./components/Inputs.tsx";
import {
  RaceTable,
  ResultsHeading,
  TrainingPaces,
} from "./components/Results.tsx";

const modes: readonly Mode[] = ["pace", "time", "vdot"];
const tabNames = {
  pace: "Pace → time",
  time: "Time → pace",
  vdot: "VDOT → time",
};

export function App() {
  const [mode, setMode] = useState<Mode>("pace");
  const [unit, setUnit] = useState<Unit>("km");
  const [pace, setPace] = useState(initialPace);
  const [finish, setFinish] = useState(initialFinish);
  const [vdot, setVdot] = useState("35.8");
  const paceCalculation = calculate(() => paceResult(pace, unit));
  const timeCalculation = calculate(() => timeResult(finish));
  const vdotCalculation = calculate(() => vdotScore(vdot));
  const time = timeCalculation.data;
  const error = {
    pace: paceCalculation.error,
    time: timeCalculation.error,
    vdot: vdotCalculation.error,
  }[mode];

  // Keep the editable VDOT synchronized when target time/distance changes.
  function updateFinish(next: FinishInput) {
    setFinish(next);
    setVdot(calculate(() => timeResult(next)).data?.score ?? "");
  }
  function selectMode(next: Mode) {
    if (next === "time") setVdot(time?.score ?? "");
    setMode(next);
  }
  function changeUnit(next: Unit) {
    setPace(convertPace(pace, unit, next));
    setUnit(next);
  }
  const paceFields = ["minutes", "seconds"] as const;
  const finishFields = ["hours", "minutes", "seconds"] as const;

  return (
    <main>
      <header>
        <a class="brand" href="#" aria-label="Stride home">
          <span class="mark">↗</span> stride<span class="brand-dot">.</span>
        </a>
        <span class="eyebrow">THE RUNNING PACE CALCULATOR</span>
      </header>
      <section class="intro">
        <span class="kicker">EVERY SECOND COUNTS</span>
        <h1>
          Find your pace.
          <br />
          <span>Run your race.</span>
        </h1>
        <p>
          A little planning. A clear target. Calculate your finish time
          <br class="desktop" /> or find the pace that gets you there.
        </p>
      </section>
      <section class="calculator" aria-label="Running pace calculator">
        <div class="controls">
          <div
            class="tabs"
            role="tablist"
            aria-label="Calculation mode"
            onKeyDown={(event) => {
              if (
                !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
              )
                return;
              event.preventDefault();
              const index =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? 2
                    : (modes.indexOf(mode) +
                        (event.key === "ArrowRight" ? 1 : 2)) %
                      3;
              const next = modes[index];
              selectMode(next);
              event.currentTarget
                .querySelector<HTMLButtonElement>(`#${next}-tab`)
                ?.focus();
            }}
          >
            {modes.map((value) => (
              <button
                key={value}
                id={`${value}-tab`}
                role="tab"
                aria-selected={mode === value}
                aria-controls={`${value}-panel`}
                tabIndex={mode === value ? 0 : -1}
                class={mode === value ? "active" : ""}
                onClick={() => selectMode(value)}
              >
                {tabNames[value]}
              </button>
            ))}
          </div>
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
            <UnitSwitch unit={unit} onChange={changeUnit} label="Pace unit" />
            <TimeInputs
              fields={paceFields.map((key) => ({
                id: `pace-${key === "minutes" ? "min" : "sec"}`,
                label: key,
                value: pace[key],
                max: key === "minutes" ? 999 : 59,
              }))}
              onChange={(index, value) =>
                setPace({ ...pace, [paceFields[index]]: value })
              }
            />
            <p class="example">Your pace. Every distance.</p>
          </div>
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
                updateFinish({ ...finish, distance: event.currentTarget.value })
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
                    updateFinish({
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
                    updateFinish({
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
                updateFinish({ ...finish, [finishFields[index]]: value })
              }
            />
            <UnitSwitch
              unit={unit}
              onChange={changeUnit}
              label="Result pace unit"
            />
          </div>
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
              type="number"
              min="0.1"
              step="0.1"
              inputMode="decimal"
              value={vdot}
              onInput={(event) => setVdot(event.currentTarget.value)}
            />
            <p class="target-note">
              Use your current score or explore a target VDOT.
            </p>
          </div>
          <p id="error" class="error" role="alert" hidden={!error}>
            {error}
          </p>
          <div class="control-foot">
            <span class="live-dot" />
            Results update as you type
          </div>
        </div>
        <div class="results">
          <div id="race-results" hidden={mode !== "pace"}>
            <ResultsHeading
              step="02 / YOUR FINISH TIMES"
              title="Pick your starting line."
              id="pace-badge"
              badge={
                paceCalculation.data
                  ? `${paceText(paceCalculation.data.seconds)} / ${unitLabel(unit)}`
                  : "—"
              }
            />
            <RaceTable
              id="race-list"
              races={races}
              finishTime={
                paceCalculation.data
                  ? (km) => paceCalculation.data!.secKm * km
                  : undefined
              }
            />
          </div>
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
              {time && `${clock(time.seconds)} finish time over ${time.label}.`}
            </div>
            <p class="target-note">
              Find your rhythm and hold it from start to finish.
            </p>
          </div>
          <div id="vdot-results" hidden={mode !== "vdot"}>
            <ResultsHeading
              step="02 / EQUIVALENT RACE TIMES"
              title="Your race equivalents."
              id="vdot-badge"
              badge={
                vdotCalculation.data ? `VDOT ${vdotCalculation.data}` : "—"
              }
            />
            <RaceTable
              id="vdot-race-list"
              races={equivalentRaces}
              showPace
              finishTime={
                vdotCalculation.data
                  ? (km) => equivalentFinishTime(km, vdotCalculation.data!)
                  : undefined
              }
            />
            <p class="target-note">
              Estimated performances at the same VDOT, assuming you are prepared
              for each distance. These use distance-specific race paces.
            </p>
            <TrainingPaces score={vdotCalculation.data} />
          </div>
        </div>
      </section>
      <footer>
        <span>Made for the miles ahead. · 🤖 Built with OpenAI Codex</span>
        <span>Finish times rounded to the nearest second.</span>
      </footer>
    </main>
  );
}
