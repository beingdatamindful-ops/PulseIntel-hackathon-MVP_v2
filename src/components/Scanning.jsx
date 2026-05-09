const ACCENT = "#7c6ff7";

export default function Scanning({ progress, label, darkMode }) {
  const s = {
    bg: darkMode ? "#0a0a0f" : "#f5f4f1",
    text: darkMode ? "#e8e6f0" : "#1a1825",
    muted: darkMode ? "#7a788a" : "#6b6880",
    hint: darkMode ? "#4a4860" : "#b0aec0",
    border: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    nav: darkMode ? "#111118" : "#fff",
  };

  return (
    <div style={{ minHeight: "100vh", background: s.bg }}>
      <nav style={{ display: "flex", alignItems: "center", padding: "12px 20px", borderBottom: `1px solid ${s.border}`, background: s.nav }}>
        <span style={{ fontSize: "1.2rem", fontWeight: 700, color: ACCENT }}>Pulse<span style={{ opacity: 0.6, color: s.text }}>Intel</span></span>
      </nav>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 60px)", gap: "20px", textAlign: "center", padding: "20px" }}>
        <div style={{ width: "56px", height: "56px", border: `3px solid rgba(124,111,247,0.2)`, borderTopColor: ACCENT, borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div>
          <p style={{ fontSize: "16px", fontWeight: 600, color: s.text, marginBottom: "6px" }}>Running Intelligence Scan</p>
          <p style={{ fontSize: "13px", color: s.muted }}>{label || "Initializing..."}</p>
        </div>
        <div style={{ width: "300px", height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: ACCENT, borderRadius: "4px", transition: "width 0.5s ease" }} />
        </div>
        <p style={{ fontSize: "12px", color: s.hint }}>{progress}% complete</p>
      </div>
    </div>
  );
}
