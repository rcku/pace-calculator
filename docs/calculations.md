# Calculation model

🤖 Created with OpenAI Codex

Constant-pace finish times use exact kilometer/mile conversions. VDOT uses the Daniels–Gilbert equations, and equivalent race times invert those equations numerically. Training paces are formula-based estimates and may differ from official V.O2 tables. Use a recent race result to estimate current training fitness. The UI includes the estimation method and a [training-intensity reference](https://vdoto2.com/learn-more/training-definitions).

The pace-conversion chart uses 1 mile = 1.609344 km, displays paces every 5 seconds from 2:30 to 6:00 min/km and every 30 seconds from 6:30 to 10:00 min/km, and includes the current pace even when it is outside that range. Both columns round to the nearest second.

Open the chart through the **Pace conversion chart** link in the calculator header, or visit `#pace-conversion` directly. The linked view preserves your pace when you return to the calculator and works in the portable HTML export.

## Workout examples

Each training type expands to show illustrative sessions, work durations, and recovery guidance. These examples are authored for this calculator using the intensity principles in [V.O2 training definitions](https://vdoto2.com/learn-more/training-definitions), [Interval training guidance](https://news.vdoto2.com/2025/07/how-to-effectively-improve-your-vo2max/), and [Repetition recovery guidance](https://news.vdoto2.com/2022/07/getting-the-most-out-of-your-repetition-training/). They are individual session examples rather than a personalized training plan. Select repetitions and durations to fit current training volume. Workout content is maintained in `src/trainingWorkouts.ts`.
