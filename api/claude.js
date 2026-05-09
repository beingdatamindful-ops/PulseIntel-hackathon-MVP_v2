// api/claude.js — Vercel serverless function
// Proxies Claude API calls server-side so the API key is never exposed to the browser

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { system, user, maxTokens = 1000 } = req.body;

  if (!user) {
    return res.status(400).json({ error: "User prompt is required" });
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!ANTHROPIC_API_KEY) {
    return res.status(503).json({
      error: "Anthropic API key not configured",
      content: null,
    });
  }

  try {
    const body = {
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: user }],
    };

    if (system) {
      body.system = system;
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Anthropic API error: ${err}`);
    }

    const data = await response.json();
    const content = data?.content?.[0]?.text || "";

    return res.status(200).json({ content });
  } catch (error) {
    console.error("Claude API error:", error.message);
    return res.status(500).json({ error: error.message, content: null });
  }
}
