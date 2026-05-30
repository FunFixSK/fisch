import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { CatchResult, fishCatalog, identifyCatch, RadarMode, radarModes, Rarity, rarityChance, rarityCount } from "./fish";
import "./styles.css";

const scanDurationMs = 2200;
const rarityOrder: Rarity[] = ["Trash", "Common", "Uncommon", "Unusual", "Rare", "Legendary", "Mythical", "Exotic", "Secret"];

function App() {
  const [mode, setMode] = useState<"idle" | "scanning" | "result" | "catalog">("idle");
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
          <button className="catalog-note" type="button" onClick={() => setMode("catalog")}>
            {fishCatalog.length} fish signals across {rarityCount} rarity bands
          </button>
        </header>

        {mode === "catalog" ? (
          <CatalogScreen radarMode={radarMode} onModeChange={setRadarMode} onReturn={returnToRadar} />
        ) : (
          <RadarVisual mode={mode} result={catchResult} />
        )}

        {mode === "catalog" ? null : mode === "result" && catchResult ? (
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

function CatalogScreen({
  radarMode,
  onModeChange,
  onReturn,
}: {
  radarMode: RadarMode;
  onModeChange: (mode: RadarMode) => void;
  onReturn: () => void;
}) {
  return (
    <article className="catalog-screen">
      <div className="catalog-topline">
        <p className="signal">Signal archive</p>
        <button type="button" onClick={onReturn}>
          Back
        </button>
      </div>
      <h2>{radarModes[radarMode].label}</h2>
      <div className="mode-selector compact" aria-label="Catalog radar mode">
        {(Object.keys(radarModes) as RadarMode[]).map((modeKey) => (
          <button key={modeKey} type="button" className={modeKey === radarMode ? "active" : ""} onClick={() => onModeChange(modeKey)}>
            {radarModes[modeKey].label}
          </button>
        ))}
      </div>
      <div className="rarity-list">
        {rarityOrder.map((rarity) => {
          const fishNames = fishCatalog.filter((fish) => fish.rarity === rarity).map((fish) => fish.name);

          return (
            <section key={rarity} className={`rarity-row rarity-row-${rarity.toLowerCase()}`}>
              <div className="rarity-row-head">
                <strong>{rarity}</strong>
                <span>{rarityChance(radarMode, rarity)} catch chance</span>
              </div>
              <p>{fishNames.join(", ")}</p>
            </section>
          );
        })}
      </div>
    </article>
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
