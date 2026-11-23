import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  const rules = { allow: "/", disallow: ["/admin", "/p/", "/go/", "/api/"] };
  return {
    rules: [
      { userAgent: "*", ...rules },
      // Crawler delle AI: possono leggere la parte pubblica per citare il programma nelle risposte.
      ...["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Google-Extended", "Applebot-Extended"].map((userAgent) => ({ userAgent, ...rules })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
