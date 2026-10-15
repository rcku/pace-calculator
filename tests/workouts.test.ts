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
    const ready = timing("Repetition", "Track 600s · R", 56.5);
    assert.equal(ready?.suitable, true);
    assert.match(ready.text, /1:57 per repeat/);
    const slower = timing("Repetition", "Track 600s · R", 50);
    assert.equal(slower?.suitable, false);
    assert.match(slower.text, /2:10.*2-minute R limit/);
    assert.equal(timing("Repetition", "Strides", 56.5), undefined);
});

test("I repeats use duration rather than a fixed distance classification", () => {
    const normal = timing("Interval", "Track 800s · I", 50);
    assert.equal(normal?.suitable, true);
    assert.match(normal.text, /3:04 per repeat/);
    assert.equal(
        timing("Interval", "Kilometer intervals · I", 25)?.suitable,
        false,
    );
    assert.equal(timing("Interval", "Track 400s · I", 100)?.suitable, false);
});

test("repeat-duration limits include their endpoints without using rounded splits", () => {
    const session = { name: "Test repeat", detail: "", distanceKm: 1 };
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
