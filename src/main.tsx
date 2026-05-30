import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { CatchResult, fishCatalog, identifyCatch, RadarMode, radarModes, rarityChance, rarityCount } from "./fish";
import "./styles.css";

const scanDurationMs = 2200;

function App() {
  const [mode, setMode] = useState<"idle" | "scanning" | "result">("idle");
  const [radarMode, setRadarMode] = useState<RadarMode>("normal");
  const [catchResult, setCatchResult] = useState<CatchResult | null>(null);

  useEffect(() => {
    function syncViewportHeight() {
      const height = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--app-height", `${height}px`);
    }

    syncViewportHeight();
    window.visualViewport?.addEventListener("resize", syncViewportHeight);
    window.addEventListener("resize", syncViewportHeight);
    window.addEventListener("orientationchange", syncViewportHeight);

    return () => {
      window.visualViewport?.removeEventListener("resize", syncViewportHeight);
      window.removeEventListener("resize", syncViewportHeight);
      window.removeEventListener("orientationchange", syncViewportHeight);
    };
  }, []);

  useEffect(() => {
    if (mode !== "scanning") {
      return;
    }

    const timer = window.setTimeout(() => {
      setCatchResult(identifyCatch(radarMode));
      setMode("result");
    }, scanDurationMs);

    return () => window.clearTimeout(timer);
  }, [mode, radarMode]);

  function startScan() {
    if (mode === "scanning") {
      return;
    }

    setCatchResult(null);
    setMode("scanning");
  }

  function returnToRadar() {
    setCatchResult(null);
    setMode("idle");
  }

  return (
    <main className="app-shell">
      <section
        className={`radar-panel ${mode} mode-${radarMode} ${catchResult ? `rarity-theme-${catchResult.fish.rarity.toLowerCase()}` : ""}`}
      >
        <header className="app-header">
          <p className="eyebrow">Outdoor catch assistant</p>
          <h1>Fisch Radar</h1>
          <p className="catalog-note">
            {fishCatalog.length} fish signals across {rarityCount} rarity bands
          </p>
        </header>

        <RadarVisual mode={mode} result={catchResult} />

        {mode === "result" && catchResult ? (
          <CatchCard result={catchResult} radarMode={radarMode} onReturn={returnToRadar} />
        ) : (
          <IdleControls
            mode={mode === "scanning" ? "scanning" : "idle"}
            radarMode={radarMode}
            onModeChange={setRadarMode}
            onStart={startScan}
          />
        )}
      </section>
    </main>
  );
}

function RadarVisual({ mode, result }: { mode: "idle" | "scanning" | "result"; result: CatchResult | null }) {
  const shape = result?.fish.shape ?? "small";
  const rarityClass = result ? `rarity-${result.fish.rarity.toLowerCase()}` : "";

  return (
    <div className="radar-wrap" aria-hidden="true">
      <div className="radar-grid" />
      <div className="radar-ring ring-one" />
      <div className="radar-ring ring-two" />
      <div className="radar-ring ring-three" />
      <div className="radar-sweep" />
      <div className={`fish-silhouette ${shape} ${rarityClass} ${mode === "result" ? "visible" : ""}`}>
        <span className="body" />
        <span className="tail" />
        <span className="fin top" />
        <span className="fin bottom" />
      </div>
      <div className="radar-noise" />
    </div>
  );
}

function IdleControls({
  mode,
  radarMode,
  onModeChange,
  onStart,
}: {
  mode: "idle" | "scanning";
  radarMode: RadarMode;
  onModeChange: (mode: RadarMode) => void;
  onStart: () => void;
}) {
  const selectedMode = radarModes[radarMode];

  return (
    <div className="controls">
      <div className="mode-selector" aria-label="Radar mode">
        {(Object.keys(radarModes) as RadarMode[]).map((modeKey) => (
          <button
            key={modeKey}
            type="button"
            className={modeKey === radarMode ? "active" : ""}
            onClick={() => onModeChange(modeKey)}
            disabled={mode === "scanning"}
          >
            {radarModes[modeKey].label}
          </button>
        ))}
      </div>
      <p className="mode-hint">{selectedMode.hint}</p>
      <p className="status-text">
        {mode === "scanning" ? "Scanning the net..." : "When the crew catches something, identify it here."}
      </p>
      <button className="scan-button" type="button" onClick={onStart} disabled={mode === "scanning"}>
        {mode === "scanning" ? "Scanning..." : "Identify Catch"}
      </button>
    </div>
  );
}

function CatchCard({ result, radarMode, onReturn }: { result: CatchResult; radarMode: RadarMode; onReturn: () => void }) {
  const { fish, weightKg, price, signal } = result;

  return (
    <article
      className={`catch-card rarity-${fish.rarity.toLowerCase()}`}
      onClick={onReturn}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onReturn();
        }
      }}
      aria-label="Return to radar"
    >
      <p className="signal">{signal}</p>
      <h2>{fish.name}</h2>
      <p className="rarity-banner">
        {fish.rarity} - {rarityChance(radarMode, fish.rarity)} catch chance
      </p>
      <div className="catch-details">
        <Stat label="Rarity" value={fish.rarity} />
        <Stat label="Weight" value={`${weightKg.toLocaleString()} kg`} />
        <Stat label="Price" value={`${price.toLocaleString()} C$`} />
      </div>
      <p className="play-prompt">Take it back to the ship. Tap the catch card when the crew is ready.</p>
      {["Legendary", "Mythical", "Exotic", "Secret"].includes(fish.rarity) ? <RareParticles /> : null}
    </article>
  );
}

function RareParticles() {
  const particles = ["dot", "spark", "dot", "beam", "dot", "spark", "dot", "beam", "dot", "spark", "dot", "beam"];

  return (
    <div className="rare-particles" aria-hidden="true">
      {particles.map((type, index) => (
        <span key={index} className={type} />
      ))}
    </div>
  );
}

function Stat({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) {
  return (
    <div className="stat">
      <span>{label}:</span>
      <strong>{value}</strong>
      {sublabel ? <small>{sublabel}</small> : null}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
