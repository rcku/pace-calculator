import type { Mode } from "../../model.ts";

const modes: readonly Mode[] = ["pace", "time", "vdot"];
const tabNames = {
    pace: "Pace → time",
    time: "Time → pace",
    vdot: "VDOT → time",
};

export function ModeTabs({
    mode,
    onModeChange,
}: {
    mode: Mode;
    onModeChange: (mode: Mode) => void;
}) {
    return (
        <div
            class="tabs"
            role="tablist"
            aria-label="Calculation mode"
            onKeyDown={(event) => {
                if (
                    !["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                        event.key,
                    )
                )
                    return;
                event.preventDefault();
                const index =
                    event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? 2
                          : (modes.indexOf(mode) +
                                (event.key === "ArrowRight" ? 1 : 2)) %
                            3;
                const next = modes[index];
                onModeChange(next);
                event.currentTarget
                    .querySelector<HTMLButtonElement>(`#${next}-tab`)
                    ?.focus();
            }}
        >
            {modes.map((value) => (
                <button
                    key={value}
                    id={`${value}-tab`}
                    role="tab"
                    aria-selected={mode === value}
                    aria-controls={`${value}-panel`}
                    tabIndex={mode === value ? 0 : -1}
                    class={mode === value ? "active" : ""}
                    onClick={() => onModeChange(value)}
                >
                    {tabNames[value]}
                </button>
            ))}
        </div>
    );
}
