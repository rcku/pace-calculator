import { paceText } from "../calculations.ts";
import { MILE_KM } from "../distances.ts";

const referencePaces = Array.from(
    { length: 16 },
    (_, index) => 150 + index * 30,
);

export function PaceConversions({ current }: { current?: number }) {
    const paces: number[] = [...referencePaces];
    if (current !== undefined) {
        const nearby = paces.findIndex(
            (pace) => Math.abs(pace - current) < 0.5,
        );
        if (nearby >= 0) paces[nearby] = current;
        else paces.push(current);
        paces.sort((a, b) => a - b);
    }
    return (
        <section class="training-section" aria-labelledby="conversion-title">
            <span class="step">03 / PACE CONVERSION</span>
            <h2 id="conversion-title">Kilometers or miles. Same pace.</h2>
            <p class="hint">
                Compare common paces. Your current pace is highlighted.
            </p>
            <table class="training-table pace-conversion-table">
                <thead>
                    <tr>
                        <th scope="col">MIN / KM</th>
                        <th scope="col">MIN / MILE</th>
                    </tr>
                </thead>
                <tbody id="pace-conversions" aria-live="polite">
                    {paces.map((seconds) => (
                        <tr
                            key={seconds}
                            class={seconds === current ? "current" : ""}
                            aria-current={
                                seconds === current ? "true" : undefined
                            }
                        >
                            <th scope="row">
                                {paceText(seconds)}
                                {seconds === current && (
                                    <small>Your pace</small>
                                )}
                            </th>
                            <td>{paceText(seconds * MILE_KM)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p class="target-note">
                1 mile = 1.609344 km. Paces rounded to the nearest second.
            </p>
        </section>
    );
}
