type IconName = "arrow-up-right" | "arrow-left" | "sun" | "moon";

const paths: Record<IconName, string> = {
    "arrow-up-right": "M7 17 17 7M7 7h10v10",
    "arrow-left": "M19 12H5m7-7-7 7 7 7",
    sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5",
    moon: "M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z",
};

export function Icon({ name }: { name: IconName }) {
    return (
        <svg
            class="icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            {name === "sun" && <circle cx="12" cy="12" r="4" />}
            <path d={paths[name]} />
        </svg>
    );
}
