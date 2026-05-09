import { useState } from "react";

const ACCENT = "#7c6ff7";

export default function Setup({ onScan, onLogout, currentUser, darkMode, toggleDark }) {
  const [clientUrl, setClientUrl] = useState("https://yourcompany.com");
  const [compUrl, setCompUrl] = useState("https://competitor.com");
  const [loading, setLoading] = useState(false);

  const s = {
    bg: darkMode ? "#0a0a0f" : "#f5f4f1",
    card: darkMode ? "#111118" : "#ffffff",
    border: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    text: darkMode ? "#e8e6f0" : "#1a1825",
    muted: darkMode ? "#7a788a" : "#6b6880",
    input: darkMode ? "#1a1a24" : "#f0eff9",
    inputBorder: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    hint: darkMode ? "#4a4860" : "#b0aec0",
  };

  const name = currentUser?.user_metadata?.full_name || currentUser?.email?.split("@")[0] || "User";
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  async function handleScan() {
    if (!clientUrl || !compUrl) return;
    setLoading(true);
    await onScan(clientUrl, compUrl);
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: s.bg }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: `1px solid ${s.border}`, background: darkMode ? "#111118" : "#fff", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.2rem", fontWeight: 700, color: ACCENT }}>Pulse<span style={{ opacity: 0.6, color: s.text }}>Intel</span></span>
          <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1px", color: "#10b981", background: "rgba(16,185,129,0.12)", padding: "3px 8px", borderRadius: "20px", border: "1px solid rgba(16,185,129,0.25)" }}>LIVE</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={toggleDark} style={{ background: "transparent", border: `1px solid ${s.border}`, color: s.muted, padding: "5px 12px", borderRadius: "7px", cursor: "pointer", fontSize: "12px", fontFamily: "inherit" }}>◑ Toggle</button>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(124,111,247,0.2)", border: "1px solid rgba(124,111,247,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: ACCENT }}>{initials}</div>
            <button onClick={onLogout} style={{ background: "transparent", border: `1px solid ${s.border}`, color: s.muted, padding: "5px 12px", borderRadius: "7px", cursor: "pointer", fontSize: "12px", fontFamily: "inherit" }}>Sign out</button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: "520px", margin: "60px auto", padding: "0 20px" }}>
        <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: "20px", padding: "2.5rem 2rem", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: ACCENT }} />
          <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: ACCENT, marginBottom: "10px" }}>Competitive Intelligence Platform</p>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: s.text, lineHeight: "1.2", marginBottom: "10px" }}>Know what competitors are doing — before your prospects do.</h1>
          <p style={{ fontSize: "13px", color: s.muted, lineHeight: "1.6", marginBottom: "1.75rem" }}>Add your URL and a competitor URL. PulseIntel scrapes both sites using Firecrawl, runs a semantic diff, and delivers AI-powered strategic intelligence in seconds.</p>

          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: s.muted, marginBottom: "6px" }}>Your company URL</label>
          <input
            style={{ width: "100%", background: s.input, border: `1px solid ${s.inputBorder}`, borderRadius: "9px", padding: "11px 14px", color: s.text, fontSize: "13px", fontFamily: "inherit", outline: "none", marginBottom: "14px", boxSizing: "border-box" }}
            type="url" value={clientUrl} onChange={(e) => setClientUrl(e.target.value)} placeholder="https://yourcompany.com"
          />

          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: s.muted, marginBottom: "6px" }}>Competitor URL</label>
          <input
            style={{ width: "100%", background: s.input, border: `1px solid rgba(239,68,68,0.3)`, borderRadius: "9px", padding: "11px 14px", color: s.text, fontSize: "13px", fontFamily: "inherit", outline: "none", marginBottom: "20px", boxSizing: "border-box" }}
            type="url" value={compUrl} onChange={(e) => setCompUrl(e.target.value)} placeholder="https://competitor.com"
          />

          <button onClick={handleScan} disabled={!clientUrl || !compUrl || loading}
            style={{ width: "100%", background: ACCENT, color: "#fff", border: "none", borderRadius: "9px", padding: "13px", fontSize: "14px", fontWeight: 700, fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer", opacity: (!clientUrl || !compUrl || loading) ? 0.5 : 1 }}>
            {loading ? "Starting scan..." : "⚡ Run Intelligence Scan"}
          </button>

          <p style={{ fontSize: "11px", color: s.hint, marginTop: "12px", textAlign: "center", lineHeight: "1.6" }}>
            Powered by Firecrawl · Claude AI · Supabase
          </p>
        </div>
      </div>
    </div>
  );
}
