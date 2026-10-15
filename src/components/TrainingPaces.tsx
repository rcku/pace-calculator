import { useState } from "preact/hooks";
import { trainingPaces, paceText, type TrainingPace } from "../calculations.ts";
import { MILE_KM } from "../distances.ts";
import { trainingWorkouts } from "../trainingWorkouts.ts";

function PaceRange({
    values,
    multiplier = 1,
}: {
    values: number[];
    multiplier?: number;
}) {
    return (
        <>
            {values.map((value, index) => (
                <span key={index}>
                    {index > 0 && <span class="range-separator">–</span>}
                    <span class="pace-value">
                        {paceText(value * multiplier)}
                    </span>
                </span>
            ))}
        </>
    );
}

function TrainingRow({ row }: { row: TrainingPace }) {
    const [expanded, setExpanded] = useState(false);
    const id = `training-${row.name.toLowerCase().replace(/ /g, "-")}`;
    const guide = trainingWorkouts[row.name];
    return (
        <>
            <tr class="training-pace-row">
                <th scope="row">
                    <button
                        id={`${id}-toggle`}
                        class="training-toggle"
                        type="button"
                        aria-expanded={expanded}
                        aria-controls={`${id}-workouts`}
                        onClick={() => setExpanded(!expanded)}
                    >
                        <span class="training-toggle-label">
                            <span>{row.name}</span>
                            <small>{row.description}</small>
                        </span>
                        <span class="training-chevron" aria-hidden="true">
                            {expanded ? "−" : "+"}
                        </span>
                    </button>
                </th>
                <td>
                    <PaceRange values={row.paces} />
                </td>
                <td>
                    <PaceRange values={row.paces} multiplier={MILE_KM} />
                </td>
            </tr>
            <tr hidden={!expanded}>
                <td colSpan={3} class="training-workouts">
                    <div
                        id={`${id}-workouts`}
                        role="region"
                        aria-labelledby={`${id}-toggle`}
                    >
                        <h3>Common workouts</h3>
                        <p>{guide.cue}</p>
                        <ul>
                            {guide.sessions.map((session) => (
                                <li key={session.name}>
                                    <strong>{session.name}</strong>
                                    <span>{session.detail}</span>
                                </li>
                            ))}
                        </ul>
                        <a
                            href={guide.source}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Training guidance · V.O2 ↗
                        </a>
                    </div>
                </td>
            </tr>
        </>
    );
}

export function TrainingPaces({ score }: { score?: number }) {
    return (
        <section class="training-section" aria-labelledby="training-title">
            <span class="step">03 / TRAINING PACES</span>
            <h2 id="training-title">Find your training rhythm.</h2>
            <p class="hint">
                Estimated paces for the VDOT entered above. Tap a run type for
                common workouts.
            </p>
            <div class="training-table-wrap">
                <table class="training-table">
                    <thead>
                        <tr>
                            <th scope="col">RUN TYPE</th>
                            <th scope="col">MIN / KM</th>
                            <th scope="col">MIN / MILE</th>
                        </tr>
                    </thead>
                    <tbody id="training-rows" aria-live="polite">
                        {score &&
                            trainingPaces(score).map((row) => (
                                <TrainingRow key={row.name} row={row} />
                            ))}
                    </tbody>
                </table>
            </div>
            <p class="target-note">
                Use a recent race result to set paces for your current fitness.
                Examples are individual sessions. Scale duration and repetitions
                to your current weekly mileage. Add easy running to warm up and
                cool down around faster sessions.
            </p>
            <details class="training-method">
                <summary>About these estimates</summary>
                <p>
                    Formula-based Daniels-style estimates: Easy uses 59–74% of
                    VDOT as oxygen cost, Threshold 88%, and Interval 100%.
                    Marathon uses equivalent marathon pace; Repetition uses
                    equivalent mile pace. These are approximations and may
                    differ from official V.O2 training tables.
                </p>
                <p>
                    <a
                        href="https://vdoto2.com/learn-more/training-definitions"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn about the training intensities
                    </a>
                </p>
            </details>
        </section>
    );
}
