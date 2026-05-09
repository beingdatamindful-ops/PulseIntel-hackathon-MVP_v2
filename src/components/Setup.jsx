import { useState } from "react";

const ACCENT = "#7c6ff7";

export default function Setup({ onScan, onLogout, currentUser, darkMode, toggleDark }) {
  const [clientUrl, setClientUrl] = useState("");
  const [compUrl, setCompUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const s = {
    bg: darkMode ? "#0a0a0f" : "#f5f4f1",
    card: darkMode ? "#16161f" : "#ffffff",
    border: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    text: darkMode ? "#f0eeff" : "#1a1825",
    muted: darkMode ? "#b8b6cc" : "#5a5870",
    input: darkMode ? "#1e1e2e" : "#f0eff9",
    inputBorder: darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
    hint: darkMode ? "#7a788a" : "#9896a8",
    nav: darkMode ? "#111118" : "#fff",
  };

  const name = currentUser?.user_metadata?.full_name || currentUser?.email?.split("@")[0] || "User";
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  async function handleScan() {
    if (!clientUrl || !compUrl) return;
    setLoading(true);
    await onScan(clientUrl, compUrl);
    setLoading(false);
  }

  const inputStyle = {
    width: "100%",
    background: s.input,
    border: `1.5px solid ${s.inputBorder}`,
    borderRadius: "10px",
    padding: "14px 16px",
    color: s.text,
    fontSize: "15px",
    fontFamily: "inherit",
    outline: "none",
    marginBottom: "20px",
    boxSizing: "border-box",
    lineHeight: "1.5",
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    color: s.muted,
    marginBottom: "8px",
  };

  return (
    <div style={{ minHeight: "100vh", background: s.bg }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: `1px solid ${s.border}`, background: s.nav, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "1.4rem", fontWeight: 700, color: ACCENT, letterSpacing: "-0.5px" }}>
            Pulse<span style={{ opacity: 0.6, color: s.text }}>Intel</span>
          </span>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", color: "#10b981", background: "rgba(16,185,129,0.12)", padding: "4px 10px", borderRadius: "20px", border: "1px solid rgba(16,185,129,0.25)" }}>
            LIVE
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={toggleDark} style={{ background: "transparent", border: `1.5px solid ${s.border}`, color: s.muted, padding: "7px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontFamily: "inherit" }}>
            {darkMode ? "☀ Light" : "◑ Dark"}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "rgba(124,111,247,0.2)", border: "1.5px solid rgba(124,111,247,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: ACCENT }}>
              {initials}
            </div>
            <button onClick={onLogout} style={{ background: "transparent", border: `1.5px solid ${s.border}`, color: s.muted, padding: "7px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontFamily: "inherit" }}>
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: "580px", margin: "60px auto", padding: "0 24px" }}>
        <div style={{ background: s.card, border: `1.5px solid ${s.border}`, borderRadius: "20px", padding: "2.5rem 2.25rem", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: ACCENT }} />

          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: ACCENT, marginBottom: "12px" }}>
            Competitive Intelligence Platform
          </p>

          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: s.text, lineHeight: "1.25", marginBottom: "12px", letterSpacing: "-0.5px" }}>
            Know what competitors are doing — before your prospects do.
          </h1>

          <p style={{ fontSize: "16px", color: s.muted, lineHeight: "1.7", marginBottom: "2rem" }}>
            Add your URL and a competitor URL. PulseIntel scrapes both sites using Firecrawl, runs a semantic diff, and delivers AI-powered strategic intelligence in seconds.
          </p>

          <label style={labelStyle}>Your company URL</label>
          <input
            style={inputStyle}
            type="url"
            value={clientUrl}
            onChange={(e) => setClientUrl(e.target.value)}
            placeholder="https://yourcompany.com"
          />

          <label style={labelStyle}>Competitor URL</label>
          <input
            style={{ ...inputStyle, borderColor: compUrl ? "rgba(239,68,68,0.4)" : s.inputBorder }}
            type="url"
            value={compUrl}
            onChange={(e) => setCompUrl(e.target.value)}
            placeholder="https://competitor.com"
          />

          <button
            onClick={handleScan}
            disabled={!clientUrl || !compUrl || loading}
            style={{
              width: "100%",
              background: ACCENT,
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "15px",
              fontSize: "16px",
              fontWeight: 700,
              fontFamily: "inherit",
              cursor: (!clientUrl || !compUrl || loading) ? "not-allowed" : "pointer",
              opacity: (!clientUrl || !compUrl || loading) ? 0.5 : 1,
              letterSpacing: "0.2px",
            }}>
            {loading ? "Starting scan..." : "⚡ Run Intelligence Scan"}
          </button>

          <p style={{ fontSize: "13px", color: s.hint, marginTop: "14px", textAlign: "center", lineHeight: "1.6" }}>
            Powered by Firecrawl · Claude AI · Supabase
          </p>
        </div>
      </div>
    </div>
  );
}
