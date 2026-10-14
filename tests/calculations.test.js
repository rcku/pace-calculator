import test from "node:test";
import assert from "node:assert/strict";
import {
  targetVdot,
  equivalentFinishTime,
  trainingPaces,
  clock,
  paceText,
} from "../src/calculations.js";
import { MILE_KM } from "../src/distances.js";

test("known race performances match reference VDOT scores", () => {
  for (const [distance, seconds, score] of [
    [10, 3300, 35.8],
    [5, 1500, 38.3],
    [42.195, 14400, 37.9],
  ]) {
    assert.equal(targetVdot(distance, seconds).toFixed(1), score.toFixed(1));
  }
});
test("race-equivalence inversion preserves fitness across all four distances", () => {
  for (const score of [20, 35.8, 50, 80])
    for (const distance of [5, 10, 21.0975, 42.195]) {
      assert.ok(
        Math.abs(
          targetVdot(distance, equivalentFinishTime(distance, score)) - score,
        ) < 1e-8,
      );
    }
  assert.ok(
    Math.abs(equivalentFinishTime(5, targetVdot(5, 1500)) - 1500) < 1e-8,
  );
});
test("mile conversion and rounding carry correctly", () => {
  assert.equal(paceText(300 * MILE_KM), "8:03");
  assert.equal(clock(3599.6), "1:00:00");
  assert.equal(paceText(299.6), "5:00");
});
test("training intensities progress from easy to repetition", () => {
  for (const score of [30, 40, 60, 80]) {
    const rows = trainingPaces(score);
    assert.equal(rows.length, 5);
    assert.ok(rows[0].paces[0] < rows[0].paces[1]);
    for (let i = 0; i < 4; i++)
      assert.ok(rows[i].paces[0] > rows[i + 1].paces[0]);
    assert.equal(
      rows[1].paces[0],
      equivalentFinishTime(42.195, score) / 42.195,
    );
  }
});
test("invalid solver inputs fail instead of hanging", () => {
  for (const score of [0, -1, NaN, Infinity])
    assert.throws(() => equivalentFinishTime(5, score), RangeError);
  assert.throws(() => targetVdot(0, 1500), RangeError);
  assert.throws(() => targetVdot(5, 0), RangeError);
});
