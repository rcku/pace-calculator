import test from "node:test";
import assert from "node:assert/strict";
import { trainingPaces, type TrainingType } from "../src/calculations.ts";
import { trainingWorkouts, workoutTiming } from "../src/trainingWorkouts.ts";

function timing(type: TrainingType, name: string, score: number) {
    const session = trainingWorkouts[type].sessions.find(
        (item) => item.name === name,
    );
    const pace = trainingPaces(score).find((item) => item.name === type);
    assert.ok(session && pace);
    return workoutTiming(type, session, pace.paces[0]);
}

test("600 m repetitions adapt to current fitness; strides have no prescribed split", () => {
    const ready = timing("Repetition", "600 m repeats · R", 56.5);
    assert.equal(ready?.suitable, true);
    assert.equal(ready.text, "1:57");
    const slower = timing("Repetition", "600 m repeats · R", 50);
    assert.equal(slower?.suitable, false);
    assert.match(slower.text, /2:10.*2-minute R limit/);
    assert.equal(timing("Repetition", "Strides", 56.5), undefined);
});

test("I repeats use duration rather than a fixed distance classification", () => {
    const normal = timing("Interval", "800 m repeats · I", 50);
    assert.equal(normal?.suitable, true);
    assert.equal(normal.text, "3:04");
    assert.equal(timing("Interval", "1 km repeats · I", 25)?.suitable, false);
    assert.equal(timing("Interval", "400 m repeats · I", 100)?.suitable, false);
});

test("repeat-duration limits include their endpoints without using rounded splits", () => {
    const session = trainingWorkouts.Interval.sessions.find(
        (item) => item.distanceKm === 1,
    )!;
    for (const seconds of [60, 300]) {
        assert.equal(
            workoutTiming("Interval", session, seconds)?.suitable,
            true,
        );
    }
    for (const seconds of [59.9, 300.1]) {
        assert.equal(
            workoutTiming("Interval", session, seconds)?.suitable,
            false,
        );
    }
    assert.equal(workoutTiming("Repetition", session, 120)?.suitable, true);
    assert.equal(workoutTiming("Repetition", session, 120.1)?.suitable, false);
});

test("Interval recoveries show explicit times and update with VDOT", () => {
    assert.match(
        timing("Interval", "1 km repeats · I", 56.5)!.recovery!,
        /2:36–3:28 of easy jogging/,
    );
    assert.match(
        timing("Interval", "1 km repeats · I", 50)!.recovery!,
        /2:53–3:50 of easy jogging/,
    );
    const alternative = timing("Interval", "1 km repeats · I", 25)!.alternative;
    assert.equal(alternative?.work, "5–6 × 3 min");
    assert.equal(alternative?.recovery, "2 min easy jogging between repeats");
});
