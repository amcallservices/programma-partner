/** Riconosce le richieste automatiche (anteprime dei link, motori di ricerca, strumenti da riga di comando). */
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|facebot|whatsapp|telegram|slack|discord|skype|linkedin|pinterest|embedly|quora|vkshare|bitly|curl|wget|python-requests|axios|node-fetch|go-http-client|headless|lighthouse|pingdom|uptime|monitor/i;

export function isBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return true; // le persone vere hanno sempre uno user agent
  return BOT.test(userAgent);
}
