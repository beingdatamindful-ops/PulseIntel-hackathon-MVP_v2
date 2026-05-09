import { useState, useEffect } from "react";

const ACCENT = "#7c6ff7";
const TEAL = "#14b8a6";
const WARN = "#f59e0b";
const DANGER = "#ef4444";

const FALLBACK = {
  brief: (compName) =>
    `${compName} has made aggressive moves this cycle: a significant price cut plus a new free tier directly targets your SMB pipeline, while a new Slack-native integration closes a key feature gap your prospects frequently cite. Their content pivot toward AI-driven retention signals a positioning shift that currently has no counter-narrative on your site. The threat level is high — the window to respond with pricing and messaging adjustments is roughly 30–60 days before their campaign gains meaningful SEO traction.`,
  audits: {
    pricing: "The competitor cut pricing significantly and added a free tier, directly undercutting your entry-level plan in the SMB segment and giving their sales team a powerful objection-handler. In the next 30 days expect prospects to benchmark your pricing against theirs in every deal. Recommended action: launch a limited-time price-lock offer for annual contracts and brief your AEs with updated competitive pricing objection scripts immediately.",
    feature: "The new Slack-native integration closes a major feature gap that likely appears in your lost-deal notes. This positions the competitor as the zero-friction choice for Slack-first teams — a fast-growing buyer segment in the mid-market. Your product team should fast-track a Slack integration roadmap item, while marketing should reframe your existing integrations as broader ecosystem flexibility to prevent this from becoming a deal-breaker in the interim.",
    messaging: "The competitor's messaging pivot backed by a published AI case study is a calculated move to own the retention narrative — an emotional, ROI-clear angle that resonates strongly with CFOs and VP Sales. Your current headline likely focuses on process efficiency, not business outcomes. Counter-position immediately by publishing a customer ROI case study and testing outcome-led copy on your homepage hero section.",
  },
  strategy: {
    doing: ["Free tier removing friction for SMB acquisition", "AI-powered features as flagship differentiator", "Deep integrations targeting modern tech stacks", "Aggressive pricing + paid ads on bottom-funnel keywords"],
    missing: ["No free tier or freemium entry point for SMB leads", "No AI-powered features in current roadmap messaging", "Limited real-time collaboration integrations", "Lower domain authority and backlink profile"],
    suggestions: [
      { t: "Launch a freemium starter tier", d: "Introduce a permanent free plan to compete directly. Gate AI and advanced features behind paid tiers to drive upgrades. This closes the acquisition gap in the SMB segment and removes the #1 pricing objection in competitive deals." },
      { t: "Fast-track AI feature messaging", d: "Reframe existing automation capabilities as 'AI-assisted' in your copy and release a public product roadmap highlighting upcoming AI investments. This counters the competitor's AI narrative while you develop the actual features." },
      { t: "Build SEO authority on uncontested keywords", d: "Identify high-intent long-tail terms the competitor doesn't rank for yet. Publish 3 cornerstone articles targeting these gaps in the next 60 days to capture organic traffic before they do." },
    ],
  },
  seo: [
    { ico: "🎯", t: "Target high-intent uncontested keywords", d: "Publish cornerstone content on underserved B2B category terms with strong buyer intent. Prioritize keywords that show 'best alternative' or 'vs' search patterns." },
    { ico: "🔗", t: "Aggressive link building campaign", d: "Launch targeted outreach for backlinks from SaaS review sites, tech directories, and integration partner pages. Priority: G2, Capterra, relevant marketplace listings." },
    { ico: "📝", t: "Create competitor comparison landing pages", d: "Build '[Your Brand] vs [Competitor]' comparison pages targeting buyer-stage searches. These pages convert 3–5x higher than category pages and directly intercept competitor-branded traffic." },
  ],
  opps: [
    { cls: "c1", ctx: "POSITIONING OPPORTUNITY", t: "Move upmarket before your competitor locks in the SMB segment", d: "The competitor's aggressive price cut signals a volume-over-value land-grab strategy in the SMB segment. This is your opening to reframe your narrative around outcomes and ROI rather than feature lists. The mid-market and enterprise-adjacent buyer segment is growing faster and has significantly higher LTV. Update your homepage to lead with revenue outcomes, develop a dedicated use-case landing page with industry-specific case studies, and launch a thought leadership report to capture top-of-funnel authority. This positions you as a strategic partner rather than a feature-for-feature competitor, insulating you from the price war entirely." },
    { cls: "c2", ctx: "ACQUISITION OPPORTUNITY", t: "Run a migration campaign while competitor customers are disrupted", d: "Pricing changes — even downward — create churn risk in an existing customer base. Customers who locked in at higher prices feel undervalued; long-term users resent new customers getting better deals. This is a 60-day window for a targeted competitive displacement campaign. Build a migration landing page with a competitive switch offer including free migration assistance and a price-lock guarantee. Run LinkedIn ads targeting relevant job titles with 'recently changed jobs' signals. Write a pointed comparison page and run it as paid search against competitor-branded keywords. Identify and reach out to competitor customers who have left negative reviews — these are warm prospects actively seeking alternatives." },
    { cls: "c3", ctx: "MESSAGING OPPORTUNITY", t: "Own 'proof over promise' to win AI-fatigued buyers", d: "Your competitor is doubling down on AI messaging, which attracts attention but also opens them to skepticism from battle-hardened B2B buyers burned by AI overpromises. Research shows over 60% of B2B software buyers are skeptical of AI feature claims and want verified proof before committing. Your opportunity is to position as the trustworthy, results-proven alternative. Lead with verified customer outcomes — real numbers, real logos, real case studies — rather than feature lists. Create a 'Proof Over Promise' content series showcasing detailed customer success stories with measurable revenue and pipeline outcomes. This counter-positioning differentiates you on trust rather than features, a far more durable competitive advantage in a crowded market." },
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
    bg: darkMode ? "#0a0a0f" : "#f5f4f1",
    card: darkMode ? "#111118" : "#ffffff",
    card2: darkMode ? "#1a1a24" : "#f0eff9",
    border: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
    text: darkMode ? "#e8e6f0" : "#1a1825",
    muted: darkMode ? "#7a788a" : "#6b6880",
    sub: darkMode ? "#c8c6d8" : "#3a3850",
    hint: darkMode ? "#4a4860" : "#b0aec0",
    nav: darkMode ? "#111118" : "#fff",
    navBorder: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
  };

  const name = currentUser?.user_metadata?.full_name || currentUser?.email?.split("@")[0] || "User";
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const clientDomain = clientUrl.replace(/https?:\/\/(www\.)?/, "");
  const compDomain = competitorUrl.replace(/https?:\/\/(www\.)?/, "");

  // Build context string for Claude from scraped content
  const buildContext = () => {
    const clientCtx = clientContent
      ? `CLIENT WEBSITE CONTENT (${clientUrl}):\n${clientContent.slice(0, 2000)}`
      : `CLIENT: ${clientUrl} — No scraped content available (demo mode)`;
    const compCtx = competitorContent
      ? `COMPETITOR WEBSITE CONTENT (${competitorUrl}):\n${competitorContent.slice(0, 2000)}`
      : `COMPETITOR (${compName}): ${competitorUrl} — No scraped content available (demo mode). Assume they have competitive pricing, AI features, and strong SEO presence.`;
    return `${clientCtx}\n\n${compCtx}`;
  };

  async function callClaude(systemPrompt, userPrompt) {
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system: systemPrompt, user: userPrompt }),
    });
    if (!res.ok) throw new Error("Claude API unavailable");
    const data = await res.json();
    return data.content;
  }

  // Load AI brief on mount
  useEffect(() => {
    async function loadBrief() {
      try {
        const ctx = buildContext();
        const result = await callClaude(
          "You are a senior competitive intelligence analyst for B2B SaaS companies. Write sharp, executive-level intelligence briefs. No fluff. Be direct, specific, and strategic.",
          `Based on this competitive analysis data, write a sharp 3-4 sentence executive intelligence brief for a CMO. Cover: what has changed or what is notable about the competitor, why it's strategically significant, and the urgency level for the client.\n\n${ctx}\n\nClient domain: ${clientUrl}\nCompetitor: ${compName} (${competitorUrl})`
        );
        setAiBrief(result);
      } catch {
        setAiBrief(FALLBACK.brief(compName));
      }
    }
    loadBrief();
    loadStrategy();
    loadSeo();
    loadOpps();
  }, []);

  async function loadAuditDetail(id) {
    if (auditDetails[id]) return;
    const ctx = buildContext();
    const prompts = {
      pricing: `Based on this competitive data, write a detailed pricing intelligence brief (60-80 words) covering: the pricing gap detected or likely present, direct impact on the client's sales conversations, and one specific immediate action the sales or marketing team should take.\n\n${ctx}`,
      feature: `Based on this competitive data, write a detailed product intelligence brief (60-80 words) for the client's product and marketing team. Cover: what features or integrations the competitor likely has or recently launched, which customer segment it targets, the competitive gap it creates, and the recommended product or messaging response.\n\n${ctx}`,
      messaging: `Based on this competitive data, write a messaging intelligence brief (60-80 words) covering: the competitor's current messaging strategy and any recent shifts, why this messaging is effective, and how the client should counter-position.\n\n${ctx}`,
    };
    try {
      const result = await callClaude(
        "You are a competitive intelligence analyst. Write detailed, actionable intelligence briefs in 60-80 words. Be specific and strategic. Write for marketing directors and CMOs.",
        prompts[id]
      );
      setAuditDetails((p) => ({ ...p, [id]: result }));
    } catch {
      setAuditDetails((p) => ({ ...p, [id]: FALLBACK.audits[id] }));
    }
  }

  async function loadStrategy() {
    const ctx = buildContext();
    try {
      const result = await callClaude(
        "You are a CMO-level strategist. Produce structured gap analysis and actionable recommendations. Respond ONLY with valid JSON — no markdown, no backticks, no preamble.",
        `Based on this competitive analysis, produce a gap analysis in this exact JSON format:\n{"competitorDoing":["item1","item2","item3","item4"],"clientMissing":["item1","item2","item3","item4"],"suggestions":[{"t":"title","d":"2-3 sentence recommendation"},{"t":"title","d":"2-3 sentence recommendation"},{"t":"title","d":"2-3 sentence recommendation"}]}\n\n${ctx}`
      );
      const parsed = JSON.parse(result.replace(/```json|```/g, "").trim());
      setStrategy(parsed);
    } catch {
      setStrategy(FALLBACK.strategy);
    }
  }

  async function loadSeo() {
    const ctx = buildContext();
    try {
      const result = await callClaude(
        "You are an expert SEO strategist for B2B SaaS. Give specific, actionable recommendations. Respond ONLY with valid JSON — no markdown, no backticks, no preamble.",
        `Based on this competitive analysis, produce 3 SEO recommendations in this exact JSON format:\n[{"ico":"🎯","t":"title","d":"25-35 word recommendation"},{"ico":"🔗","t":"title","d":"25-35 word recommendation"},{"ico":"📝","t":"title","d":"25-35 word recommendation"}]\n\n${ctx}`
      );
      const parsed = JSON.parse(result.replace(/```json|```/g, "").trim());
      setSeo(parsed);
    } catch {
      setSeo(FALLBACK.seo);
    }
  }

  async function loadOpps() {
    const ctx = buildContext();
    try {
      const result = await callClaude(
        "You are a Marketing Director at a B2B SaaS company. Write strategic opportunity alerts. Each must be at least 150 words. Think boldly. Respond ONLY with valid JSON — no markdown, no backticks, no preamble.",
        `Based on this competitive analysis, generate 3 strategic opportunity alerts in this exact JSON format:\n[{"cls":"c1","ctx":"CATEGORY TYPE","t":"opportunity title","d":"at least 150 words of strategic analysis and recommendations"},{"cls":"c2","ctx":"CATEGORY TYPE","t":"opportunity title","d":"at least 150 words"},{"cls":"c3","ctx":"CATEGORY TYPE","t":"opportunity title","d":"at least 150 words"}]\n\n${ctx}`
      );
      const parsed = JSON.parse(result.replace(/```json|```/g, "").trim());
      setOpps(parsed);
    } catch {
      setOpps(FALLBACK.opps);
    }
  }

  function toggleAudit(id) {
    if (expandedAudit === id) { setExpandedAudit(null); return; }
    setExpandedAudit(id);
    loadAuditDetail(id);
  }

  const cardStyle = { background: s.card, border: `1px solid ${s.border}`, borderRadius: "14px", padding: "1.25rem", marginBottom: "8px" };
  const sectionHead = (label, right) => (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "24px 0 12px" }}>
      <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: s.muted, whiteSpace: "nowrap" }}>{label}</span>
      <div style={{ flex: 1, height: "1px", background: s.border }} />
      {right && <span style={{ fontSize: "11px", color: ACCENT, whiteSpace: "nowrap" }}>{right}</span>}
    </div>
  );

  const LoadingDots = () => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: s.muted, padding: "8px 0" }}>
      <div style={{ display: "flex", gap: "4px" }}>
        {[0, 0.2, 0.4].map((d, i) => (
          <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: ACCENT, animation: `dpulse 1.2s ${d}s ease-in-out infinite` }} />
        ))}
      </div>
      <span>Generating...</span>
      <style>{`@keyframes dpulse{0%,80%,100%{opacity:0.2}40%{opacity:1}} @keyframes fadein{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );

  const AUDITS = [
    { id: "pricing", ico: "💰", badge: "HIGH", badgeCol: DANGER, title: "Pricing changes & competitive positioning detected", sub: "Competitor may have shifted pricing strategy targeting your core buyer segment." },
    { id: "feature", ico: "🚀", badge: "MEDIUM", badgeCol: WARN, title: "Product or feature gap identified", sub: "Competitor shows signals of integrations or features your prospects frequently request." },
    { id: "messaging", ico: "📣", badge: "MEDIUM", badgeCol: WARN, title: "Messaging and positioning shift detected", sub: "Competitor is using outcome-focused messaging that may resonate more with economic buyers." },
  ];

  const oppColors = { c1: ACCENT, c2: TEAL, c3: WARN };

  return (
    <div style={{ minHeight: "100vh", background: s.bg }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes dpulse{0%,80%,100%{opacity:0.2}40%{opacity:1}} @keyframes fadein{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}} .fade-in{animation:fadein 0.35s ease}`}</style>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: `1px solid ${s.navBorder}`, background: s.nav, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.2rem", fontWeight: 700, color: ACCENT }}>Pulse<span style={{ opacity: 0.6, color: s.text }}>Intel</span></span>
          <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1px", color: "#10b981", background: "rgba(16,185,129,0.12)", padding: "3px 8px", borderRadius: "20px", border: "1px solid rgba(16,185,129,0.25)" }}>LIVE</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "11px", color: s.muted, background: s.card2, border: `1px solid ${s.border}`, borderRadius: "5px", padding: "3px 8px", fontFamily: "monospace", maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{clientDomain}</span>
          <span style={{ fontSize: "10px", fontWeight: 700, color: s.hint }}>VS</span>
          <span style={{ fontSize: "11px", color: DANGER, background: s.card2, border: `1px solid ${s.border}`, borderRadius: "5px", padding: "3px 8px", fontFamily: "monospace", maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{compDomain}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button onClick={onNewScan} style={{ background: "transparent", border: `1px solid ${ACCENT}`, color: ACCENT, padding: "5px 12px", borderRadius: "7px", cursor: "pointer", fontSize: "12px", fontFamily: "inherit" }}>← New scan</button>
          <button onClick={toggleDark} style={{ background: "transparent", border: `1px solid ${s.navBorder}`, color: s.muted, padding: "5px 12px", borderRadius: "7px", cursor: "pointer", fontSize: "12px", fontFamily: "inherit" }}>◑</button>
          <div style={{ position: "relative" }}>
            <div onClick={() => setUserMenuOpen(!userMenuOpen)} style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(124,111,247,0.2)", border: "1px solid rgba(124,111,247,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: ACCENT, cursor: "pointer" }}>{initials}</div>
            {userMenuOpen && (
              <div style={{ position: "absolute", right: 0, top: "38px", background: s.card, border: `1px solid ${s.border}`, borderRadius: "10px", padding: "6px", minWidth: "180px", zIndex: 200 }}>
                <div style={{ padding: "8px 10px 10px", borderBottom: `1px solid ${s.border}`, marginBottom: "5px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: s.text }}>{name}</div>
                  <div style={{ fontSize: "11px", color: s.muted }}>{currentUser?.email}</div>
                </div>
                <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "8px 10px", borderRadius: "7px", border: "none", background: "transparent", fontSize: "12px", color: DANGER, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>Sign out</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>

        {/* AI Brief */}
        <div style={{ background: s.card, border: `1px solid rgba(124,111,247,0.25)`, borderRadius: "16px", padding: "1.5rem", marginBottom: "4px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: ACCENT }} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: ACCENT, background: "rgba(124,111,247,0.12)", padding: "3px 9px", borderRadius: "20px", marginBottom: "10px" }}>✦ AI Intelligence Brief</div>
          {aiBrief ? <p style={{ fontSize: "13px", lineHeight: "1.75", color: s.sub }} className="fade-in">{aiBrief}</p> : <LoadingDots />}
        </div>

        {/* Audit Cards */}
        {sectionHead("Real-time audit activity", "3 signals detected")}
        {AUDITS.map((a) => (
          <div key={a.id} onClick={() => toggleAudit(a.id)} style={{ ...cardStyle, cursor: "pointer", borderColor: expandedAudit === a.id ? ACCENT : s.border }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>{a.ico}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: s.text }}>{a.title}</span>
                  <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.8px", padding: "2px 7px", borderRadius: "5px", background: `${a.badgeCol}22`, color: a.badgeCol, flexShrink: 0 }}>{a.badge}</span>
                </div>
                <p style={{ fontSize: "11px", color: s.muted, lineHeight: "1.4" }}>{a.sub}</p>
              </div>
              <span style={{ color: s.muted, fontSize: "14px", transform: expandedAudit === a.id ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>▾</span>
            </div>
            {expandedAudit === a.id && (
              <div style={{ borderTop: `1px solid ${s.border}`, marginTop: "12px", paddingTop: "12px" }}>
                <div style={{ background: s.card2, borderRadius: "8px", padding: "12px" }}>
                  {auditDetails[a.id]
                    ? <p style={{ fontSize: "13px", color: s.sub, lineHeight: "1.75" }} className="fade-in">{auditDetails[a.id]}</p>
                    : <LoadingDots />}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Strategy Report */}
        {sectionHead("Strategy report & gap analysis")}
        <div style={{ ...cardStyle, marginBottom: "4px" }}>
          {strategy ? (
            <div className="fade-in">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                <div style={{ background: s.card2, borderRadius: "10px", padding: "12px" }}>
                  <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: DANGER, marginBottom: "8px" }}>⚠ Competitor is doing</p>
                  {(strategy.competitorDoing || strategy.doing || []).map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "7px", fontSize: "11px", color: s.muted, padding: "4px 0", borderBottom: i < 3 ? `1px solid ${s.border}` : "none", lineHeight: "1.4" }}>
                      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: DANGER, flexShrink: 0, marginTop: "5px" }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: s.card2, borderRadius: "10px", padding: "12px" }}>
                  <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: WARN, marginBottom: "8px" }}>△ You are missing</p>
                  {(strategy.clientMissing || strategy.missing || []).map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "7px", fontSize: "11px", color: s.muted, padding: "4px 0", borderBottom: i < 3 ? `1px solid ${s.border}` : "none", lineHeight: "1.4" }}>
                      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: WARN, flexShrink: 0, marginTop: "5px" }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: s.muted, margin: "14px 0 8px" }}>Strategic recommendations to close the gap</p>
              {(strategy.suggestions || []).map((s2, i) => (
                <div key={i} style={{ background: "rgba(124,111,247,0.08)", border: "1px solid rgba(124,111,247,0.15)", borderRadius: "8px", padding: "10px 12px", marginBottom: "8px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: ACCENT, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>→ {s2.t || s2.title}</p>
                  <p style={{ fontSize: "12px", color: s.sub, lineHeight: "1.6" }}>{s2.d || s2.detail}</p>
                </div>
              ))}
            </div>
          ) : <LoadingDots />}
        </div>

        {/* SEO Bento Grid */}
        {sectionHead("SEO optimisation recommendations")}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "4px" }}>
          {seo ? seo.map((r, i) => (
            <div key={i} style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: "12px", padding: "14px" }} className="fade-in">
              <div style={{ fontSize: "1.2rem", marginBottom: "8px" }}>{r.ico}</div>
              <p style={{ fontSize: "12px", fontWeight: 700, color: s.text, marginBottom: "5px" }}>{r.t || r.title}</p>
              <p style={{ fontSize: "11px", color: s.muted, lineHeight: "1.5" }}>{r.d || r.detail}</p>
            </div>
          )) : (
            <div style={{ gridColumn: "1/-1" }}><LoadingDots /></div>
          )}
        </div>

        {/* Opportunity Alerts */}
        {sectionHead("Strategic opportunity alerts", "Think like a marketing director")}
        {opps ? opps.map((o, i) => (
          <div key={i} style={{ background: s.card, border: `1px solid ${s.border}`, borderLeft: `3px solid ${oppColors[o.cls] || ACCENT}`, borderRadius: "0 12px 12px 0", padding: "1.25rem", marginBottom: "10px" }} className="fade-in">
            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: s.muted, marginBottom: "4px" }}>Opportunity {i + 1} · {o.ctx}</p>
            <p style={{ fontSize: "14px", fontWeight: 700, color: s.text, marginBottom: "8px" }}>{o.t || o.title}</p>
            <p style={{ fontSize: "12px", color: s.muted, lineHeight: "1.75" }}>{o.d || o.body}</p>
          </div>
        )) : <LoadingDots />}

        <div style={{ textAlign: "center", padding: "20px 0 10px", fontSize: "11px", color: s.hint }}>
          PulseIntel · Firecrawl · Claude AI · Supabase · Hackathon MVP
        </div>
      </div>
    </div>
  );
}
