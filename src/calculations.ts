import { MILE_KM } from "./distances.ts";

export function clock(total: number) {
    const t = Math.round(total);
    return `${Math.floor(t / 3600)}:${String(Math.floor(t / 60) % 60).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}
export function paceText(total: number) {
    const t = Math.round(total);
    return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}
// Estimate VDOT with the Daniels–Gilbert distance/time equations.
export function targetVdot(distanceKm: number, timeSeconds: number) {
    if (
        !Number.isFinite(distanceKm) ||
        distanceKm <= 0 ||
        !Number.isFinite(timeSeconds) ||
        timeSeconds <= 0
    )
        throw new RangeError(
            "Distance and time must be positive finite numbers.",
        );
    const minutes = timeSeconds / 60;
    const velocity = (distanceKm * 1000) / minutes;
    const oxygenCost =
        -4.6 + 0.182258 * velocity + 0.000104 * velocity * velocity;
    const fraction =
        0.8 +
        0.1894393 * Math.exp(-0.012778 * minutes) +
        0.2989558 * Math.exp(-0.1932605 * minutes);
    return oxygenCost / fraction;
}
// Invert the VDOT equation with bisection to find equivalent race time.
export function equivalentFinishTime(distanceKm: number, score: number) {
    if (!Number.isFinite(score) || score <= 0)
        throw new RangeError("VDOT must be a positive finite number.");
    let low = 0.001,
        high = 3600;
    while (targetVdot(distanceKm, low) < score) low /= 2;
    while (targetVdot(distanceKm, high) > score) high *= 2;
    for (let i = 0; i < 100; i++) {
        const mid = (low + high) / 2;
        if (targetVdot(distanceKm, mid) > score) low = mid;
        else high = mid;
    }
    return (low + high) / 2;
}
export function secondsPerKmAtOxygenCost(cost: number) {
    const velocity =
        (2 * (cost + 4.6)) /
        (0.182258 + Math.sqrt(0.182258 ** 2 + 4 * 0.000104 * (cost + 4.6)));
    return 60000 / velocity;
}
// Convert VDOT to approximate training intensities; Easy returns a range.
export function trainingPaces(score: number) {
    return [
        {
            name: "Easy run",
            description: "Relaxed, conversational",
            paces: [
                secondsPerKmAtOxygenCost(score * 0.74),
                secondsPerKmAtOxygenCost(score * 0.59),
            ],
        },
        {
            name: "Marathon",
            description: "Sustained race effort",
            paces: [equivalentFinishTime(42.195, score) / 42.195],
        },
        {
            name: "Threshold",
            description: "Comfortably hard",
            paces: [secondsPerKmAtOxygenCost(score * 0.88)],
        },
        {
            name: "Interval",
            description: "Hard aerobic repeats",
            paces: [secondsPerKmAtOxygenCost(score)],
        },
        {
            name: "Repetition",
            description: "Short repeats, full recovery",
            paces: [equivalentFinishTime(MILE_KM, score) / MILE_KM],
        },
    ];
}
