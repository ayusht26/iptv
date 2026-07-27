// Utility to map DLHD channel names & IDs to clean, high-res logos

// Known static logo map for popular sports & live TV networks
const STATIC_LOGO_MAP: Record<string, string> = {
  // Sports
  "espn": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/ESPN.us.png",
  "espn 2": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/ESPN2.us.png",
  "espn news": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/ESPNews.us.png",
  "espnu": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/ESPNU.us.png",
  "sec network": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/SECNetwork.us.png",
  "acc network": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/ACCNetwork.us.png",
  "fs1": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/FS1.us.png",
  "fox sports 1": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/FS1.us.png",
  "fs2": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/FS2.us.png",
  "fox sports 2": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/FS2.us.png",
  "nfl network": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/NFLNetwork.us.png",
  "nba tv": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/NBATV.us.png",
  "mlb network": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/MLBNetwork.us.png",
  "nhl network": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/NHLNetwork.us.png",
  "golf channel": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/GolfChannel.us.png",
  "tennis channel": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/TennisChannel.us.png",
  "tnt": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/TNT.us.png",
  "tbs": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/TBS.us.png",
  "tru tv": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/truTV.us.png",
  
  // Sky Sports UK
  "sky sports main event": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/SkySportsMainEvent.uk.png",
  "sky sports premier league": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/SkySportsPremierLeague.uk.png",
  "sky sports football": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/SkySportsFootball.uk.png",
  "sky sports cricket": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/SkySportsCricket.uk.png",
  "sky sports golf": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/SkySportsGolf.uk.png",
  "sky sports f1": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/SkySportsF1.uk.png",
  "sky sports action": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/SkySportsAction.uk.png",
  "sky sports arena": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/SkySportsArena.uk.png",
  "sky sports news": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/SkySportsNews.uk.png",
  "sky sports tennis": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/SkySportsTennis.uk.png",

  // TNT Sports UK
  "tnt sports 1": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/TNTSports1.uk.png",
  "tnt sports 2": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/TNTSports2.uk.png",
  "tnt sports 3": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/TNTSports3.uk.png",
  "tnt sports 4": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/TNTSports4.uk.png",

  // Eurosport
  "eurosport 1": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/Eurosport1.fr.png",
  "eurosport 2": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/Eurosport2.fr.png",

  // General USA Networks
  "abc usa": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/ABC.us.png",
  "cbs usa": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/CBS.us.png",
  "nbc usa": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/NBC.us.png",
  "fox usa": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/FOX.us.png",
  "cw usa": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/TheCW.us.png",
  "hbo usa": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/HBO.us.png",
  "cinemax usa": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/Cinemax.us.png",
  "showtime usa": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/Showtime.us.png",
  "starz usa": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/Starz.us.png",
  "amc usa": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/AMC.us.png",
  "fx usa": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/FX.us.png",
  "usa network": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/USANetwork.us.png",
  "cnn usa": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/CNN.us.png",
  "msnbc usa": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/MSNBC.us.png",
  "fox news": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/FOXNewsChannel.us.png",
  "bbc news": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/BBCNews.uk.png",
  "bbc one": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/BBCOne.uk.png",
  "bbc two": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/BBCTwo.uk.png",
  "cartoon network": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/CartoonNetwork.us.png",
  "nickelodeon": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/Nickelodeon.us.png",
  "disney channel": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/DisneyChannel.us.png",
  "national geographic": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/NationalGeographic.us.png",
  "discovery channel": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/DiscoveryChannel.us.png",
  "history channel": "https://raw.githubusercontent.com/iptv-org/database/master/data/logos/History.us.png",
};

export function getLogoForDLHDChannel(
  channelName: string,
  logoFromApi?: string | null,
  iptvLogoMap?: Map<string, string>
): string | null {
  if (logoFromApi && logoFromApi.trim().length > 0) {
    if (logoFromApi.startsWith("http")) return logoFromApi;
    return `https://dlhd.st/${logoFromApi.replace(/^\//, "")}`;
  }

  const norm = channelName.toLowerCase().trim();

  // Direct lookup
  if (STATIC_LOGO_MAP[norm]) {
    return STATIC_LOGO_MAP[norm];
  }

  // Partial match in static map
  for (const [key, url] of Object.entries(STATIC_LOGO_MAP)) {
    if (norm.includes(key) || key.includes(norm)) {
      return url;
    }
  }

  // Look in IPTV logo map if passed
  if (iptvLogoMap) {
    for (const [chId, url] of iptvLogoMap.entries()) {
      const cleanChId = chId.replace(/\.[a-z]{2}$/i, "").toLowerCase();
      if (norm.includes(cleanChId) || cleanChId.includes(norm)) {
        return url;
      }
    }
  }

  return null;
}
