import { targetVdot } from "./calculations.ts";
import { MILE_KM, milesText, raceDistances, type Unit } from "./distances.ts";

export type Mode = "pace" | "time" | "vdot";
export type PaceInput = { minutes: string; seconds: string };
export type FinishInput = PaceInput & {
    hours: string;
    distance: string;
    customDistance: string;
    customUnit: Unit;
};
export const initialPace: PaceInput = { minutes: "5", seconds: "30" };
export const initialFinish: FinishInput = {
    hours: "0",
    minutes: "55",
    seconds: "0",
    distance: "10",
    customDistance: "12",
    customUnit: "km",
};

export function calculate<T>(read: () => T): { data?: T; error: string } {
    try {
        return { data: read(), error: "" };
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Invalid input.",
        };
    }
}
function whole(raw: string, maximum: number): number {
    const value = Number(raw);
    if (
        !raw.trim() ||
        !Number.isInteger(value) ||
        value < 0 ||
        value > maximum
    ) {
        throw new Error(
            "Enter whole, non-negative time values. Minutes and seconds must be between 0 and 59.",
        );
    }
    return value;
}
export function paceResult(input: PaceInput, unit: Unit) {
    const seconds = whole(input.minutes, 999) * 60 + whole(input.seconds, 59);
    if (!seconds) throw new Error("Enter a pace greater than zero.");
    return { seconds, secKm: seconds / (unit === "mi" ? MILE_KM : 1) };
}
export function timeResult(input: FinishInput) {
    const custom = input.distance === "custom";
    const km = custom
        ? Number(input.customDistance) *
          (input.customUnit === "mi" ? MILE_KM : 1)
        : Number(input.distance);
    if (!Number.isFinite(km) || km <= 0)
        throw new Error("Enter a custom distance greater than zero.");
    const seconds =
        whole(input.hours, 999) * 3600 +
        whole(input.minutes, 59) * 60 +
        whole(input.seconds, 59);
    if (!seconds) throw new Error("Enter a finish time greater than zero.");
    const score = targetVdot(km, seconds);
    const label = custom
        ? `${input.customDistance} ${input.customUnit === "mi" ? "miles" : "km"} (${input.customUnit === "mi" ? km.toFixed(2) + " km" : milesText(km)})`
        : `${raceDistances.find(([, d]) => d === km)?.[0]} (${milesText(km)})`;
    return {
        seconds,
        secKm: seconds / km,
        score: Number.isFinite(score) && score > 0 ? score.toFixed(1) : "",
        label,
    };
}
export function vdotScore(raw: string): number {
    const score = Number(raw);
    if (!raw.trim() || !Number.isFinite(score) || score <= 0)
        throw new Error("Enter a VDOT score greater than zero.");
    return score;
}
export function convertPace(input: PaceInput, from: Unit, to: Unit): PaceInput {
    if (from === to) return input;
    const current = calculate(() => paceResult(input, from));
    if (!current.data) return input;
    const seconds = Math.round(
        current.data.secKm * (to === "mi" ? MILE_KM : 1),
    );
    return {
        minutes: String(Math.floor(seconds / 60)),
        seconds: String(seconds % 60),
    };
}
