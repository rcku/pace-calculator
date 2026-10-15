# Calculation model

🤖 Created with OpenAI Codex

Constant-pace finish times use exact kilometer/mile conversions. VDOT uses the Daniels–Gilbert equations, and equivalent race times invert those equations numerically. Training paces are formula-based estimates and may differ from official V.O2 tables. Use a recent race result to estimate current training fitness. The UI includes the estimation method and a [training-intensity reference](https://vdoto2.com/learn-more/training-definitions).

The pace-conversion chart uses 1 mile = 1.609344 km, displays paces every 5 seconds from 2:30 to 6:00 min/km and every 30 seconds from 6:30 to 10:00 min/km, and includes the current pace even when it is outside that range. Both columns round to the nearest second.

Open the chart through the **Pace conversion chart** link in the calculator header, or visit `#pace-conversion` directly. The linked view preserves your pace when you return to the calculator and works in the portable HTML export.

## Marathon workout examples

The examples are intended for runners already established at **80–120 km/week**. They are a menu of individual sessions, not a schedule to perform together. Distances and repetition ranges are this calculator’s coaching synthesis, using the intensity principles in the references below; they are not official V.O2 prescriptions. Prefer the lower end near 80 km/week and build toward the upper end only with established volume and recovery.

| Type       | Reviewed examples                                                                              | Session guidance                                                                                                                                                                                                                                                          |
| ---------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Easy       | 6–10 km recovery, 10–16 km aerobic, 16–22 km medium-long, 24–32 km long runs; optional strides | Most weekly distance is easy. Long runs stop at about 30% of the week or 150 minutes, whichever comes first. Around 80 km/week this limits the long run to about 24 km; 28–32 km belongs toward 100–120 km/week, if it fits the time cap.                                 |
| Marathon   | 10–16 km continuous, 2 × 5–6 km blocks, 24–32 km total with an 8–12 km Marathon segment        | The Marathon segment stays within 20% of weekly distance (16–24 km across this volume range). Long-run examples also observe the long-run caps above.                                                                                                                     |
| Threshold  | 20-minute tempo, 3–4 × 2 km, 6–8 × 1 km, or 3 × 8–10 minutes                                   | Brief jog recoveries; T distance stays within about 10% of weekly volume (8–12 km). Longer cruise intervals are the main endurance options; short 1 km repeats retain T pace and short rests.                                                                             |
| Interval   | 5–6 × 3 minutes, 12–16 × 400 m, 8–10 × 600 m, 6–8 × 800 m, or 5–6 × 1 km                       | A supporting aerobic-power session rather than an additional hard day. I work stays within about 8% of the week (6.4–9.6 km). Distance-repeat recoveries last roughly 75–100% of work time. Prefer 3–5-minute work bouts; shorter I repeats stay at I pace.               |
| Repetition | 200 m, 300 m, 400 m, or 600 m repeats; strides                                                 | Economy work with full recovery. R distance stays within about 5% of the week (4–6 km); the listed examples total 2–4 km. Each R repeat must last no more than 2 minutes. Strides use 15–20 seconds of relaxed acceleration and full recovery, without prescribed splits. |

The percentage limits are ceilings, not targets. Counts must also fit recent training and the rest of the week. Warm-up, cool-down, and recovery jogs are included in total weekly volume, but not the fast-work limits. A Marathon-pace long run is itself a demanding session; I/R sessions replace another workout rather than stacking extra hard days. The UI suggests 2–3 km easy before and after faster sessions and uses current race fitness for VDOT.

`src/trainingWorkouts.ts` holds content and duration checks. `workoutTiming` calculates repeat times from the selected VDOT’s unrounded training pace. If a distance would exceed 2 minutes at R pace, or fall outside 1–5 minutes at I pace, the UI replaces that session’s instructions with a timed or shorter alternative. Strides never receive a numerical target split. These checks do not automatically scale sessions to a particular weekly mileage; the volume ranges and limits are explicit selection guidance.

References reviewed:

- [V.O2 training definitions](https://vdoto2.com/learn-more/training-definitions): Easy/Marathon intensity, volume limits, strides, and training purposes.
- [Threshold training](https://news.vdoto2.com/2017/12/whats-threshold-pace/): 20-minute steady T work and cruise intervals with brief recovery.
- [Interval guidance](https://news.vdoto2.com/2025/07/how-to-effectively-improve-your-vo2max/): 1–5-minute work bouts, preference for 3–5 minutes, active recovery, and volume limits.
- [Repetition recovery](https://news.vdoto2.com/2022/07/getting-the-most-out-of-your-repetition-training/): short repeats, the 2-minute limit, and full recovery.
