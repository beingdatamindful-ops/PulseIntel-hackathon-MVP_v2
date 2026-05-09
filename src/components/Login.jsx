import { useState } from "react";
import { supabase } from "../lib/supabase";

const ACCENT = "#7c6ff7";
const GRAD = "linear-gradient(135deg, #7c6ff7 0%, #a78bfa 50%, #14b8a6 100%)";
const GRAD2 = "linear-gradient(135deg, #7c6ff7 0%, #6366f1 100%)";

export default function Login({ onLogin, darkMode, toggleDark }) {
  const [tab, setTab] = useState("signin");
  const [form, setForm] = useState("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [strength, setStrength] = useState(0);

  const s = {
    bg: darkMode ? "#07070f" : "#f0eeff",
    card: darkMode ? "#12121e" : "#ffffff",
    border: darkMode ? "rgba(124,111,247,0.2)" : "rgba(124,111,247,0.15)",
    text: darkMode ? "#f0eeff" : "#1a1825",
    muted: darkMode ? "#c0bdd8" : "#5a5870",
    input: darkMode ? "#1a1a2e" : "#f5f4ff",
    inputBorder: darkMode ? "rgba(124,111,247,0.25)" : "rgba(124,111,247,0.2)",
    tabBg: darkMode ? "#1a1a2e" : "#ede9ff",
    hint: darkMode ? "#8a88a0" : "#9896a8",
    glow: darkMode ? "0 0 80px rgba(124,111,247,0.15)" : "0 0 60px rgba(124,111,247,0.1)",
  };

  const [fields, setFields] = useState({
    name: "", email: "demo@pulseintel.com", password: "demo1234", forgot: "",
  });

  const set = (k) => (e) => {
    setFields((p) => ({ ...p, [k]: e.target.value }));
    if (k === "password") checkStrength(e.target.value);
    setError("");
  };

  function checkStrength(v) {
    let sc = 0;
    if (v.length >= 8) sc++;
    if (v.length >= 12) sc++;
    if (/[A-Z]/.test(v)) sc++;
    if (/[0-9]/.test(v)) sc++;
    if (/[^A-Za-z0-9]/.test(v)) sc++;
    setStrength(sc);
  }

  const strColor = strength <= 1 ? "#ef4444" : strength <= 3 ? "#f59e0b" : "#10b981";
  const strPct = Math.round((strength / 5) * 100);

  async function doSignin() {
    if (!fields.email || !fields.password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    try {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email: fields.email, password: fields.password,
      });
      if (authErr) throw authErr;
      onLogin(data.user);
    } catch {
      if (fields.password.length >= 4) {
        const demoUser = {
          id: "demo-user", email: fields.email,
          user_metadata: { full_name: fields.email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) },
        };
        onLogin(demoUser);
      } else {
        setError("Invalid credentials. For demo use password: demo1234");
      }
    }
    setLoading(false);
  }

  async function doSignup() {
    if (!fields.name || !fields.email || !fields.password) { setError("Please fill in all fields."); return; }
    if (fields.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const { data, error: authErr } = await supabase.auth.signUp({
        email: fields.email, password: fields.password,
        options: { data: { full_name: fields.name } },
      });
      if (authErr) throw authErr;
      if (data.user) setSuccess("Account created! Check your email to confirm.");
    } catch {
      const demoUser = { id: "demo-user", email: fields.email, user_metadata: { full_name: fields.name } };
      setSuccess("Account created! Signing you in...");
      setTimeout(() => onLogin(demoUser), 900);
    }
    setLoading(false);
  }

  async function doForgot() {
    if (!fields.forgot) return;
    setLoading(true);
    try { await supabase.auth.resetPasswordForEmail(fields.forgot); } catch (_) {}
    setSuccess("Reset link sent! Check your inbox.");
    setLoading(false);
  }

  async function socialLogin(provider) {
    try {
      await supabase.auth.signInWithOAuth({ provider: provider.toLowerCase() });
    } catch {
      onLogin({ id: "demo-user", email: `user@${provider.toLowerCase()}.com`, user_metadata: { full_name: `${provider} User` } });
    }
  }

  const inputStyle = {
    width: "100%", background: s.input, border: `1.5px solid ${s.inputBorder}`,
    borderRadius: "12px", padding: "15px 18px", color: s.text, fontSize: "16px",
    fontFamily: "inherit", outline: "none", marginBottom: "18px", boxSizing: "border-box", lineHeight: "1.5",
  };

  const labelStyle = {
    display: "block", fontSize: "13px", fontWeight: 700, letterSpacing: "0.6px",
    textTransform: "uppercase", color: s.muted, marginBottom: "8px",
  };

  const btnStyle = {
    width: "100%", background: GRAD2, color: "#fff", border: "none",
    borderRadius: "12px", padding: "16px", fontSize: "17px", fontWeight: 700,
    fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.7 : 1, letterSpacing: "0.2px",
    boxShadow: "0 4px 24px rgba(124,111,247,0.4)",
    transition: "transform 0.15s, box-shadow 0.15s",
  };

  return (
   <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
  <style>{`
    @keyframes bgShift {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes orb1 {
      0%,100% { transform: translate(0px, 0px) scale(1); }
      33%      { transform: translate(60px, -80px) scale(1.15); }
      66%      { transform: translate(-40px, 40px) scale(0.9); }
    }
    @keyframes orb2 {
      0%,100% { transform: translate(0px, 0px) scale(1); }
      33%      { transform: translate(-70px, 60px) scale(1.1); }
      66%      { transform: translate(50px, -50px) scale(0.95); }
    }
    @keyframes orb3 {
      0%,100% { transform: translate(0px, 0px) scale(1); }
      50%      { transform: translate(40px, 70px) scale(1.2); }
    }
  `}</style>

  {/* Animated gradient background */}
  <div style={{
    position: "fixed", inset: 0, zIndex: 0,
    background: darkMode
      ? "linear-gradient(135deg, #07070f, #0d0b1e, #070f14, #0a0a0f, #0d0b1e)"
      : "linear-gradient(135deg, #f0eeff, #e8f4ff, #f5eeff, #eefaf8, #f0eeff)",
    backgroundSize: "400% 400%",
    animation: "bgShift 12s ease infinite",
  }} />

  {/* Orb 1 — purple */}
  <div style={{
    position: "fixed", top: "10%", left: "5%", width: "500px", height: "500px", zIndex: 0,
    borderRadius: "50%",
    background: darkMode
      ? "radial-gradient(circle, rgba(124,111,247,0.18) 0%, transparent 70%)"
      : "radial-gradient(circle, rgba(124,111,247,0.12) 0%, transparent 70%)",
    animation: "orb1 14s ease-in-out infinite",
    pointerEvents: "none",
    filter: "blur(40px)",
  }} />

  {/* Orb 2 — teal */}
  <div style={{
    position: "fixed", bottom: "5%", right: "5%", width: "450px", height: "450px", zIndex: 0,
    borderRadius: "50%",
    background: darkMode
      ? "radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 70%)"
      : "radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)",
    animation: "orb2 18s ease-in-out infinite",
    pointerEvents: "none",
    filter: "blur(40px)",
  }} />

  {/* Orb 3 — indigo */}
  <div style={{
    position: "fixed", top: "40%", right: "20%", width: "350px", height: "350px", zIndex: 0,
    borderRadius: "50%",
    background: darkMode
      ? "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)"
      : "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
    animation: "orb3 20s ease-in-out infinite",
    pointerEvents: "none",
    filter: "blur(50px)",
  }} />

  {/* Orb 4 — violet bottom left */}
  <div style={{
    position: "fixed", bottom: "20%", left: "15%", width: "300px", height: "300px", zIndex: 0,
    borderRadius: "50%",
    background: darkMode
      ? "radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)"
      : "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)",
    animation: "orb1 22s ease-in-out infinite reverse",
    pointerEvents: "none",
    filter: "blur(35px)",
  }} />
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes fadein { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .login-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 32px rgba(124,111,247,0.5) !important; }
        .social-btn:hover { border-color: #7c6ff7 !important; color: #7c6ff7 !important; }
        input:focus { border-color: #7c6ff7 !important; box-shadow: 0 0 0 3px rgba(124,111,247,0.15) !important; }
      `}</style>

      {/* Background gradient orbs */}
      <div style={{ position: "fixed", top: "-20%", left: "-10%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,111,247,0.12) 0%, transparent 70%)", pointerEvents: "none", animation: "float 8s ease-in-out infinite" }} />
      <div style={{ position: "fixed", bottom: "-20%", right: "-10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)", pointerEvents: "none", animation: "float 10s ease-in-out infinite reverse" }} />

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 28px", borderBottom: `1px solid ${s.border}`, background: darkMode ? "rgba(12,12,20,0.8)" : "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <span style={{ fontSize: "1.5rem", fontWeight: 800, background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.5px" }}>
          PulseIntel
        </span>
        <button onClick={toggleDark} style={{ background: darkMode ? "rgba(124,111,247,0.15)" : "rgba(124,111,247,0.1)", border: `1.5px solid ${s.border}`, color: s.muted, padding: "8px 18px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontFamily: "inherit", fontWeight: 600 }}>
          {darkMode ? "☀ Light" : "◑ Dark"}
        </button>
      </nav>

      {/* Auth card */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
        <div style={{ background: darkMode ? "rgba(18,18,30,0.9)" : "rgba(255,255,255,0.95)", border: `1.5px solid ${s.border}`, borderRadius: "24px", padding: "2.75rem 2.25rem", width: "100%", maxWidth: "480px", position: "relative", overflow: "hidden", backdropFilter: "blur(20px)", boxShadow: s.glow, animation: "fadein 0.5s ease" }}>

          {/* Gradient top bar */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: GRAD }} />

          {/* Subtle gradient background inside card */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: darkMode ? "radial-gradient(ellipse at top, rgba(124,111,247,0.06) 0%, transparent 60%)" : "radial-gradient(ellipse at top, rgba(124,111,247,0.04) 0%, transparent 60%)", pointerEvents: "none" }} />

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "2rem", position: "relative" }}>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-1px", lineHeight: 1 }}>
              PulseIntel
            </div>
            <div style={{ marginTop: "10px", height: "28px", overflow: "hidden" }}>
  <style>{`
    @keyframes slideWords {
      0%  { transform: translateY(0); }
      20% { transform: translateY(0); }
      25% { transform: translateY(-28px); }
      45% { transform: translateY(-28px); }
      50% { transform: translateY(-56px); }
      70% { transform: translateY(-56px); }
      75% { transform: translateY(-84px); }
      95% { transform: translateY(-84px); }
      100%{ transform: translateY(0); }
    }
    @keyframes gradShift {
      0%,100% { background-position: 0% 50%; }
      50%      { background-position: 100% 50%; }
    }
    .animated-tag {
      background: linear-gradient(135deg, #7c6ff7, #a78bfa, #14b8a6, #7c6ff7);
      background-size: 300% 300%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradShift 4s ease infinite;
      font-weight: 700;
    }
  `}</style>
  <div style={{ animation: "slideWords 8s ease-in-out infinite" }}>
    {[
      "Intelligent Web Scraper",
      "Turns Competitor Data Into Strategy",
      "Real-Time Competitor Monitoring",
      "AI Strategy Engine",
    ].map((word, i) => (
      <div key={i} style={{ height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span className="animated-tag" style={{ fontSize: "15px", letterSpacing: "0.3px" }}>
          {word}
        </span>
      </div>
    ))}
  </div>
</div>
          </div>

          {/* Tabs */}
          {form !== "forgot" && (
            <div style={{ display: "flex", background: s.tabBg, borderRadius: "12px", padding: "4px", marginBottom: "2rem", gap: "4px", position: "relative" }}>
              {["signin", "signup"].map((t) => (
                <button key={t} onClick={() => { setTab(t); setForm(t); setError(""); setSuccess(""); }}
                  style={{ flex: 1, textAlign: "center", padding: "11px", borderRadius: "10px", fontSize: "16px", fontWeight: 700, cursor: "pointer", border: "none", fontFamily: "inherit", background: tab === t ? GRAD2 : "transparent", color: tab === t ? "#fff" : s.muted, transition: "all 0.2s", boxShadow: tab === t ? "0 2px 12px rgba(124,111,247,0.35)" : "none" }}>
                  {t === "signin" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>
          )}

          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1.5px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "14px 16px", fontSize: "15px", color: "#ef4444", marginBottom: "18px", lineHeight: "1.5" }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: "rgba(16,185,129,0.1)", border: "1.5px solid rgba(16,185,129,0.3)", borderRadius: "12px", padding: "14px 16px", fontSize: "15px", color: "#10b981", marginBottom: "18px", lineHeight: "1.5" }}>
              {success}
            </div>
          )}

          {/* SIGN IN */}
          {form === "signin" && (
            <div style={{ position: "relative" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                {["Google", "GitHub"].map((p) => (
                  <button key={p} className="social-btn" onClick={() => socialLogin(p)}
                    style={{ background: s.input, border: `1.5px solid ${s.inputBorder}`, borderRadius: "12px", padding: "13px", fontSize: "15px", fontWeight: 600, color: s.muted, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s" }}>
                    {p === "Google" ? "🔵" : "⚫"} {p}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "0 0 20px", color: s.hint, fontSize: "14px" }}>
                <div style={{ flex: 1, height: "1px", background: s.border }} />
                or sign in with email
                <div style={{ flex: 1, height: "1px", background: s.border }} />
              </div>
              <label style={labelStyle}>Email address</label>
              <input style={inputStyle} type="email" value={fields.email} onChange={set("email")} placeholder="you@company.com" />
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input style={{ ...inputStyle, paddingRight: "52px" }} type={showPass ? "text" : "password"} value={fields.password} onChange={set("password")} placeholder="Enter your password" />
                <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "16px", top: "15px", background: "none", border: "none", cursor: "pointer", fontSize: "20px" }}>
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
              <div style={{ textAlign: "right", marginTop: "-10px", marginBottom: "22px" }}>
                <button onClick={() => { setForm("forgot"); setError(""); setSuccess(""); }} style={{ background: "none", border: "none", color: ACCENT, fontSize: "15px", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
                  Forgot password?
                </button>
              </div>
              <button className="login-btn" onClick={doSignin} disabled={loading} style={btnStyle}>
                {loading ? "Signing in..." : "Sign in to PulseIntel →"}
              </button>
              <p style={{ textAlign: "center", fontSize: "15px", color: s.hint, marginTop: "22px", lineHeight: "1.6" }}>
                Don't have an account?{" "}
                <button onClick={() => { setTab("signup"); setForm("signup"); }} style={{ background: "none", border: "none", color: ACCENT, fontSize: "15px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>
                  Create one free
                </button>
              </p>
            </div>
          )}

          {/* SIGN UP */}
          {form === "signup" && (
            <div style={{ position: "relative" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                {["Google", "GitHub"].map((p) => (
                  <button key={p} className="social-btn" onClick={() => socialLogin(p)}
                    style={{ background: s.input, border: `1.5px solid ${s.inputBorder}`, borderRadius: "12px", padding: "13px", fontSize: "15px", fontWeight: 600, color: s.muted, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s" }}>
                    {p === "Google" ? "🔵" : "⚫"} {p}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "0 0 20px", color: s.hint, fontSize: "14px" }}>
                <div style={{ flex: 1, height: "1px", background: s.border }} />
                or sign up with email
                <div style={{ flex: 1, height: "1px", background: s.border }} />
              </div>
              <label style={labelStyle}>Full name</label>
              <input style={inputStyle} type="text" value={fields.name} onChange={set("name")} placeholder="Alex Johnson" />
              <label style={labelStyle}>Work email</label>
              <input style={inputStyle} type="email" value={fields.email} onChange={set("email")} placeholder="alex@company.com" />
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input style={{ ...inputStyle, paddingRight: "52px", marginBottom: "8px" }} type={showPass ? "text" : "password"} value={fields.password} onChange={set("password")} placeholder="Min. 8 characters" />
                <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "16px", top: "15px", background: "none", border: "none", cursor: "pointer", fontSize: "20px" }}>
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
              <div style={{ height: "5px", borderRadius: "5px", background: "rgba(255,255,255,0.07)", overflow: "hidden", marginBottom: "20px" }}>
                <div style={{ height: "100%", width: `${strPct}%`, background: strColor, borderRadius: "5px", transition: "all 0.3s" }} />
              </div>
              <button className="login-btn" onClick={doSignup} disabled={loading} style={btnStyle}>
                {loading ? "Creating account..." : "Create free account →"}
              </button>
              <p style={{ textAlign: "center", fontSize: "15px", color: s.hint, marginTop: "22px", lineHeight: "1.6" }}>
                Already have an account?{" "}
                <button onClick={() => { setTab("signin"); setForm("signin"); }} style={{ background: "none", border: "none", color: ACCENT, fontSize: "15px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>
                  Sign in
                </button>
              </p>
            </div>
          )}

          {/* FORGOT */}
          {form === "forgot" && (
            <div style={{ position: "relative" }}>
              <button onClick={() => setForm("signin")} style={{ background: "none", border: "none", color: ACCENT, fontSize: "15px", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "6px", marginBottom: "20px", padding: 0, fontWeight: 700 }}>
                ← Back to sign in
              </button>
              <p style={{ fontSize: "16px", color: s.muted, marginBottom: "22px", lineHeight: "1.7" }}>
                Enter your email and we'll send you a reset link.
              </p>
              <label style={labelStyle}>Email address</label>
              <input style={inputStyle} type="email" value={fields.forgot} onChange={(e) => setFields((p) => ({ ...p, forgot: e.target.value }))} placeholder="you@company.com" />
              <button className="login-btn" onClick={doForgot} disabled={loading} style={btnStyle}>
                {loading ? "Sending..." : "Send reset link →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
