import { MILE_KM, races } from "./distances.js";
import {
  clock,
  paceText,
  targetVdot,
  equivalentFinishTime,
  trainingPaces,
} from "./calculations.js";

const $ = (id) => document.getElementById(id);
let mode = "pace",
  unit = "km";
const milesText = (km) => (km / MILE_KM).toFixed(2) + " mi";
for (const option of $("distance").options) {
  if (option.value !== "custom")
    option.textContent += ` (${milesText(Number(option.value))})`;
}
function renderVdot() {
  const raw = $("vdot-input").value;
  const score = Number(raw);
  if (raw.trim() === "" || !Number.isFinite(score) || score <= 0)
    throw new Error("Enter a VDOT score greater than zero.");
  $("vdot-badge").textContent = `VDOT ${score}`;
  $("vdot-race-list").innerHTML = races
    .filter(([, d]) => [5, 10, 21.0975, 42.195].includes(d))
    .map(([name, d]) => {
      const seconds = equivalentFinishTime(d, score),
        secKm = seconds / d;
      return `<div class="race-row ${d >= 21 ? "featured" : ""}"><span class="race-name">${name}<small>${d >= 21 ? `${d} km · ` : ""}${milesText(d)}</small></span><span class="race-performance"><strong class="race-time">${clock(seconds)}</strong><small>${paceText(secKm)} / km · ${paceText(secKm * MILE_KM)} / mile</small></span></div>`;
    })
    .join("");
  $("training-rows").innerHTML = trainingPaces(score)
    .map(
      ({ name, description, paces }) =>
        `<tr><th scope="row">${name}<small>${description}</small></th><td>${paces.map((p) => paceText(p)).join("–")}</td><td>${paces.map((p) => paceText(p * MILE_KM)).join("–")}</td></tr>`,
    )
    .join("");
}
function number(id, max = Infinity) {
  const el = $(id),
    n = Number(el.value);
  if (
    el.value.trim() === "" ||
    !Number.isFinite(n) ||
    n < 0 ||
    n > max ||
    !Number.isInteger(n)
  )
    throw new Error(
      "Enter whole, non-negative time values. Minutes and seconds must be between 0 and 59.",
    );
  return n;
}
function render() {
  let error = "";
  try {
    if (mode === "pace") {
      const secs = number("pace-min", 999) * 60 + number("pace-sec", 59);
      if (!secs) throw new Error("Enter a pace greater than zero.");
      const secKm = secs / (unit === "mi" ? MILE_KM : 1);
      $("pace-badge").textContent =
        `${paceText(secs)} / ${unit === "mi" ? "mile" : "km"}`;
      $("race-list").innerHTML = races
        .map(
          ([name, d]) =>
            `<div class="race-row ${d === 21.0975 || d === 42.195 ? "featured" : ""}"><span class="race-name">${name}<small>${d === 21.0975 || d === 42.195 ? `${d} km · ` : ""}${milesText(d)}</small></span><span class="race-time">${clock(secKm * d)}</span></div>`,
        )
        .join("");
    } else if (mode === "vdot") {
      renderVdot();
    } else {
      const custom = $("distance").value === "custom";
      $("custom-fields").hidden = !custom;
      let d = custom
        ? Number($("custom-distance").value)
        : Number($("distance").value);
      if (custom && $("distance-unit").value === "mi") d *= MILE_KM;
      if (!Number.isFinite(d) || d <= 0)
        throw new Error("Enter a custom distance greater than zero.");
      const secs =
        number("hours", 999) * 3600 +
        number("minutes", 59) * 60 +
        number("seconds", 59);
      if (!secs) throw new Error("Enter a finish time greater than zero.");
      const score = targetVdot(d, secs);
      $("target-vdot").textContent =
        Number.isFinite(score) && score > 0 ? score.toFixed(1) : "—";
      $("vdot-input").value =
        Number.isFinite(score) && score > 0 ? score.toFixed(1) : "";
      $("vdot-note").textContent =
        Number.isFinite(score) && score > 0
          ? "Goal fitness estimated from this race time, not a laboratory VO₂max measurement. Use a recent race result to estimate current fitness."
          : "VDOT cannot be meaningfully estimated for this distance and time.";
      const secKm = secs / d;
      const primary = secKm * (unit === "mi" ? MILE_KM : 1),
        other = secKm * (unit === "km" ? MILE_KM : 1);
      $("target-pace").innerHTML =
        `${paceText(primary)}<span>min / ${unit === "mi" ? "mile" : "km"}</span>`;
      $("equivalent").textContent =
        `Equivalent to ${paceText(other)} min / ${unit === "km" ? "mile" : "km"}`;
      $("target-detail").textContent =
        `${clock(secs)} finish time over ${custom ? `${$("custom-distance").value} ${$("distance-unit").value === "mi" ? "miles" : "km"} (${$("distance-unit").value === "mi" ? d.toFixed(2) + " km" : milesText(d)})` : $("distance").selectedOptions[0].textContent}.`;
    }
  } catch (e) {
    error = e.message;
    if (mode === "pace") {
      $("race-list").innerHTML = "";
      $("pace-badge").textContent = "—";
    } else if (mode === "vdot") {
      $("vdot-badge").textContent = "—";
      $("vdot-race-list").innerHTML = "";
      $("training-rows").innerHTML = "";
    } else {
      $("target-pace").innerHTML =
        "—<span>Enter valid values to calculate</span>";
      $("equivalent").textContent = "";
      $("target-detail").textContent = "";
      $("target-vdot").textContent = "—";
      $("vdot-input").value = "";
      $("vdot-note").textContent =
        "Enter a valid distance and finish time to estimate target VDOT.";
    }
  }
  $("error").hidden = !error;
  $("error").textContent = error;
}
// Show the selected calculator tab and refresh its results.
function setMode(next) {
  mode = next;
  ["pace", "time", "vdot"].forEach((m) => {
    const active = m === mode;
    $(m + "-tab").classList.toggle("active", active);
    $(m + "-tab").setAttribute("aria-selected", active);
    $(m + "-tab").tabIndex = active ? 0 : -1;
    $(m + "-panel").hidden = !active;
  });
  $("race-results").hidden = mode !== "pace";
  $("target-results").hidden = mode !== "time";
  $("vdot-results").hidden = mode !== "vdot";
  render();
}
$("pace-tab").onclick = () => setMode("pace");
$("time-tab").onclick = () => setMode("time");
$("vdot-tab").onclick = () => setMode("vdot");
document.querySelector(".tabs").addEventListener("keydown", (e) => {
  if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
    e.preventDefault();
    const modes = ["pace", "time", "vdot"];
    const next =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? 2
          : (modes.indexOf(mode) + (e.key === "ArrowRight" ? 1 : 2)) % 3;
    setMode(modes[next]);
    $(mode + "-tab").focus();
  }
});
document.querySelectorAll("[data-unit]").forEach(
  (b) =>
    (b.onclick = () => {
      const next = b.dataset.unit;
      if (next !== unit) {
        const min = Number($("pace-min").value),
          sec = Number($("pace-sec").value);
        if (
          Number.isFinite(min) &&
          Number.isFinite(sec) &&
          min >= 0 &&
          sec >= 0 &&
          sec < 60
        ) {
          const converted = Math.round(
            (min * 60 + sec) * (next === "mi" ? MILE_KM : 1 / MILE_KM),
          );
          $("pace-min").value = Math.floor(converted / 60);
          $("pace-sec").value = converted % 60;
        }
      }
      unit = next;
      document.querySelectorAll("[data-unit]").forEach((x) => {
        x.classList.toggle("active", x.dataset.unit === unit);
        x.setAttribute("aria-pressed", x.dataset.unit === unit);
      });
      render();
    }),
);
document
  .querySelectorAll("input,select")
  .forEach((el) => el.addEventListener("input", render));
render();
