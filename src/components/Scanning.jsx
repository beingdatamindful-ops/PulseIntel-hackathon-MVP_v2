const ACCENT = "#7c6ff7";
const GRAD = "linear-gradient(135deg, #7c6ff7 0%, #a78bfa 50%, #14b8a6 100%)";

export default function Scanning({ progress, label, darkMode }) {
  const s = {
    text: darkMode ? "#f0eeff" : "#1a1825",
    muted: darkMode ? "#c0bdd8" : "#6b6880",
    hint: darkMode ? "#8a88a0" : "#9896a8",
    border: darkMode ? "rgba(124,111,247,0.2)" : "rgba(124,111,247,0.15)",
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes orb1 {
          0%,100% { transform: translate(0px, 0px) scale(1); }
          33%      { transform: translate(80px, -100px) scale(1.2); }
          66%      { transform: translate(-60px, 60px) scale(0.85); }
        }
        @keyframes orb2 {
          0%,100% { transform: translate(0px, 0px) scale(1); }
          33%      { transform: translate(-90px, 80px) scale(1.15); }
          66%      { transform: translate(70px, -70px) scale(0.9); }
        }
        @keyframes orb3 {
          0%,100% { transform: translate(0px, 0px) scale(1); }
          50%      { transform: translate(60px, 90px) scale(1.25); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          to { transform: rotate(-360deg); }
        }
        @keyframes pulse {
          0%,100% { opacity: 0.6; transform: scale(1); }
          50%      { opacity: 1; transform: scale(1.05); }
        }
        @keyframes fadein {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes progressGlow {
          0%,100% { box-shadow: 0 0 8px rgba(124,111,247,0.6); }
          50%      { box-shadow: 0 0 20px rgba(124,111,247,1), 0 0 40px rgba(124,111,247,0.4); }
        }
        @keyframes stepFade {
          0%   { opacity: 0; transform: translateX(-10px); }
          10%  { opacity: 1; transform: translateX(0); }
          90%  { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(10px); }
        }
      `}</style>

      {/* Pure black base */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "#05050f" }} />

      {/* Orb 1 — massive aggressive purple */}
      <div style={{
        position: "fixed", top: "-5%", left: "-10%",
        width: "700px", height: "700px", zIndex: 0, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,111,247,0.55) 0%, rgba(99,102,241,0.3) 40%, transparent 70%)",
        animation: "orb1 10s ease-in-out infinite",
        pointerEvents: "none", filter: "blur(60px)",
      }} />

      {/* Orb 2 — aggressive teal bottom right */}
      <div style={{
        position: "fixed", bottom: "-10%", right: "-5%",
        width: "650px", height: "650px", zIndex: 0, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(20,184,166,0.5) 0%, rgba(6,182,212,0.3) 40%, transparent 70%)",
        animation: "orb2 12s ease-in-out infinite",
        pointerEvents: "none", filter: "blur(55px)",
      }} />

      {/* Orb 3 — hot violet center right */}
      <div style={{
        position: "fixed", top: "30%", right: "10%",
        width: "500px", height: "500px", zIndex: 0, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(167,139,250,0.45) 0%, rgba(124,111,247,0.25) 40%, transparent 70%)",
        animation: "orb3 14s ease-in-out infinite",
        pointerEvents: "none", filter: "blur(50px)",
      }} />

      {/* Orb 4 — electric indigo bottom left */}
      <div style={{
        position: "fixed", bottom: "15%", left: "10%",
        width: "450px", height: "450px", zIndex: 0, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(79,70,229,0.5) 0%, rgba(124,111,247,0.3) 40%, transparent 70%)",
        animation: "orb1 16s ease-in-out infinite reverse",
        pointerEvents: "none", filter: "blur(45px)",
      }} />

      {/* Orb 5 — pink flash top right */}
      <div style={{
        position: "fixed", top: "5%", right: "5%",
        width: "400px", height: "400px", zIndex: 0, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(236,72,153,0.35) 0%, rgba(167,139,250,0.2) 40%, transparent 70%)",
        animation: "orb2 11s ease-in-out infinite reverse",
        pointerEvents: "none", filter: "blur(50px)",
      }} />

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", padding: "18px 28px", borderBottom: `1px solid rgba(124,111,247,0.15)`, background: "rgba(5,5,15,0.7)", backdropFilter: "blur(16px)" }}>
        <span style={{ fontSize: "1.5rem", fontWeight: 800, background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.5px" }}>
          PulseIntel
        </span>
        <span style={{ marginLeft: "12px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", color: "#10b981", background: "rgba(16,185,129,0.12)", padding: "4px 12px", borderRadius: "20px", border: "1px solid rgba(16,185,129,0.3)" }}>
          SCANNING
        </span>
      </nav>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "36px", textAlign: "center", padding: "40px 20px", position: "relative", zIndex: 1 }}>

        {/* Spinner rings */}
        <div style={{ position: "relative", width: "120px", height: "120px" }}>
          {/* Outer ring */}
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: "50%",
            border: "2px solid transparent",
            borderTopColor: "#7c6ff7",
            borderRightColor: "rgba(124,111,247,0.3)",
            animation: "spin 1.2s linear infinite",
            boxShadow: "0 0 20px rgba(124,111,247,0.4)",
          }} />
          {/* Middle ring */}
          <div style={{
            position: "absolute", inset: "12px",
            borderRadius: "50%",
            border: "2px solid transparent",
            borderTopColor: "#14b8a6",
            borderLeftColor: "rgba(20,184,166,0.3)",
            animation: "spinReverse 0.9s linear infinite",
            boxShadow: "0 0 16px rgba(20,184,166,0.35)",
          }} />
          {/* Inner ring */}
          <div style={{
            position: "absolute", inset: "24px",
            borderRadius: "50%",
            border: "2px solid transparent",
            borderTopColor: "#a78bfa",
            borderRightColor: "rgba(167,139,250,0.3)",
            animation: "spin 0.7s linear infinite",
          }} />
          {/* Center dot */}
          <div style={{
            position: "absolute", inset: "44px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,111,247,0.8) 0%, rgba(124,111,247,0.2) 100%)",
            animation: "pulse 1.5s ease-in-out infinite",
          }} />
        </div>

        {/* Title */}
        <div style={{ animation: "fadein 0.5s ease" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.5px", marginBottom: "10px" }}>
            Running Intelligence Scan
          </h2>
          <p style={{ fontSize: "16px", color: s.muted, lineHeight: "1.6", maxWidth: "400px" }}>
            Scraping, analyzing, and generating AI-powered competitive intelligence
          </p>
        </div>

        {/* Current step label */}
        <div style={{ height: "28px", overflow: "hidden", position: "relative" }}>
          <p style={{ fontSize: "15px", color: "#a78bfa", fontWeight: 600, animation: "stepFade 0.8s ease" }}>
            {label || "Initializing..."}
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ width: "380px", maxWidth: "90vw" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontSize: "13px", color: s.hint, fontWeight: 600 }}>Progress</span>
            <span style={{ fontSize: "13px", fontWeight: 800, background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{progress}%</span>
          </div>
          <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "6px", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${progress}%`,
              background: GRAD,
              borderRadius: "6px",
              transition: "width 0.5s ease",
              animation: "progressGlow 2s ease-in-out infinite",
            }} />
          </div>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {[
            { label: "Scraping", threshold: 25 },
            { label: "Analyzing", threshold: 55 },
            { label: "AI Brief", threshold: 80 },
            { label: "Ready", threshold: 100 },
          ].map((step, i) => {
            const done = progress >= step.threshold;
            const active = progress >= (i === 0 ? 0 : [0, 25, 55, 80][i]) && progress < step.threshold;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "6px 14px", borderRadius: "20px",
                  background: done ? "rgba(124,111,247,0.2)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${done ? "rgba(124,111,247,0.4)" : "rgba(255,255,255,0.08)"}`,
                  transition: "all 0.3s",
                }}>
                  <div style={{
                    width: "7px", height: "7px", borderRadius: "50%",
                    background: done ? ACCENT : "rgba(255,255,255,0.2)",
                    boxShadow: done ? "0 0 8px rgba(124,111,247,0.8)" : "none",
                    transition: "all 0.3s",
                  }} />
                  <span style={{ fontSize: "12px", fontWeight: 600, color: done ? "#c0bdd8" : "rgba(255,255,255,0.3)", transition: "all 0.3s" }}>
                    {step.label}
                  </span>
                </div>
                {i < 3 && <div style={{ width: "20px", height: "1px", background: done ? "rgba(124,111,247,0.4)" : "rgba(255,255,255,0.08)", transition: "all 0.3s" }} />}
              </div>
            );
          })}
        </div>

        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.5px" }}>
          Powered by Firecrawl · Claude AI · Supabase
        </p>
      </div>
    </div>
  );
}
