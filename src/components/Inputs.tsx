import { Fragment } from "preact";
import { unitLabel, type Unit } from "../distances.ts";

type Field = { id: string; label: string; value: string; max: number };
export function TimeInputs({
  fields,
  onChange,
  finish = false,
}: {
  fields: Field[];
  onChange: (index: number, value: string) => void;
  finish?: boolean;
}) {
  return (
    <div class={`time-inputs ${finish ? "finish-inputs" : "pace-inputs"}`}>
      {fields.map((field, index) => (
        <Fragment key={field.id}>
          {index > 0 && <span aria-hidden="true">:</span>}
          <label>
            <input
              id={field.id}
              type="number"
              min="0"
              max={field.max}
              inputMode="numeric"
              value={field.value}
              onInput={(event) => onChange(index, event.currentTarget.value)}
            />
            {field.label}
          </label>
        </Fragment>
      ))}
    </div>
  );
}
export function UnitSwitch({
  unit,
  onChange,
  label,
}: {
  unit: Unit;
  onChange: (unit: Unit) => void;
  label: string;
}) {
  return (
    <div class="unit-switch" aria-label={label}>
      {(["km", "mi"] as const).map((value) => (
        <button
          key={value}
          data-unit={value}
          class={unit === value ? "active" : ""}
          aria-pressed={unit === value}
          onClick={() => onChange(value)}
        >
          min / {unitLabel(value)}
        </button>
      ))}
    </div>
  );
}
export function PanelHeading({
  step,
  title,
  hint,
}: {
  step: string;
  title: string;
  hint: string;
}) {
  return (
    <>
      <div class="step">{step}</div>
      <h2>{title}</h2>
      <p class="hint">{hint}</p>
    </>
  );
}
