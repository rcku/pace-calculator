import { GitHubLink } from "./components/GitHubLink.tsx";
import { useTheme } from "./theme.ts";
import { Header } from "./components/Header.tsx";
import { PaceConversionPage } from "./PaceConversionPage.tsx";
import { useEffect, useState } from "preact/hooks";
import type { Unit } from "./distances.ts";
import {
    calculate,
    paceResult,
    timeResult,
    vdotScore,
    convertPace,
    initialPace,
    initialFinish,
    type Mode,
    type FinishInput,
} from "./model.ts";
import { ModeTabs } from "./components/calculator/ModeTabs.tsx";
import { PacePanel, PaceResults } from "./components/calculator/PacePanel.tsx";
import { TimePanel, TimeResults } from "./components/calculator/TimePanel.tsx";
import { VdotPanel, VdotResults } from "./components/calculator/VdotPanel.tsx";

export function App() {
    const { theme, toggleTheme } = useTheme();
    const [showConversions, setShowConversions] = useState(
        () => window.location.hash === "#pace-conversion",
    );
    useEffect(() => {
        const updateView = () =>
            setShowConversions(window.location.hash === "#pace-conversion");
        window.addEventListener("hashchange", updateView);
        return () => window.removeEventListener("hashchange", updateView);
    }, []);
    const [mode, setMode] = useState<Mode>("pace");
    const [unit, setUnit] = useState<Unit>("km");
    const [pace, setPace] = useState(initialPace);
    const [finish, setFinish] = useState(initialFinish);
    const [vdot, setVdot] = useState(() => timeResult(initialFinish).score);
    const paceCalculation = calculate(() => paceResult(pace, unit));
    const timeCalculation = calculate(() => timeResult(finish));
    const vdotCalculation = calculate(() => vdotScore(vdot));
    const time = timeCalculation.data;
    const error = {
        pace: paceCalculation.error,
        time: timeCalculation.error,
        vdot: vdotCalculation.error,
    }[mode];

    // Keep the editable VDOT synchronized when target time/distance changes.
    function updateFinish(next: FinishInput) {
        setFinish(next);
        setVdot(calculate(() => timeResult(next)).data?.score ?? "");
    }
    function selectMode(next: Mode) {
        if (next === "time") setVdot(time?.score ?? "");
        setMode(next);
    }
    function changeUnit(next: Unit) {
        setPace(convertPace(pace, unit, next));
        setUnit(next);
    }

    if (showConversions)
        return (
            <PaceConversionPage
                theme={theme}
                onToggleTheme={toggleTheme}
                pace={pace}
                unit={unit}
                onPaceChange={setPace}
                onUnitChange={changeUnit}
            />
        );

    return (
        <main>
            <Header theme={theme} onToggleTheme={toggleTheme} />
            <section class="intro">
                <span class="kicker">EVERY SECOND COUNTS</span>
                <h1>
                    Find your pace.
                    <br />
                    <span>Run your race.</span>
                </h1>
                <p>
                    A little planning. A clear target. Calculate your finish
                    time
                    <br class="desktop" /> or find the pace that gets you there.
                </p>
            </section>
            <section class="calculator" aria-label="Running pace calculator">
                <div class="controls">
                    <ModeTabs mode={mode} onModeChange={selectMode} />
                    <PacePanel
                        mode={mode}
                        pace={pace}
                        unit={unit}
                        onPaceChange={setPace}
                        onUnitChange={changeUnit}
                    />
                    <TimePanel
                        mode={mode}
                        finish={finish}
                        unit={unit}
                        onFinishChange={updateFinish}
                        onUnitChange={changeUnit}
                    />
                    <VdotPanel mode={mode} vdot={vdot} onVdotChange={setVdot} />
                    <p id="error" class="error" role="alert" hidden={!error}>
                        {error}
                    </p>
                    <div class="control-foot">
                        <span class="live-dot" />
                        Results update as you type
                    </div>
                </div>
                <div class="results">
                    <PaceResults
                        mode={mode}
                        unit={unit}
                        result={paceCalculation.data}
                    />
                    <TimeResults mode={mode} unit={unit} time={time} />
                    <VdotResults mode={mode} score={vdotCalculation.data} />
                </div>
            </section>
            <footer>
                <div class="footer-credit">
                    <span>Made for the miles ahead.</span>
                    <GitHubLink />
                </div>
                <span>Finish times rounded to the nearest second.</span>
            </footer>
        </main>
    );
}
