import { paceText, type TrainingType } from "./calculations.ts";

export type WorkoutExample = {
    name: string;
    detail: string;
    distanceKm?: number;
};
type WorkoutGuide = {
    cue: string;
    usage: string;
    sessions: readonly WorkoutExample[];
    source: string;
};

export const trainingWorkouts: Record<TrainingType, WorkoutGuide> = {
    "Easy run": {
        cue: "Keep the effort conversational. Use the slower end of Easy pace on recovery days; let effort guide you on hills or tired legs.",
        usage: "Easy running supplies most of the week. For long runs, use about 24 km near 80 km/week and 28–32 km near 100–120 km/week. Keep them within about 30% of weekly distance and 150 minutes; finish earlier if either limit is reached.",
        sessions: [
            {
                name: "Recovery run",
                detail: "6–10 km of relaxed running, including easy doubles when these are already part of your routine.",
            },
            {
                name: "Aerobic run",
                detail: "10–16 km at Easy effort between demanding sessions.",
            },
            {
                name: "Medium-long run",
                detail: "16–22 km at Easy effort to build endurance midweek.",
            },
            {
                name: "Easy long run",
                detail: "24–32 km at Easy effort, subject to the weekly-distance and time limits below.",
            },
            {
                name: "Easy run + strides",
                detail: "After an easy run, add 4–6 × 15–20-second relaxed strides. Recover for at least 60 seconds, and longer until fully ready. These are brief accelerations, not Easy-pace efforts or all-out sprints.",
            },
        ],
        source: "https://vdoto2.com/learn-more/training-definitions",
    },
    Marathon: {
        cue: "Use the Marathon pace above for the work portions, based on current race fitness. Run the warm-up, recoveries, and cool-down at Easy effort.",
        usage: "Make these key marathon-specific sessions, with recovery days around them. Keep the Marathon-pace portion within about 20% of weekly distance (16–24 km at 80–120 km/week). A long run containing Marathon work counts as a demanding session.",
        sessions: [
            {
                name: "Steady marathon effort",
                detail: "10–16 km continuously at Marathon pace, plus 2–3 km easy before and after. Build toward the longer option over several weeks.",
            },
            {
                name: "Marathon blocks",
                detail: "2 × 5–6 km at Marathon pace, with 1 km easy between blocks, plus an easy warm-up and cool-down. Total Marathon work: 10–12 km.",
            },
            {
                name: "Marathon long run",
                detail: "24–32 km total, including 8–12 km at Marathon pace toward the end, followed by 1–2 km easy. Use about 24 km near 80 km/week; reserve 28–32 km for established 100–120 km weeks. Keep the whole run within 150 minutes and about 30% of weekly distance.",
            },
        ],
        source: "https://vdoto2.com/learn-more/training-definitions",
    },
    Threshold: {
        cue: "Use Threshold pace for a controlled, comfortably hard effort. Cruise intervals use brief jog recoveries; longer tempo runs should not simply extend the same T pace indefinitely.",
        usage: "A useful midweek endurance session for marathon training. Keep total T running within about 10% of weekly distance (8–12 km); choose the lower repetition count near 80 km/week. The work totals below exclude easy recoveries.",
        sessions: [
            {
                name: "Tempo run",
                detail: "20 minutes continuously at Threshold pace, surrounded by easy running.",
            },
            {
                name: "Cruise intervals",
                detail: "3–4 × 2 km at Threshold pace, with 90–120 seconds of easy jogging between efforts. Total T work: 6–8 km.",
                distanceKm: 2,
            },
            {
                name: "Short cruise intervals · 1 km",
                detail: "6–8 × 1 km at Threshold pace, with 60 seconds of easy jogging between efforts. Total T work: 6–8 km. Keep the pace controlled despite the shorter repeats.",
                distanceKm: 1,
            },
            {
                name: "Timed cruise intervals",
                detail: "3 × 8–10 minutes at Threshold pace, with 2 minutes of easy jogging between efforts. Total T work: 24–30 minutes; reduce repetitions if this exceeds the weekly-distance limit.",
            },
        ],
        source: "https://news.vdoto2.com/2017/12/whats-threshold-pace/",
    },
    Interval: {
        cue: "Use Interval pace for aerobic power. For distance repeats, jog for roughly 75–100% of the preceding work time. Favor 3–5-minute efforts; 400 m and 600 m are shorter alternatives, not a reason to run faster.",
        usage: "Use periodically instead of another hard workout, rather than adding an extra hard day. Cap I work at about 8% of weekly distance (6.4–9.6 km). Choose one option; warm-up, recoveries, and cool-down are extra easy running.",
        sessions: [
            {
                name: "Three-minute intervals",
                detail: "5–6 × 3 minutes at Interval pace, with 2 minutes of easy jogging between efforts. Total I work: 15–18 minutes.",
            },
            {
                name: "Track 400s · I",
                detail: "12–16 × 400 m at Interval pace. Total I work: 4.8–6.4 km; keep the jog recoveries controlled.",
                distanceKm: 0.4,
            },
            {
                name: "Track 600s · I",
                detail: "8–10 × 600 m at Interval pace. Total I work: 4.8–6 km.",
                distanceKm: 0.6,
            },
            {
                name: "Track 800s · I",
                detail: "6–8 × 800 m at Interval pace. Total I work: 4.8–6.4 km.",
                distanceKm: 0.8,
            },
            {
                name: "Kilometer intervals · I",
                detail: "5–6 × 1 km at Interval pace. Total I work: 5–6 km.",
                distanceKm: 1,
            },
        ],
        source: "https://news.vdoto2.com/2025/07/how-to-effectively-improve-your-vo2max/",
    },
    Repetition: {
        cue: "Distance repeats use Repetition pace to develop economy, with full recovery. Strides use relaxed, quick effort rather than exact splits. Keep R repeats within 2 minutes.",
        usage: "Keep these as a light economy session or occasional replacement for harder work. Total R distance should stay within about 5% of weekly mileage (4–6 km). Jog at least the repeat distance between track reps, taking longer whenever needed to regain relaxed form.",
        sessions: [
            {
                name: "Track 200s · R",
                detail: "10–16 × 200 m at Repetition pace, with at least 200 m of easy jogging between efforts. Total R work: 2–3.2 km.",
                distanceKm: 0.2,
            },
            {
                name: "Track 300s · R",
                detail: "8–10 × 300 m at Repetition pace, with at least 300 m of easy jogging between efforts. Total R work: 2.4–3 km.",
                distanceKm: 0.3,
            },
            {
                name: "Track 400s · R",
                detail: "6–10 × 400 m at Repetition pace, with at least 400 m of easy jogging between efforts. Total R work: 2.4–4 km.",
                distanceKm: 0.4,
            },
            {
                name: "Track 600s · R",
                detail: "4–6 × 600 m at Repetition pace, with at least 600 m of easy jogging between efforts. Use only when each repeat takes no more than 2 minutes. Total R work: 2.4–3.6 km.",
                distanceKm: 0.6,
            },
            {
                name: "Strides",
                detail: "6–8 × 15–20 seconds after easy running or in a warm-up. Accelerate smoothly, stay relaxed, then ease down. Walk or jog for at least 60 seconds and until fully recovered. Avoid all-out sprinting or chasing a precise R split.",
            },
        ],
        source: "https://vdoto2.com/learn-more/training-definitions",
    },
};

// Apply duration guidance to the current pace, rather than classifying by distance alone.
export function workoutTiming(
    type: TrainingType,
    session: WorkoutExample,
    secKm: number,
) {
    if (!session.distanceKm) return undefined;
    const seconds = session.distanceKm * secKm;
    const time = paceText(seconds);
    if (type === "Repetition" && seconds > 120) {
        return {
            suitable: false,
            text: `At this VDOT, one repeat takes ${time}, beyond the 2-minute R limit. Choose a shorter distance or 20–30-second relaxed repeats with full recovery instead.`,
        };
    }
    if (type === "Interval" && (seconds < 60 || seconds > 300)) {
        return {
            suitable: false,
            text: `At this VDOT, one repeat takes ${time}, outside the 1–5-minute I range. Use timed 3-minute intervals with 2 minutes of easy jogging between efforts instead.`,
        };
    }
    if (type === "Interval") {
        return {
            suitable: true,
            text: `${time} per repeat at the pace above. Recovery: ${paceText(seconds * 0.75)}–${time} of easy jogging between repeats.`,
        };
    }
    return { suitable: true, text: `${time} per repeat at the pace above.` };
}
