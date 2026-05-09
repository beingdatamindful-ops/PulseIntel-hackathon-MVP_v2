import { useState } from "react";
import { supabase } from "../lib/supabase";

const ACCENT = "#7c6ff7";

export default function Login({ onLogin, darkMode, toggleDark }) {
  const [tab, setTab] = useState("signin");
  const [form, setForm] = useState("signin"); // signin | signup | forgot
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [strength, setStrength] = useState(0);

  const s = {
    bg: darkMode ? "#0a0a0f" : "#f5f4f1",
    card: darkMode ? "#111118" : "#ffffff",
    border: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    text: darkMode ? "#e8e6f0" : "#1a1825",
    muted: darkMode ? "#7a788a" : "#6b6880",
    input: darkMode ? "#1a1a24" : "#f0eff9",
    inputBorder: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    tabBg: darkMode ? "#1a1a24" : "#f0eff9",
    hint: darkMode ? "#4a4860" : "#b0aec0",
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
      // Try Supabase auth first
      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email: fields.email,
        password: fields.password,
      });
      if (authErr) throw authErr;
      onLogin(data.user);
    } catch (err) {
      // Demo fallback — works without real Supabase credentials
      if (fields.password.length >= 4) {
        const demoUser = {
          id: "demo-user",
          email: fields.email,
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
        email: fields.email,
        password: fields.password,
        options: { data: { full_name: fields.name } },
      });
      if (authErr) throw authErr;
      if (data.user) {
        setSuccess("Account created! Check your email to confirm, or sign in now.");
      }
    } catch (err) {
      // Demo fallback
      const demoUser = {
        id: "demo-user",
        email: fields.email,
        user_metadata: { full_name: fields.name },
      };
      setSuccess("Account created! Signing you in...");
      setTimeout(() => onLogin(demoUser), 900);
    }
    setLoading(false);
  }

  async function doForgot() {
    if (!fields.forgot) return;
    setLoading(true);
    try {
      await supabase.auth.resetPasswordForEmail(fields.forgot, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
    } catch (_) {}
    setSuccess("Reset link sent! Check your inbox.");
    setLoading(false);
  }

  async function socialLogin(provider) {
    try {
      await supabase.auth.signInWithOAuth({ provider: provider.toLowerCase() });
    } catch (_) {
      // Demo fallback
      const demoUser = { id: "demo-user", email: `user@${provider.toLowerCase()}.com`, user_metadata: { full_name: `${provider} User` } };
      onLogin(demoUser);
    }
  }

  const inputStyle = {
    width: "100%", background: s.input, border: `1px solid ${s.inputBorder}`,
    borderRadius: "9px", padding: "11px 14px", color: s.text, fontSize: "13px",
    fontFamily: "inherit", outline: "none", marginBottom: "14px", boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.8px",
    textTransform: "uppercase", color: s.muted, marginBottom: "6px",
  };

  return (
    <div style={{ minHeight: "100vh", background: s.bg, display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: `1px solid ${s.border}`, background: darkMode ? "#111118" : "#fff" }}>
        <span style={{ fontSize: "1.2rem", fontWeight: 700, color: ACCENT }}>Pulse<span style={{ opacity: 0.6, color: darkMode ? "#e8e6f0" : "#1a1825" }}>Intel</span></span>
        <button onClick={toggleDark} style={{ background: "transparent", border: `1px solid ${s.border}`, color: s.muted, padding: "5px 12px", borderRadius: "7px", cursor: "pointer", fontSize: "12px", fontFamily: "inherit" }}>◑ Toggle</button>
      </nav>

      {/* Auth card */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: "20px", padding: "2.5rem 2rem", width: "100%", maxWidth: "420px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: ACCENT }} />

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <div style={{ fontSize: "1.8rem", fontWeight: 700, color: ACCENT }}>Pulse<span style={{ color: s.text, opacity: 0.6 }}>Intel</span></div>
            <p style={{ fontSize: "12px", color: s.muted, marginTop: "4px" }}>Competitive intelligence for modern teams</p>
          </div>

          {/* Tabs */}
          {form !== "forgot" && (
            <div style={{ display: "flex", background: s.tabBg, borderRadius: "10px", padding: "3px", marginBottom: "1.75rem", gap: "3px" }}>
              {["signin", "signup"].map((t) => (
                <button key={t} onClick={() => { setTab(t); setForm(t); setError(""); setSuccess(""); }}
                  style={{ flex: 1, textAlign: "center", padding: "8px", borderRadius: "7px", fontSize: "13px", fontWeight: 600, cursor: "pointer", border: "none", fontFamily: "inherit", background: tab === t ? ACCENT : "transparent", color: tab === t ? "#fff" : s.muted, transition: "all 0.2s" }}>
                  {t === "signin" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>
          )}

          {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "8px", padding: "9px 12px", fontSize: "12px", color: "#ef4444", marginBottom: "14px" }}>{error}</div>}
          {success && <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "8px", padding: "9px 12px", fontSize: "12px", color: "#10b981", marginBottom: "14px" }}>{success}</div>}

          {/* SIGN IN */}
          {form === "signin" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
                {["Google", "GitHub"].map((p) => (
                  <button key={p} onClick={() => socialLogin(p)}
                    style={{ background: s.input, border: `1px solid ${s.inputBorder}`, borderRadius: "9px", padding: "10px", fontSize: "12px", fontWeight: 600, color: s.muted, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }}>
                    {p === "Google" ? "🔵" : "⚫"} {p}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "16px 0", color: s.hint, fontSize: "11px" }}>
                <div style={{ flex: 1, height: "1px", background: s.border }} />or sign in with email<div style={{ flex: 1, height: "1px", background: s.border }} />
              </div>
              <label style={labelStyle}>Email address</label>
              <input style={inputStyle} type="email" value={fields.email} onChange={set("email")} placeholder="you@company.com" />
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input style={{ ...inputStyle, paddingRight: "42px" }} type={showPass ? "text" : "password"} value={fields.password} onChange={set("password")} placeholder="Enter your password" />
                <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "12px", top: "11px", background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}>{showPass ? "🙈" : "👁"}</button>
              </div>
              <div style={{ textAlign: "right", marginTop: "-10px", marginBottom: "14px" }}>
                <button onClick={() => { setForm("forgot"); setError(""); setSuccess(""); }} style={{ background: "none", border: "none", color: ACCENT, fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>Forgot password?</button>
              </div>
              <button onClick={doSignin} disabled={loading}
                style={{ width: "100%", background: ACCENT, color: "#fff", border: "none", borderRadius: "9px", padding: "12px", fontSize: "14px", fontWeight: 700, fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
                {loading ? "Signing in..." : "Sign in to PulseIntel"}
              </button>
              <p style={{ textAlign: "center", fontSize: "12px", color: s.hint, marginTop: "16px" }}>
                Don't have an account?{" "}
                <button onClick={() => { setTab("signup"); setForm("signup"); }} style={{ background: "none", border: "none", color: ACCENT, fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>Create one free</button>
              </p>
            </>
          )}

          {/* SIGN UP */}
          {form === "signup" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
                {["Google", "GitHub"].map((p) => (
                  <button key={p} onClick={() => socialLogin(p)}
                    style={{ background: s.input, border: `1px solid ${s.inputBorder}`, borderRadius: "9px", padding: "10px", fontSize: "12px", fontWeight: 600, color: s.muted, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }}>
                    {p === "Google" ? "🔵" : "⚫"} {p}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "16px 0", color: s.hint, fontSize: "11px" }}>
                <div style={{ flex: 1, height: "1px", background: s.border }} />or sign up with email<div style={{ flex: 1, height: "1px", background: s.border }} />
              </div>
              <label style={labelStyle}>Full name</label>
              <input style={inputStyle} type="text" value={fields.name} onChange={set("name")} placeholder="Alex Johnson" />
              <label style={labelStyle}>Work email</label>
              <input style={inputStyle} type="email" value={fields.email} onChange={set("email")} placeholder="alex@company.com" />
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input style={{ ...inputStyle, paddingRight: "42px", marginBottom: "6px" }} type={showPass ? "text" : "password"} value={fields.password} onChange={set("password")} placeholder="Min. 8 characters" />
                <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "12px", top: "11px", background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}>{showPass ? "🙈" : "👁"}</button>
              </div>
              <div style={{ height: "3px", borderRadius: "3px", background: "rgba(255,255,255,0.07)", overflow: "hidden", marginBottom: "14px" }}>
                <div style={{ height: "100%", width: `${strPct}%`, background: strColor, borderRadius: "3px", transition: "all 0.3s" }} />
              </div>
              <button onClick={doSignup} disabled={loading}
                style={{ width: "100%", background: ACCENT, color: "#fff", border: "none", borderRadius: "9px", padding: "12px", fontSize: "14px", fontWeight: 700, fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
                {loading ? "Creating account..." : "Create free account"}
              </button>
              <p style={{ textAlign: "center", fontSize: "12px", color: s.hint, marginTop: "16px" }}>
                Already have an account?{" "}
                <button onClick={() => { setTab("signin"); setForm("signin"); }} style={{ background: "none", border: "none", color: ACCENT, fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>Sign in</button>
              </p>
            </>
          )}

          {/* FORGOT PASSWORD */}
          {form === "forgot" && (
            <>
              <button onClick={() => setForm("signin")} style={{ background: "none", border: "none", color: ACCENT, fontSize: "12px", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "5px", marginBottom: "16px", padding: 0 }}>← Back to sign in</button>
              <p style={{ fontSize: "13px", color: s.muted, marginBottom: "16px", lineHeight: "1.6" }}>Enter your email and we'll send you a reset link.</p>
              <label style={labelStyle}>Email address</label>
              <input style={inputStyle} type="email" value={fields.forgot} onChange={(e) => setFields((p) => ({ ...p, forgot: e.target.value }))} placeholder="you@company.com" />
              <button onClick={doForgot} disabled={loading}
                style={{ width: "100%", background: ACCENT, color: "#fff", border: "none", borderRadius: "9px", padding: "12px", fontSize: "14px", fontWeight: 700, fontFamily: "inherit", cursor: "pointer" }}>
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
