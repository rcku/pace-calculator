import type { TrainingType } from "./calculations.ts";

type WorkoutGuide = {
    cue: string;
    sessions: readonly { name: string; detail: string }[];
    source: string;
};

export const trainingWorkouts = {
    "Easy run": {
        cue: "Use the Easy pace range above. Keep the effort conversational.",
        sessions: [
            {
                name: "Recovery run",
                detail: "20–30 minutes of gentle, continuous running.",
            },
            {
                name: "Aerobic run",
                detail: "40–60 minutes at a comfortable, steady effort.",
            },
            {
                name: "Easy long run",
                detail: "60–90 minutes at Easy effort; choose a duration that fits your usual mileage.",
            },
        ],
        source: "https://vdoto2.com/learn-more/training-definitions",
    },
    Marathon: {
        cue: "Use the Marathon pace above for the work portions, with Easy running around them.",
        sessions: [
            {
                name: "Steady marathon effort",
                detail: "20–30 minutes continuously at Marathon pace.",
            },
            {
                name: "Marathon blocks",
                detail: "2 × 15 minutes at Marathon pace, with 5 minutes of easy jogging between blocks.",
            },
        ],
        source: "https://vdoto2.com/learn-more/training-definitions",
    },
    Threshold: {
        cue: "Use the Threshold pace above. Aim for a controlled, comfortably hard effort.",
        sessions: [
            {
                name: "Tempo run",
                detail: "20 minutes continuously at Threshold pace.",
            },
            {
                name: "Cruise intervals",
                detail: "3 × 5 minutes at Threshold pace, with 1 minute of easy jogging between efforts.",
            },
        ],
        source: "https://vdoto2.com/learn-more/training-definitions",
    },
    Interval: {
        cue: "Use the Interval pace above. Keep the work bouts even rather than accelerating each one.",
        sessions: [
            {
                name: "Three-minute intervals",
                detail: "5 × 3 minutes at Interval pace, with 2 minutes of easy jogging between efforts.",
            },
            {
                name: "Four-minute intervals",
                detail: "4 × 4 minutes at Interval pace, with 3 minutes of easy jogging between efforts.",
            },
        ],
        source: "https://news.vdoto2.com/2025/07/how-to-effectively-improve-your-vo2max/",
    },
    Repetition: {
        cue: "Use the Repetition pace above. Stay relaxed and recover fully; keep each effort under 2 minutes.",
        sessions: [
            {
                name: "Short timed repeats",
                detail: "6 × 30 seconds at Repetition pace. Jog until fully recovered between efforts.",
            },
            {
                name: "Track 200s",
                detail: "8 × 200 m at Repetition pace, with at least 200 m of easy jogging between repeats. Take longer recovery when needed.",
            },
        ],
        source: "https://news.vdoto2.com/2022/07/getting-the-most-out-of-your-repetition-training/",
    },
} satisfies Record<TrainingType, WorkoutGuide>;
