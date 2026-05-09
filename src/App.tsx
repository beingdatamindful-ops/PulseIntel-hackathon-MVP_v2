import { useState, useEffect } from "react";
import Login from "./components/Login";
import Setup from "./components/Setup";
import Scanning from "./components/Scanning";
import Dashboard from "./components/Dashboard";
import { supabase } from "./lib/supabase";

export default function App() {
  const [screen, setScreen] = useState("login"); // login | setup | scanning | dashboard
  const [darkMode, setDarkMode] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [scanData, setScanData] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLabel, setScanLabel] = useState("");

  // Check for existing Supabase session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
        setScreen("setup")
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
      } else {
        setCurrentUser(null);
        setScreen("login");
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setScreen("setup");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setScanData(null);
    setScreen("login");
  };

  const handleScan = async (clientUrl, competitorUrl) => {
    setScreen("scanning");
    setScanProgress(0);

    const steps = [
      [10, "Initializing Firecrawl scraper..."],
      [22, "Crawling your company website..."],
      [38, "Crawling competitor website..."],
      [52, "Extracting pricing & messaging signals..."],
      [65, "Running semantic diff analysis..."],
      [78, "Generating AI intelligence brief..."],
      [90, "Building strategic report..."],
      [100, "Intelligence ready."],
    ];

    for (const [pct, label] of steps) {
      await delay(600);
      setScanProgress(pct);
      setScanLabel(label);
    }

    await delay(400);

    // Scrape both URLs via Firecrawl (server-side API route)
    let clientContent = "";
    let competitorContent = "";

    try {
      const [clientRes, compRes] = await Promise.all([
        fetch("/api/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: clientUrl }),
        }),
        fetch("/api/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: competitorUrl }),
        }),
      ]);

      if (clientRes.ok) clientContent = (await clientRes.json()).content;
      if (compRes.ok) competitorContent = (await compRes.json()).content;
    } catch (err) {
      console.warn("Scrape API unavailable, using demo mode:", err.message);
    }

    const compName =
      competitorUrl
        .replace(/https?:\/\/(www\.)?/, "")
        .split(".")[0]
        .replace(/^./, (c) => c.toUpperCase()) + " Corp";

    setScanData({ clientUrl, competitorUrl, compName, clientContent, competitorContent });

    // Save scan to Supabase
    try {
      await supabase.from("scans").insert({
        user_id: currentUser?.id,
        client_url: clientUrl,
        competitor_url: competitorUrl,
        comp_name: compName,
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn("Supabase save skipped:", err.message);
    }

    setScreen("dashboard");
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-[#0a0a0f] text-[#e8e6f0] font-sans transition-colors duration-300 dark:bg-[#0a0a0f] dark:text-[#e8e6f0]"
        style={{ background: darkMode ? "#0a0a0f" : "#f5f4f1", color: darkMode ? "#e8e6f0" : "#1a1825" }}>

        {screen === "login" && (
          <Login onLogin={handleLogin} darkMode={darkMode} toggleDark={() => setDarkMode(!darkMode)} />
        )}

        {screen === "setup" && (
          <Setup
            onScan={handleScan}
            onLogout={handleLogout}
            currentUser={currentUser}
            darkMode={darkMode}
            toggleDark={() => setDarkMode(!darkMode)}
          />
        )}

        {screen === "scanning" && (
          <Scanning progress={scanProgress} label={scanLabel} darkMode={darkMode} />
        )}

        {screen === "dashboard" && scanData && (
          <Dashboard
            scanData={scanData}
            onNewScan={() => setScreen("setup")}
            onLogout={handleLogout}
            currentUser={currentUser}
            darkMode={darkMode}
            toggleDark={() => setDarkMode(!darkMode)}
          />
        )}
      </div>
    </div>
  );
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
