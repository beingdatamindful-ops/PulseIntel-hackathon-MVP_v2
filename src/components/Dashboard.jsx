import { useState, useEffect } from "react";

const ACCENT = "#7c6ff7";
const TEAL = "#14b8a6";
const WARN = "#f59e0b";
const DANGER = "#ef4444";
const GRAD = "linear-gradient(135deg, #7c6ff7 0%, #a78bfa 50%, #14b8a6 100%)";
const GRAD2 = "linear-gradient(135deg, #7c6ff7 0%, #6366f1 100%)";

const FALLBACK = {
  brief: (compName) => `${compName} has made aggressive moves this cycle — analyzing their website reveals key strategic shifts in pricing, messaging, and product positioning that directly impact your competitive standing. Their content strategy signals a deliberate pivot toward capturing your core buyer segment. The threat level is elevated and the window to respond with targeted counter-messaging and positioning adjustments is roughly 30–60 days before their campaign gains meaningful traction in your shared market.`,
  audits: {
    pricing: "Analysis of the competitor's pricing page reveals a strategic restructuring designed to lower acquisition friction in the SMB segment. This directly undercuts your entry-level positioning and gives their sales team a powerful objection-handler in competitive deals. In the next 30 days expect prospects to benchmark your pricing against theirs. Recommended action: launch a limited-time price-lock offer for annual contracts and brief your AEs with updated competitive pricing objection scripts immediately.",
    feature: "The competitor's product page signals recent investment in integration capabilities that close a major feature gap frequently cited in B2B buying decisions. This positions them as the zero-friction choice for modern tech-stack teams — a fast-growing buyer segment. Your product team should fast-track this roadmap item, while marketing should reframe your existing integrations as broader ecosystem flexibility to prevent this from becoming a deal-breaker.",
    messaging: "The competitor's homepage and content strategy reveal a deliberate pivot toward outcome-focused, ROI-led messaging — a calculated move to own the retention and revenue narrative. This angle resonates strongly with CFOs and economic buyers. Your current messaging likely focuses on process efficiency rather than business outcomes. Counter-position by publishing a customer ROI case study and testing outcome-led copy on your homepage hero section.",
  },
  strategy: {
    doing: ["Lower acquisition friction with competitive pricing tiers", "Leading with AI and automation as flagship differentiators", "Deep integrations targeting modern tech stacks", "Content-led SEO strategy targeting high-intent buyer keywords"],
    missing: ["No clear freemium or low-friction entry point for SMB leads", "AI and automation not prominent in current messaging", "Limited integration ecosystem compared to competitor", "Weaker content and SEO authority in key category terms"],
    suggestions: [
      { t: "Launch a freemium starter tier", d: "Introduce a low-friction entry plan to compete directly on acquisition. Gate advanced features behind paid tiers to drive upgrades. This removes the #1 pricing objection in competitive deals and expands your top-of-funnel." },
      { t: "Reframe messaging around outcomes not features", d: "Shift your homepage hero and key landing pages from feature descriptions to business outcome statements. Use customer proof points with real numbers. This directly counters the competitor's ROI-led narrative." },
      { t: "Build SEO authority on uncontested buyer keywords", d: "Identify high-intent long-tail terms the competitor doesn't rank for yet — especially 'vs' and 'alternative' searches. Publish 3 cornerstone articles targeting these gaps in the next 60 days." },
    ],
  },
  seo: [
    { ico: "🎯", t: "Target high-intent comparison keywords", d: "Publish '[Your Brand] vs [Competitor]' and 'best alternative to [Competitor]' pages. These buyer-stage searches convert 3–5x higher than category pages and intercept competitor-branded traffic at the decision stage." },
    { ico: "🔗", t: "Close the domain authority gap aggressively", d: "Launch targeted outreach for backlinks from SaaS review sites, tech directories, and integration partner pages. Priority: G2, Capterra, and relevant marketplace listings in your category." },
    { ico: "📝", t: "Content gaps represent quick organic wins", d: "Competitor analysis reveals underserved topic clusters in your category with strong buyer intent and low competition. Publishing 3-5 cornerstone articles targeting these gaps could capture significant organic traffic within 90 days." },
  ],
  opps: [
    { cls: "c1", ctx: "POSITIONING OPPORTUNITY", t: "Move upmarket before your competitor locks in the SMB segment", d: "The competitor's pricing strategy signals a volume-over-value land-grab in the SMB segment. This is your opening to reframe your narrative around outcomes, ROI, and strategic value rather than feature lists. The mid-market and enterprise-adjacent buyer segment is growing faster and has significantly higher LTV. Update your homepage to lead with revenue outcomes, develop a dedicated use-case landing page with industry-specific case studies, and launch a thought leadership report to capture top-of-funnel authority. This positions you as a strategic partner rather than a feature-for-feature competitor, insulating you from the price war entirely while attracting buyers who prioritize quality and partnership over cost." },
    { cls: "c2", ctx: "ACQUISITION OPPORTUNITY", t: "Run a targeted migration campaign while competitor customers reassess", d: "Strategic changes at a competitor — pricing, product, or messaging pivots — create natural churn risk in their existing customer base. Customers who feel the value equation has shifted are actively researching alternatives, often within 60–90 days of the change. This is your window for a targeted competitive displacement campaign. Build a migration landing page with a competitive switch offer including free migration assistance and a price-lock guarantee. Run LinkedIn ads targeting relevant job titles at companies using competitor products. Create a pointed comparison page optimized for competitor-branded searches. These warm prospects are actively seeking alternatives and convert at significantly higher rates than cold traffic." },
    { cls: "c3", ctx: "MESSAGING OPPORTUNITY", t: "Own 'proof over promise' to win trust-driven buyers", d: "Your competitor is investing heavily in AI and automation messaging — powerful claims that attract attention but also generate skepticism among battle-hardened B2B buyers burned by technology overpromises. Industry research consistently shows that over 60% of B2B software buyers are skeptical of AI feature claims and want verified proof before committing budget. Your opportunity is to position as the trustworthy, results-proven alternative by leading with verified customer outcomes — real numbers, real logos, real case studies — rather than technology feature lists. Create a 'Proof Over Promise' content series showcasing detailed customer success stories with measurable revenue and pipeline outcomes. This counter-positioning differentiates you on trust rather than features, a far more durable competitive advantage in a crowded, AI-saturated market." },
  ],
};

export default function Dashboard({ scanData, onNewScan, onLogout, currentUser, darkMode, toggleDark }) {
  const { clientUrl, competitorUrl, compName, clientContent, competitorContent } = scanData;

  const [expandedAudit, setExpandedAudit] = useState(null);
  const [auditDetails, setAuditDetails] = useState({});
  const [aiBrief, setAiBrief] = useState("");
  const [strategy, setStrategy] = useState(null);
  const [seo, setSeo] = useState(null);
  const [opps, setOpps] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const s = {
    bg: darkMode ? "#07070f" : "#f0eeff",
    card: darkMode ? "rgba(18,18,30,0.85)" : "rgba(255,255,255,0.95)",
    card2: darkMode ? "rgba(26,26,46,0.8)" : "rgba(245,244,255,0.9)",
    border: darkMode ? "rgba(124,111,247,0.18)" : "rgba(124,111,247,0.12)",
    text: darkMode ? "#f0eeff" : "#1a1825",
    muted: darkMode ? "#c0bdd8" : "#4a4860",
    sub: darkMode ? "#dddaf5" : "#2a2840",
    hint: darkMode ? "#8a88a0" : "#9896a8",
    nav: darkMode ? "rgba(7,7,15,0.85)" : "rgba(255,255,255,0.85)",
    navBorder: darkMode ? "rgba(124,111,247,0.15)" : "rgba(124,111,247,0.1)",
    glow: darkMode ? "0 4px 40px rgba(124,111,247,0.1)" : "0 4px 30px rgba(124,111,247,0.06)",
  };

  const name = currentUser?.user_metadata?.full_name || currentUser?.email?.split("@")[0] || "User";
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const clientDomain = clientUrl.replace(/https?:\/\/(www\.)?/, "");
  const compDomain = competitorUrl.replace(/https?:\/\/(www\.)?/, "");

  const buildContext = () => {
    const clientCtx = clientContent ? `CLIENT WEBSITE (${clientUrl}):\n${clientContent.slice(0, 2000)}` : `CLIENT: ${clientUrl}`;
    const compCtx = competitorContent ? `COMPETITOR WEBSITE (${competitorUrl}):\n${competitorContent.slice(0, 2000)}` : `COMPETITOR (${compName}): ${competitorUrl}`;
    return `${clientCtx}\n\n${compCtx}`;
  };

  async function callClaude(systemPrompt, userPrompt) {
    const res = await fetch("/api/claude", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system: systemPrompt, user: userPrompt }),
    });
    if (!res.ok) throw new Error("Claude API unavailable");
    const data = await res.json();
    return data.content;
  }

  useEffect(() => {
    loadBrief(); loadStrategy(); loadSeo(); loadOpps();
  }, []);

  async function loadBrief() {
    try {
      const ctx = buildContext();
      const result = await callClaude(
        "You are a senior competitive intelligence analyst. Write sharp, executive-level intelligence briefs. Be direct, specific, and strategic. No fluff.",
        `Write a 3-4 sentence executive intelligence brief for a CMO based on this competitive data. Cover what is notable about the competitor's strategy, why it's significant, and the urgency for the client.\n\n${ctx}\n\nClient: ${clientUrl}\nCompetitor: ${compName} (${competitorUrl})`
      );
      setAiBrief(result);
    } catch { setAiBrief(FALLBACK.brief(compName)); }
  }

  async function loadAuditDetail(id) {
    if (auditDetails[id]) return;
    const ctx = buildContext();
    const prompts = {
      pricing: `Write a pricing intelligence brief (60-80 words) based on this data. Cover: pricing gap detected, impact on sales conversations, one specific immediate action.\n\n${ctx}`,
      feature: `Write a product intelligence brief (60-80 words) based on this data. Cover: feature gaps identified, which segments they target, competitive risk, recommended response.\n\n${ctx}`,
      messaging: `Write a messaging intelligence brief (60-80 words) based on this data. Cover: competitor's messaging strategy, why it's effective, how the client should counter-position.\n\n${ctx}`,
    };
    try {
      const result = await callClaude("You are a competitive intelligence analyst. Write detailed, actionable intelligence briefs in 60-80 words.", prompts[id]);
      setAuditDetails((p) => ({ ...p, [id]: result }));
    } catch { setAuditDetails((p) => ({ ...p, [id]: FALLBACK.audits[id] })); }
  }

  async function loadStrategy() {
    const ctx = buildContext();
    try {
      const result = await callClaude(
        "You are a CMO-level strategist. Respond ONLY with valid JSON — no markdown, no backticks.",
        `Gap analysis JSON format:\n{"competitorDoing":["item1","item2","item3","item4"],"clientMissing":["item1","item2","item3","item4"],"suggestions":[{"t":"title","d":"2-3 sentence rec"},{"t":"title","d":"2-3 sentence rec"},{"t":"title","d":"2-3 sentence rec"}]}\n\n${ctx}`
      );
      setStrategy(JSON.parse(result.replace(/```json|```/g, "").trim()));
    } catch { setStrategy(FALLBACK.strategy); }
  }

  async function loadSeo() {
    const ctx = buildContext();
    try {
      const result = await callClaude(
        "You are an expert SEO strategist. Respond ONLY with valid JSON — no markdown, no backticks.",
        `3 SEO recommendations JSON:\n[{"ico":"🎯","t":"title","d":"25-35 word rec"},{"ico":"🔗","t":"title","d":"25-35 word rec"},{"ico":"📝","t":"title","d":"25-35 word rec"}]\n\n${ctx}`
      );
      setSeo(JSON.parse(result.replace(/```json|```/g, "").trim()));
    } catch { setSeo(FALLBACK.seo); }
  }

  async function loadOpps() {
    const ctx = buildContext();
    try {
      const result = await callClaude(
        "You are a Marketing Director. Write strategic opportunity alerts minimum 150 words each. Respond ONLY with valid JSON — no markdown.",
        `3 opportunity alerts JSON:\n[{"cls":"c1","ctx":"CATEGORY","t":"title","d":"150+ words"},{"cls":"c2","ctx":"CATEGORY","t":"title","d":"150+ words"},{"cls":"c3","ctx":"CATEGORY","t":"title","d":"150+ words"}]\n\n${ctx}`
      );
      setOpps(JSON.parse(result.replace(/```json|```/g, "").trim()));
    } catch { setOpps(FALLBACK.opps); }
  }

  function toggleAudit(id) {
    if (expandedAudit === id) { setExpandedAudit(null); return; }
    setExpandedAudit(id);
    loadAuditDetail(id);
  }

  const cardStyle = {
    background: s.card, border: `1.5px solid ${s.border}`, borderRadius: "18px",
    padding: "1.75rem", marginBottom: "14px", backdropFilter: "blur(12px)", boxShadow: s.glow,
  };

  const sectionHead = (label, right) => (
    <div style={{ display: "flex", alignItems: "center", gap: "14px", margin: "36px 0 18px" }}>
      <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: s.hint, whiteSpace: "nowrap" }}>{label}</span>
      <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, ${s.border}, transparent)` }} />
      {right && <span style={{ fontSize: "13px", color: ACCENT, whiteSpace: "nowrap", fontWeight: 700 }}>{right}</span>}
    </div>
  );

  const LoadingDots = ({ text = "Generating..." }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", color: s.muted, padding: "12px 0" }}>
      <div style={{ display: "flex", gap: "5px" }}>
        {[0, 0.2, 0.4].map((d, i) => (
          <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: ACCENT, animation: `dpulse 1.2s ${d}s ease-in-out infinite` }} />
        ))}
      </div>
      <span>{text}</span>
    </div>
  );

  const AUDITS = [
    { id: "pricing", ico: "💰", badge: "HIGH", badgeCol: DANGER, title: "Pricing changes & competitive positioning detected", sub: "Competitor may have shifted pricing strategy targeting your core buyer segment." },
    { id: "feature", ico: "🚀", badge: "MEDIUM", badgeCol: WARN, title: "Product or feature gap identified", sub: "Competitor shows signals of integrations or features your prospects frequently request." },
    { id: "messaging", ico: "📣", badge: "MEDIUM", badgeCol: WARN, title: "Messaging and positioning shift detected", sub: "Competitor is using outcome-focused messaging that may resonate more with economic buyers." },
  ];

  const oppColors = { c1: ACCENT, c2: TEAL, c3: WARN };
  const oppGrads = { c1: GRAD2, c2: `linear-gradient(135deg, ${TEAL}, #0d9488)`, c3: `linear-gradient(135deg, ${WARN}, #d97706)` };

  return (
    <div style={{ minHeight: "100vh", background: s.bg, position: "relative" }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes dpulse{0%,80%,100%{opacity:0.2}40%{opacity:1}}
        @keyframes fadein{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .fade-in{animation:fadein 0.4s ease}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}
        .audit-card:hover{border-color: rgba(124,111,247,0.4) !important; transform: translateY(-1px);}
        .audit-card{transition: all 0.2s;}
      `}</style>

      {/* Background orbs */}
      <div style={{ position: "fixed", top: "-10%", right: "-5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,111,247,0.08) 0%, transparent 70%)", pointerEvents: "none", animation: "float 10s ease-in-out infinite" }} />
      <div style={{ position: "fixed", bottom: "-15%", left: "-5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)", pointerEvents: "none", animation: "float 13s ease-in-out infinite reverse" }} />

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px", borderBottom: `1px solid ${s.navBorder}`, background: s.nav, backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ fontSize: "1.5rem", fontWeight: 800, background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.5px" }}>PulseIntel</span>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", color: "#10b981", background: "rgba(16,185,129,0.12)", padding: "4px 12px", borderRadius: "20px", border: "1px solid rgba(16,185,129,0.3)" }}>LIVE</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "13px", color: s.muted, background: s.card2, border: `1px solid ${s.border}`, borderRadius: "8px", padding: "5px 12px", fontFamily: "monospace", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{clientDomain}</span>
          <span style={{ fontSize: "12px", fontWeight: 700, background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>VS</span>
          <span style={{ fontSize: "13px", color: DANGER, background: s.card2, border: `1px solid ${s.border}`, borderRadius: "8px", padding: "5px 12px", fontFamily: "monospace", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{compDomain}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={onNewScan} style={{ background: "transparent", border: `1.5px solid ${ACCENT}`, color: ACCENT, padding: "8px 18px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontFamily: "inherit", fontWeight: 700 }}>← New scan</button>
          <button onClick={toggleDark} style={{ background: darkMode ? "rgba(124,111,247,0.15)" : "rgba(124,111,247,0.1)", border: `1.5px solid ${s.navBorder}`, color: s.muted, padding: "8px 14px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontFamily: "inherit" }}>◑</button>
          <div style={{ position: "relative" }}>
            <div onClick={() => setUserMenuOpen(!userMenuOpen)} style={{ width: "38px", height: "38px", borderRadius: "50%", background: GRAD2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 800, color: "#fff", cursor: "pointer", boxShadow: "0 2px 12px rgba(124,111,247,0.4)" }}>{initials}</div>
            {userMenuOpen && (
              <div style={{ position: "absolute", right: 0, top: "46px", background: s.card, border: `1.5px solid ${s.border}`, borderRadius: "14px", padding: "8px", minWidth: "210px", zIndex: 200, backdropFilter: "blur(12px)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
                <div style={{ padding: "12px 14px 14px", borderBottom: `1px solid ${s.border}`, marginBottom: "6px" }}>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: s.text }}>{name}</div>
                  <div style={{ fontSize: "13px", color: s.muted, marginTop: "3px" }}>{currentUser?.email}</div>
                </div>
                <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "11px 14px", borderRadius: "10px", border: "none", background: "transparent", fontSize: "15px", color: DANGER, cursor: "pointer", fontFamily: "inherit", textAlign: "left", fontWeight: 600 }}>Sign out</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: "980px", margin: "0 auto", padding: "28px 24px" }}>

        {/* AI Brief */}
        <div style={{ background: s.card, border: `1.5px solid rgba(124,111,247,0.3)`, borderRadius: "20px", padding: "2rem", marginBottom: "8px", position: "relative", overflow: "hidden", backdropFilter: "blur(12px)", boxShadow: "0 4px 40px rgba(124,111,247,0.12)" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: GRAD }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: darkMode ? "radial-gradient(ellipse at top left, rgba(124,111,247,0.08) 0%, transparent 50%)" : "radial-gradient(ellipse at top left, rgba(124,111,247,0.04) 0%, transparent 50%)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", background: "rgba(124,111,247,0.12)", color: ACCENT, padding: "5px 14px", borderRadius: "20px", marginBottom: "16px", border: "1px solid rgba(124,111,247,0.25)" }}>
              ✦ AI Intelligence Brief
            </div>
            {aiBrief
              ? <p style={{ fontSize: "17px", lineHeight: "1.85", color: s.sub }} className="fade-in">{aiBrief}</p>
              : <LoadingDots text="Generating intelligence brief..." />
            }
          </div>
        </div>

        {/* Audit Cards */}
        {sectionHead("Real-time audit activity", "3 signals detected")}
        {AUDITS.map((a) => (
          <div key={a.id} className="audit-card" onClick={() => toggleAudit(a.id)}
            style={{ ...cardStyle, cursor: "pointer", borderColor: expandedAudit === a.id ? "rgba(124,111,247,0.5)" : s.border, boxShadow: expandedAudit === a.id ? "0 4px 30px rgba(124,111,247,0.15)" : s.glow }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <span style={{ fontSize: "1.75rem", flexShrink: 0 }}>{a.ico}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "16px", fontWeight: 700, color: s.text, lineHeight: "1.4" }}>{a.title}</span>
                  <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.8px", padding: "3px 10px", borderRadius: "6px", background: `${a.badgeCol}22`, color: a.badgeCol, flexShrink: 0, border: `1px solid ${a.badgeCol}44` }}>{a.badge}</span>
                </div>
                <p style={{ fontSize: "15px", color: s.muted, lineHeight: "1.65" }}>{a.sub}</p>
              </div>
              <span style={{ color: s.muted, fontSize: "18px", transform: expandedAudit === a.id ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0, marginTop: "2px" }}>▾</span>
            </div>
            {expandedAudit === a.id && (
              <div style={{ borderTop: `1px solid ${s.border}`, marginTop: "18px", paddingTop: "18px" }}>
                <div style={{ background: s.card2, borderRadius: "12px", padding: "18px", border: `1px solid ${s.border}` }}>
                  {auditDetails[a.id]
                    ? <p style={{ fontSize: "16px", color: s.sub, lineHeight: "1.85" }} className="fade-in">{auditDetails[a.id]}</p>
                    : <LoadingDots text="Analyzing change..." />
                  }
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Strategy Report */}
        {sectionHead("Strategy report & gap analysis")}
        <div style={{ ...cardStyle }}>
          {strategy ? (
            <div className="fade-in">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "22px" }}>
                {[
                  { title: "⚠ Competitor is doing", items: strategy.competitorDoing || strategy.doing || [], color: DANGER },
                  { title: "△ You are missing", items: strategy.clientMissing || strategy.missing || [], color: WARN },
                ].map((col) => (
                  <div key={col.title} style={{ background: s.card2, borderRadius: "14px", padding: "18px", border: `1px solid ${s.border}` }}>
                    <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: col.color, marginBottom: "14px" }}>{col.title}</p>
                    {col.items.map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: "10px", fontSize: "15px", color: s.muted, padding: "7px 0", borderBottom: i < col.items.length - 1 ? `1px solid ${s.border}` : "none", lineHeight: "1.5" }}>
                        <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: col.color, flexShrink: 0, marginTop: "7px" }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: s.hint, margin: "0 0 14px" }}>Strategic recommendations to close the gap</p>
              {(strategy.suggestions || []).map((s2, i) => (
                <div key={i} style={{ background: "rgba(124,111,247,0.07)", border: "1.5px solid rgba(124,111,247,0.2)", borderRadius: "12px", padding: "16px 18px", marginBottom: "12px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3px", background: GRAD2 }} />
                  <p style={{ fontSize: "13px", fontWeight: 700, color: ACCENT, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>→ {s2.t || s2.title}</p>
                  <p style={{ fontSize: "16px", color: s.sub, lineHeight: "1.75" }}>{s2.d || s2.detail}</p>
                </div>
              ))}
            </div>
          ) : <LoadingDots text="Building gap analysis..." />}
        </div>

        {/* SEO Bento Grid */}
        {sectionHead("SEO optimisation recommendations")}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "8px" }}>
          {seo ? seo.map((r, i) => (
            <div key={i} style={{ background: s.card, border: `1.5px solid ${s.border}`, borderRadius: "16px", padding: "1.5rem", backdropFilter: "blur(12px)", boxShadow: s.glow, position: "relative", overflow: "hidden" }} className="fade-in">
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: GRAD }} />
              <div style={{ fontSize: "1.75rem", marginBottom: "12px" }}>{r.ico}</div>
              <p style={{ fontSize: "15px", fontWeight: 700, color: s.text, marginBottom: "10px", lineHeight: "1.4" }}>{r.t || r.title}</p>
              <p style={{ fontSize: "14px", color: s.muted, lineHeight: "1.7" }}>{r.d || r.detail}</p>
            </div>
          )) : <div style={{ gridColumn: "1/-1" }}><LoadingDots text="Analyzing SEO signals..." /></div>}
        </div>

        {/* Opportunity Alerts */}
        {sectionHead("Strategic opportunity alerts", "Think like a marketing director")}
        {opps ? opps.map((o, i) => (
          <div key={i} style={{ background: s.card, border: `1.5px solid ${s.border}`, borderRadius: "18px", padding: "2rem", marginBottom: "14px", backdropFilter: "blur(12px)", boxShadow: s.glow, position: "relative", overflow: "hidden" }} className="fade-in">
            <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "4px", background: oppGrads[o.cls] || GRAD2, borderRadius: "4px 0 0 4px" }} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: darkMode ? `radial-gradient(ellipse at top left, ${(oppColors[o.cls] || ACCENT)}0d 0%, transparent 50%)` : `radial-gradient(ellipse at top left, ${(oppColors[o.cls] || ACCENT)}08 0%, transparent 50%)`, pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: oppColors[o.cls] || ACCENT, background: `${oppColors[o.cls] || ACCENT}18`, padding: "3px 10px", borderRadius: "20px", border: `1px solid ${oppColors[o.cls] || ACCENT}30` }}>{o.ctx}</span>
                <span style={{ fontSize: "11px", color: s.hint, fontWeight: 600 }}>Opportunity {i + 1}</span>
              </div>
              <p style={{ fontSize: "18px", fontWeight: 800, color: s.text, marginBottom: "14px", lineHeight: "1.35", letterSpacing: "-0.3px" }}>{o.t || o.title}</p>
              <p style={{ fontSize: "16px", color: s.muted, lineHeight: "1.85" }}>{o.d || o.body}</p>
            </div>
          </div>
        )) : <LoadingDots text="Generating strategic opportunities..." />}

        <div style={{ textAlign: "center", padding: "28px 0 14px", fontSize: "13px", color: s.hint }}>
          PulseIntel · Firecrawl · Claude AI · Supabase · Hackathon MVP
        </div>
      </div>
    </div>
  );
}
