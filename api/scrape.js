// api/scrape.js — Vercel serverless function
// Calls Firecrawl to scrape a URL and returns clean markdown content

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;

  if (!FIRECRAWL_API_KEY) {
    // Demo mode — return placeholder content
    return res.status(200).json({
      content: `Demo mode: No Firecrawl API key configured. URL attempted: ${url}`,
      url,
    });
  }

  try {
    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        url,
        formats: ["markdown"],
        onlyMainContent: true,
        waitFor: 2000,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Firecrawl error: ${err}`);
    }

    const data = await response.json();
    const content = data?.data?.markdown || data?.markdown || "";

    return res.status(200).json({ content, url });
  } catch (error) {
    console.error("Scrape error:", error.message);
    return res.status(500).json({
      error: error.message,
      content: `Failed to scrape ${url}. Running in demo mode.`,
      url,
    });
  }
}
