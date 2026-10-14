import { clock, paceText, trainingPaces } from "../calculations.ts";
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
                    {km >= 21 && (km === 21.0975 || km === 42.195)
                      ? `${km} km · `
                      : ""}
                    {milesText(km)}
                  </small>
                </span>
                <span class={showPace ? "race-performance" : ""}>
                  <strong class="race-time">{clock(seconds)}</strong>
                  {showPace && (
                    <small>
                      {paceText(seconds / km)} / km ·{" "}
                      {paceText((seconds / km) * MILE_KM)} / mile
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
export function TrainingPaces({ score }: { score?: number }) {
  return (
    <section class="training-section" aria-labelledby="training-title">
      <span class="step">03 / TRAINING PACES</span>
      <h2 id="training-title">Find your training rhythm.</h2>
      <p class="hint">Estimated paces for the VDOT entered above.</p>
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
                <tr key={row.name}>
                  <th scope="row">
                    {row.name}
                    <small>{row.description}</small>
                  </th>
                  <td>{row.paces.map(paceText).join("–")}</td>
                  <td>
                    {row.paces
                      .map((value) => paceText(value * MILE_KM))
                      .join("–")}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <p class="target-note">
        Use a recent race result to set training paces for your current fitness.
      </p>
      <details class="training-method">
        <summary>About these estimates</summary>
        <p>
          Formula-based Daniels-style estimates: Easy uses 59–74% of VDOT as
          oxygen cost, Threshold 88%, and Interval 100%. Marathon uses
          equivalent marathon pace; Repetition uses equivalent mile pace. These
          are approximations and may differ from official V.O2 training tables.
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
