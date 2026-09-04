/**
 * Location filter to accept Indian tech jobs as well as Global/Worldwide Remote roles.
 */
export function isIndianLocation(locationStr: string): boolean {
  if (!locationStr) return true;
  const loc = locationStr.toLowerCase().trim();

  // Exclude explicitly restricted foreign location tags (e.g. US Only, Europe Only)
  const foreignOnlyTags = [
    "us only",
    "usa only",
    "united states only",
    "uk only",
    "canada only",
    "germany only",
    "europe only",
    "latam only",
  ];

  const mentionsForeignOnly = foreignOnlyTags.some((tag) => loc.includes(tag));
  const mentionsIndiaExplicitly =
    loc.includes("india") ||
    loc.includes("bengaluru") ||
    loc.includes("bangalore") ||
    loc.includes("hyderabad") ||
    loc.includes("gurugram") ||
    loc.includes("noida") ||
    loc.includes("pune") ||
    loc.includes("mumbai") ||
    loc.includes("chennai") ||
    loc.includes("delhi");

  if (mentionsForeignOnly && !mentionsIndiaExplicitly) {
    return false;
  }

  // Explicit Indian cities and tags
  const indianLocations = [
    "india",
    "bengaluru",
    "bangalore",
    "hyderabad",
    "delhi",
    "ncr",
    "gurugram",
    "gurgaon",
    "noida",
    "mumbai",
    "pune",
    "chennai",
    "kolkata",
    "ahmedabad",
    "jaipur",
    "indore",
    "kochi",
    "in-bengaluru",
    "in-hyderabad",
    "in-mumbai",
    "in-gurugram",
    "in-delhi",
    "pan india",
    "remote (india)",
    "remote - india",
    "india (remote)",
    "worldwide",
    "remote",
    "anywhere",
    "global",
    "apac",
  ];

  return indianLocations.some((city) => loc.includes(city));
}
