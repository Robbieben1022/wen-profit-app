import { useState, useEffect } from "react";

export default function Home() {
  const [pipeDiameter, setPipeDiameter] = useState(43.75);
  const [wallThickness, setWallThickness] = useState(0.219);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    const accepted = localStorage.getItem("disclaimerAccepted");
    if (accepted === "true") {
      setAcceptedDisclaimer(true);
    }
  }, []);

  const handleInstall = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then(() => setInstallPrompt(null));
    }
  };

  const acceptDisclaimer = () => {
    localStorage.setItem("disclaimerAccepted", "true");
    setAcceptedDisclaimer(true);
  };

  const toDegrees = (rad) => (rad * 180) / Math.PI;
  const helixAngle = Math.round((90 - toDegrees(Math.asin(wallThickness / (Math.PI * pipeDiameter)))) * 100) / 100;
  const traeger2 = Math.round((175 + (pipeDiameter - 43.75) * 5) * 10) / 10;

  const inputStyle = {
    width: "8rem",
    padding: "0.5rem",
    borderRadius: "0.25rem"
  };

  const buttonStyle = {
    backgroundColor: "#16a34a",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.5rem",
    color: "white",
    border: "none",
    cursor: "pointer"
  };

  return (
    <main style={{ minHeight: "100vh", background: "#111827", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem", position: "relative" }}>
      {!acceptedDisclaimer && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#1f2937", padding: "1.5rem", borderRadius: "0.5rem", maxWidth: "24rem", textAlign: "center", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>⚠️ Disclaimer</h2>
            <p style={{ marginBottom: "1rem" }}>
              This app was created using input and insights from the entire team, but is not an official company product.
            </p>
            <button onClick={acceptDisclaimer} style={buttonStyle}>
              I Understand
            </button>
          </div>
        </div>
      )}

      {acceptedDisclaimer && (
        <div style={{ textAlign: "center", width: "100%", maxWidth: "36rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Wen Profit App</h1>

          <div style={{ display: "grid", gap: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontSize: "1.125rem" }}>Pipe Diameter (in):</label>
              <input
                type="number"
                inputMode="decimal"
                step="1"
                value={pipeDiameter}
                onChange={(e) => setPipeDiameter(parseFloat(e.target.value))}
                style={inputStyle}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontSize: "1.125rem" }}>Wall Thickness (in):</label>
              <input
                type="number"
                inputMode="decimal"
                step="0.001"
                value={wallThickness}
                onChange={(e) => setWallThickness(parseFloat(e.target.value))}
                style={inputStyle}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "1.125rem", fontWeight: 600 }}>Helix Angle (°):</span>
              <span style={{ fontSize: "1.25rem" }}>{helixAngle}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "1.125rem", fontWeight: 600 }}>Hold Down (Träger 2):</span>
              <span style={{ fontSize: "1.25rem" }}>{traeger2}</span>
            </div>

            {installPrompt && (
              <button onClick={handleInstall} style={{ ...buttonStyle, marginTop: "1.5rem" }}>
                Install App
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
