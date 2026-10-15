import { paceText, type TrainingType } from "./calculations.ts";

export type WorkoutExample = {
    name: string;
    work: string;
    pace: string;
    recovery: string;
    total: string;
    notes?: string;
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
                work: "6–10 km continuous",
                pace: "Easy effort; slower end of the range",
                recovery: "None—continuous run",
                total: "6–10 km easy",
                notes: "May be an easy double if doubles are already part of your routine.",
            },
            {
                name: "Aerobic run",
                work: "10–16 km continuous",
                pace: "Easy, conversational effort",
                recovery: "None—continuous run",
                total: "10–16 km easy",
                notes: "Use between demanding sessions.",
            },
            {
                name: "Medium-long run",
                work: "16–22 km continuous",
                pace: "Easy effort",
                recovery: "None—continuous run",
                total: "16–22 km easy",
                notes: "Midweek endurance run.",
            },
            {
                name: "Easy long run",
                work: "24–32 km continuous",
                pace: "Easy effort",
                recovery: "None—continuous run",
                total: "24–32 km easy, subject to the limits below",
                notes: "Use the weekly-distance and 150-minute limits below; stop earlier if either is reached.",
            },
            {
                name: "Easy run + strides",
                work: "4–6 × 15–20 sec after an easy run",
                pace: "Relaxed, quick accelerations; no target split",
                recovery:
                    "At least 60 sec walking or easy jogging between strides; longer until fully recovered",
                total: "60–120 sec of strides; easy-run distance is additional",
                notes: "Accelerate smoothly and ease down. Avoid all-out sprinting.",
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
                work: "10–16 km continuous",
                pace: "Marathon pace",
                recovery: "None—continuous run",
                total: "10–16 km at Marathon pace",
                notes: "Add 2–3 km easy before and after; build toward the longer option over several weeks.",
            },
            {
                name: "Marathon blocks",
                work: "2 × 5–6 km",
                pace: "Marathon pace",
                recovery: "1 km easy jogging between blocks",
                total: "10–12 km at Marathon pace",
                notes: "Add an easy warm-up and cool-down.",
            },
            {
                name: "Marathon long run",
                work: "24–32 km total, with 8–12 km at Marathon pace toward the end",
                pace: "Easy effort, then Marathon pace, then Easy effort",
                recovery: "None—continuous run",
                total: "24–32 km total, including 8–12 km at Marathon pace",
                notes: "Finish with 1–2 km easy, included in the total. Use about 24 km near 80 km/week and 28–32 km near 100–120 km/week. Keep the whole run within 150 minutes and about 30% of weekly distance.",
            },
        ],
        source: "https://vdoto2.com/learn-more/training-definitions",
    },
    Threshold: {
        cue: "Use Threshold pace for a controlled, comfortably hard effort. 2 km cruise intervals use brief jog recoveries; longer tempo runs should not simply extend the same T pace indefinitely.",
        usage: "A useful midweek endurance session for marathon training. Keep total T running within about 10% of weekly distance (8–12 km); choose the lower repetition count near 80 km/week. The work totals below exclude easy recoveries.",
        sessions: [
            {
                name: "Tempo run",
                work: "20 min continuous",
                pace: "Threshold pace",
                recovery: "None—continuous run",
                total: "20 min at Threshold pace",
                notes: "Surround the work with easy running.",
            },
            {
                name: "2 km cruise intervals",
                work: "3–4 × 2 km",
                pace: "Threshold pace",
                recovery: "90–120 sec easy jogging between repeats",
                total: "6–8 km at Threshold pace",
                distanceKm: 2,
            },
            {
                name: "1 km cruise intervals",
                work: "6–8 × 1 km",
                pace: "Threshold pace",
                recovery: "60 sec easy jogging between repeats",
                total: "6–8 km at Threshold pace",
                notes: "Stay controlled despite the shorter repeats.",
                distanceKm: 1,
            },
            {
                name: "Timed cruise intervals",
                work: "3 × 8–10 min",
                pace: "Threshold pace",
                recovery: "2 min easy jogging between repeats",
                total: "24–30 min at Threshold pace",
                notes: "Reduce repetitions if this exceeds the weekly-distance limit.",
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
                work: "5–6 × 3 min",
                pace: "Interval pace",
                recovery: "2 min easy jogging between repeats",
                total: "15–18 min at Interval pace",
            },
            {
                name: "400 m repeats · I",
                work: "12–16 × 400 m",
                pace: "Interval pace",
                recovery:
                    "75–100% of the repeat time, easy jogging between repeats",
                total: "4.8–6.4 km at Interval pace",
                distanceKm: 0.4,
            },
            {
                name: "600 m repeats · I",
                work: "8–10 × 600 m",
                pace: "Interval pace",
                recovery:
                    "75–100% of the repeat time, easy jogging between repeats",
                total: "4.8–6 km at Interval pace",
                distanceKm: 0.6,
            },
            {
                name: "800 m repeats · I",
                work: "6–8 × 800 m",
                pace: "Interval pace",
                recovery:
                    "75–100% of the repeat time, easy jogging between repeats",
                total: "4.8–6.4 km at Interval pace",
                distanceKm: 0.8,
            },
            {
                name: "1 km repeats · I",
                work: "5–6 × 1 km",
                pace: "Interval pace",
                recovery:
                    "75–100% of the repeat time, easy jogging between repeats",
                total: "5–6 km at Interval pace",
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
                name: "200 m repeats · R",
                work: "10–16 × 200 m",
                pace: "Repetition pace",
                recovery:
                    "At least 200 m easy jogging between repeats; longer until fully recovered",
                total: "2–3.2 km at Repetition pace",
                distanceKm: 0.2,
            },
            {
                name: "300 m repeats · R",
                work: "8–10 × 300 m",
                pace: "Repetition pace",
                recovery:
                    "At least 300 m easy jogging between repeats; longer until fully recovered",
                total: "2.4–3 km at Repetition pace",
                distanceKm: 0.3,
            },
            {
                name: "400 m repeats · R",
                work: "6–10 × 400 m",
                pace: "Repetition pace",
                recovery:
                    "At least 400 m easy jogging between repeats; longer until fully recovered",
                total: "2.4–4 km at Repetition pace",
                distanceKm: 0.4,
            },
            {
                name: "600 m repeats · R",
                work: "4–6 × 600 m",
                pace: "Repetition pace",
                recovery:
                    "At least 600 m easy jogging between repeats; longer until fully recovered",
                total: "2.4–3.6 km at Repetition pace",
                notes: "Use only when each repeat takes no more than 2 minutes.",
                distanceKm: 0.6,
            },
            {
                name: "Strides",
                work: "6–8 × 15–20 sec after easy running or in a warm-up",
                pace: "Relaxed, quick accelerations; no target split",
                recovery:
                    "At least 60 sec walking or easy jogging between strides; longer until fully recovered",
                total: "90–160 sec of strides",
                notes: "Accelerate smoothly, stay relaxed, then ease down. Avoid all-out sprinting or chasing a precise R split.",
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
            text: `At this VDOT, one repeat takes ${time}, beyond the 2-minute R limit. Use the shorter alternative below.`,
            alternative: {
                work: "6 × 20–30 sec",
                pace: "Relaxed Repetition effort",
                recovery: "Easy jogging until fully recovered between repeats",
                total: "2–3 min at Repetition effort",
            },
        };
    }
    if (type === "Interval" && (seconds < 60 || seconds > 300)) {
        return {
            suitable: false,
            text: `At this VDOT, one repeat takes ${time}, outside the 1–5-minute I range. Use the timed alternative below.`,
            alternative: {
                work: "5–6 × 3 min",
                pace: "Interval pace",
                recovery: "2 min easy jogging between repeats",
                total: "15–18 min at Interval pace",
            },
        };
    }
    if (type === "Interval") {
        return {
            suitable: true,
            text: time,
            recovery: `${paceText(seconds * 0.75)}–${time} of easy jogging between repeats`,
        };
    }
    return { suitable: true, text: time };
}
