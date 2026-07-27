import { Channel } from "./types";

// Explicit priority channels requested by user get maximum score boost
const SPECIFIC_PRIORITY_PATTERNS: { pattern: RegExp; score: number }[] = [
  { pattern: /\bwillow(\s*cricket)?\b/i, score: 5000 },
  { pattern: /\bfox\s*cricket\b/i, score: 5000 },
  { pattern: /\bespn\s*caribbean\b/i, score: 5000 },
  { pattern: /\bsky\s*sports?\s*cricket\b/i, score: 5000 },
  { pattern: /\bsky\s*sports?\s*football\b/i, score: 5000 },
  { pattern: /\bsky\s*sports?\s*f1\b/i, score: 5000 },
  { pattern: /\bsony\s*(ten|sports)?\s*1\b/i, score: 4800 },
  { pattern: /\bsony\s*(ten|sports)?\s*2\b/i, score: 4800 },
];

// Tier-1 globally popular network keywords with weights
const GENERAL_POPULAR_KEYWORDS: { pattern: RegExp; score: number }[] = [
  // Major Sports
  { pattern: /\bespn\b/i, score: 1000 },
  { pattern: /\bsky sports\b/i, score: 950 },
  { pattern: /\btnt sports\b/i, score: 920 },
  { pattern: /\bbein sports?\b/i, score: 900 },
  { pattern: /\bstar sports?\b/i, score: 880 },
  { pattern: /\bfox sports?\b/i, score: 850 },
  { pattern: /\beurosport\b/i, score: 850 },
  { pattern: /\bdazn\b/i, score: 850 },
  { pattern: /\bastro supersport\b/i, score: 820 },
  { pattern: /\bnba tv\b/i, score: 800 },
  { pattern: /\bnfl network\b/i, score: 800 },
  { pattern: /\bcbs sports\b/i, score: 800 },
  { pattern: /\bnbc sports\b/i, score: 800 },

  // Major News & Global Networks
  { pattern: /\bbbc news\b|\bbbc world\b/i, score: 850 },
  { pattern: /\bcnn\b/i, score: 850 },
  { pattern: /\bfox news\b/i, score: 800 },
  { pattern: /\bmsnbc\b/i, score: 750 },

  // Major Movies & Premium Entertainment
  { pattern: /\bhbo\b/i, score: 900 },
  { pattern: /\bcinemax\b/i, score: 820 },
  { pattern: /\bshowtime\b/i, score: 820 },
  { pattern: /\bstarz\b/i, score: 800 },
];

export function getPopularChannels(channels: Channel[], limit: number = 12): Channel[] {
  if (!channels || channels.length === 0) return [];

  const scored = channels.map((ch) => {
    let score = 0;
    const name = ch.name;

    // 1. Check specific priority patterns requested by user
    for (const item of SPECIFIC_PRIORITY_PATTERNS) {
      if (item.pattern.test(name)) {
        score += item.score;
        break;
      }
    }

    // 2. Check general popular keywords
    if (score === 0) {
      for (const item of GENERAL_POPULAR_KEYWORDS) {
        if (item.pattern.test(name)) {
          score += item.score;
          break;
        }
      }
    }

    // Has DLHD streams (+250)
    if (ch.hasDlhd) {
      score += 250;
    }

    // Has logo (+150)
    if (ch.logo) {
      score += 150;
    }

    // Multi-server bonus (+30 per server)
    if (ch.servers && ch.servers.length > 0) {
      score += Math.min(ch.servers.length * 30, 180);
    }

    return { channel: ch, score };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Preserve unique channel identities (keep specific sports variants like Sky Sports Cricket vs Football vs F1)
  const result: Channel[] = [];
  const seenKeys = new Set<string>();

  for (const item of scored) {
    const rawName = item.channel.name.toLowerCase();
    // Unique key keeps specific channel names distinct
    const keyToUse = rawName
      .replace(/\b(hd|sd|fhd|uhd|4k|us|uk|ca|au|in|live|stream|feed)\b/g, "")
      .replace(/[^a-z0-9]/g, "")
      .trim();

    const uniqueId = keyToUse || rawName;

    if (!seenKeys.has(uniqueId)) {
      seenKeys.add(uniqueId);
      result.push(item.channel);
    }

    if (result.length >= limit) break;
  }

  // Fill up if limit not met
  if (result.length < limit) {
    for (const item of scored) {
      if (!result.includes(item.channel)) {
        result.push(item.channel);
        if (result.length >= limit) break;
      }
    }
  }

  return result;
}
