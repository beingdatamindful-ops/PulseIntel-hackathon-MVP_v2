import { useState } from "react";

const ACCENT = "#7c6ff7";
const GRAD = "linear-gradient(135deg, #7c6ff7 0%, #a78bfa 50%, #14b8a6 100%)";
const GRAD2 = "linear-gradient(135deg, #7c6ff7 0%, #6366f1 100%)";

export default function Setup({ onScan, onLogout, currentUser, darkMode, toggleDark }) {
  const [clientUrl, setClientUrl] = useState("");
  const [compUrl, setCompUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const s = {
    bg: darkMode ? "#07070f" : "#f0eeff",
    card: darkMode ? "rgba(18,18,30,0.9)" : "rgba(255,255,255,0.95)",
    border: darkMode ? "rgba(124,111,247,0.2)" : "rgba(124,111,247,0.15)",
    text: darkMode ? "#f0eeff" : "#1a1825",
    muted: darkMode ? "#c0bdd8" : "#5a5870",
    input: darkMode ? "#1a1a2e" : "#f5f4ff",
    inputBorder: darkMode ? "rgba(124,111,247,0.25)" : "rgba(124,111,247,0.2)",
    hint: darkMode ? "#8a88a0" : "#9896a8",
    nav: darkMode ? "rgba(7,7,15,0.85)" : "rgba(255,255,255,0.85)",
    glow: darkMode ? "0 0 80px rgba(124,111,247,0.12)" : "0 0 60px rgba(124,111,247,0.08)",
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
    width: "100%", background: s.input, border: `1.5px solid ${s.inputBorder}`,
    borderRadius: "12px", padding: "15px 18px", color: s.text, fontSize: "16px",
    fontFamily: "inherit", outline: "none", marginBottom: "20px", boxSizing: "border-box", lineHeight: "1.5",
  };

  const labelStyle = {
    display: "block", fontSize: "13px", fontWeight: 700, letterSpacing: "0.6px",
    textTransform: "uppercase", color: s.muted, marginBottom: "8px",
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
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
  `}</style>

  <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "#05050f" }} />
  <div style={{ position: "fixed", top: "-5%", left: "-10%", width: "700px", height: "700px", zIndex: 0, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,111,247,0.55) 0%, rgba(99,102,241,0.3) 40%, transparent 70%)", animation: "orb1 10s ease-in-out infinite", pointerEvents: "none", filter: "blur(60px)" }} />
  <div style={{ position: "fixed", bottom: "-10%", right: "-5%", width: "650px", height: "650px", zIndex: 0, borderRadius: "50%", background: "radial-gradient(circle, rgba(20,184,166,0.5) 0%, rgba(6,182,212,0.3) 40%, transparent 70%)", animation: "orb2 12s ease-in-out infinite", pointerEvents: "none", filter: "blur(55px)" }} />
  <div style={{ position: "fixed", top: "30%", right: "10%", width: "500px", height: "500px", zIndex: 0, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.45) 0%, rgba(124,111,247,0.25) 40%, transparent 70%)", animation: "orb3 14s ease-in-out infinite", pointerEvents: "none", filter: "blur(50px)" }} />
  <div style={{ position: "fixed", bottom: "15%", left: "10%", width: "450px", height: "450px", zIndex: 0, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,70,229,0.5) 0%, rgba(124,111,247,0.3) 40%, transparent 70%)", animation: "orb1 16s ease-in-out infinite reverse", pointerEvents: "none", filter: "blur(45px)" }} />
  <div style={{ position: "fixed", top: "5%", right: "5%", width: "400px", height: "400px", zIndex: 0, borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.35) 0%, rgba(167,139,250,0.2) 40%, transparent 70%)", animation: "orb2 11s ease-in-out infinite reverse", pointerEvents: "none", filter: "blur(50px)" }} />
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes fadein { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .scan-btn:hover:not(:disabled) { transform: translateY(-2px) !important; box-shadow: 0 8px 32px rgba(124,111,247,0.5) !important; }
        input:focus { border-color: #7c6ff7 !important; box-shadow: 0 0 0 3px rgba(124,111,247,0.15) !important; }
      `}</style>

      {/* Background orbs */}
      <div style={{ position: "fixed", top: "-15%", right: "-5%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,111,247,0.1) 0%, transparent 70%)", pointerEvents: "none", animation: "float 9s ease-in-out infinite" }} />
      <div style={{ position: "fixed", bottom: "-20%", left: "-10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)", pointerEvents: "none", animation: "float 12s ease-in-out infinite reverse" }} />

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 28px", borderBottom: `1px solid ${s.border}`, background: s.nav, backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ fontSize: "1.5rem", fontWeight: 800, background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.5px" }}>
            PulseIntel
          </span>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", color: "#10b981", background: "rgba(16,185,129,0.12)", padding: "4px 12px", borderRadius: "20px", border: "1px solid rgba(16,185,129,0.3)" }}>
            LIVE
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={toggleDark} style={{ background: darkMode ? "rgba(124,111,247,0.15)" : "rgba(124,111,247,0.1)", border: `1.5px solid ${s.border}`, color: s.muted, padding: "8px 18px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontFamily: "inherit", fontWeight: 600 }}>
            {darkMode ? "☀ Light" : "◑ Dark"}
          </button>
          <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: GRAD2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 800, color: "#fff", boxShadow: "0 2px 12px rgba(124,111,247,0.4)" }}>
            {initials}
          </div>
          <button onClick={onLogout} style={{ background: "transparent", border: `1.5px solid ${s.border}`, color: s.muted, padding: "8px 18px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontFamily: "inherit", fontWeight: 600 }}>
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: "620px", margin: "60px auto", padding: "0 24px" }}>
        <div style={{ background: s.card, border: `1.5px solid ${s.border}`, borderRadius: "24px", padding: "3rem 2.5rem", position: "relative", overflow: "hidden", backdropFilter: "blur(20px)", boxShadow: s.glow, animation: "fadein 0.5s ease" }}>

          {/* Gradient top bar */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: GRAD }} />

          {/* Inner glow */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: darkMode ? "radial-gradient(ellipse at top left, rgba(124,111,247,0.07) 0%, transparent 50%)" : "radial-gradient(ellipse at top left, rgba(124,111,247,0.04) 0%, transparent 50%)", pointerEvents: "none" }} />

          <div style={{ position: "relative" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "14px" }}>
              Competitive Intelligence Platform
            </p>

            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: s.text, lineHeight: "1.2", marginBottom: "14px", letterSpacing: "-0.5px" }}>
              Know what competitors are doing — before your prospects do.
            </h1>

            <p style={{ fontSize: "17px", color: s.muted, lineHeight: "1.75", marginBottom: "2.25rem" }}>
              Add your URL and a competitor URL. PulseIntel scrapes both sites using Firecrawl, runs a semantic diff, and delivers AI-powered strategic intelligence in seconds.
            </p>

            <label style={labelStyle}>Your company URL</label>
            <input style={inputStyle} type="url" value={clientUrl} onChange={(e) => setClientUrl(e.target.value)} placeholder="https://yourcompany.com" />

            <label style={labelStyle}>Competitor URL</label>
            <input style={{ ...inputStyle, borderColor: compUrl ? "rgba(239,68,68,0.4)" : s.inputBorder }} type="url" value={compUrl} onChange={(e) => setCompUrl(e.target.value)} placeholder="https://competitor.com" />

            <button className="scan-btn" onClick={handleScan} disabled={!clientUrl || !compUrl || loading}
              style={{ width: "100%", background: GRAD2, color: "#fff", border: "none", borderRadius: "12px", padding: "17px", fontSize: "17px", fontWeight: 700, fontFamily: "inherit", cursor: (!clientUrl || !compUrl || loading) ? "not-allowed" : "pointer", opacity: (!clientUrl || !compUrl || loading) ? 0.5 : 1, letterSpacing: "0.2px", boxShadow: "0 4px 24px rgba(124,111,247,0.4)", transition: "transform 0.15s, box-shadow 0.15s" }}>
              {loading ? "Starting scan..." : "⚡ Run Intelligence Scan"}
            </button>

            <p style={{ fontSize: "14px", color: s.hint, marginTop: "16px", textAlign: "center", lineHeight: "1.6" }}>
              Powered by Firecrawl · Claude AI · Supabase
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
