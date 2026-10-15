import { clock, paceText } from "../calculations.ts";
import { MILE_KM, milesText, type Race } from "../distances.ts";

export function ResultsHeading({
    step,
    title,
    badge,
    id,
}: {
    step: string;
    title: string;
    badge: string;
    id: string;
}) {
    return (
        <div class="result-heading">
            <div>
                <span class="step">{step}</span>
                <h2>{title}</h2>
            </div>
            <span id={id} class="badge">
                {badge}
            </span>
        </div>
    );
}
export function RaceTable({
    id,
    races,
    finishTime,
    showPace = false,
}: {
    id: string;
    races: readonly Race[];
    finishTime?: (km: number) => number;
    showPace?: boolean;
}) {
    return (
        <>
            <div class="table-head">
                <span>DISTANCE</span>
                <span>FINISH TIME</span>
            </div>
            <div id={id} aria-live="polite">
                {finishTime &&
                    races.map(([name, km]) => {
                        const seconds = finishTime(km);
                        return (
                            <div
                                key={km}
                                class={`race-row ${km === 21.0975 || km === 42.195 ? "featured" : ""}`}
                            >
                                <span class="race-name">
                                    {name}
                                    <small>
                                        {km >= 21 &&
                                        (km === 21.0975 || km === 42.195)
                                            ? `${km} km · `
                                            : ""}
                                        {milesText(km)}
                                    </small>
                                </span>
                                <span
                                    class={showPace ? "race-performance" : ""}
                                >
                                    <strong class="race-time">
                                        {clock(seconds)}
                                    </strong>
                                    {showPace && (
                                        <small>
                                            <span class="race-pace">
                                                {paceText(seconds / km)} / km
                                            </span>
                                            <span
                                                class="pace-separator"
                                                aria-hidden="true"
                                            >
                                                {" "}
                                                ·{" "}
                                            </span>
                                            <span class="race-pace">
                                                {paceText(
                                                    (seconds / km) * MILE_KM,
                                                )}{" "}
                                                / mile
                                            </span>
                                        </small>
                                    )}
                                </span>
                            </div>
                        );
                    })}
            </div>
        </>
    );
}
