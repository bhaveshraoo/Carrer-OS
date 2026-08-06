/**
 * Strict location filter to ensure ONLY Indian tech jobs are accepted.
 */
export function isIndianLocation(locationStr: string): boolean {
  if (!locationStr) return false;
  const loc = locationStr.toLowerCase();

  // Exclude explicitly foreign location tags
  const foreignOnlyTags = [
    "us-",
    "us ",
    "usa",
    "united states",
    "uk-",
    "united kingdom",
    "canada",
    "germany",
    "france",
    "singapore",
    "australia",
    "japan",
    "brazil",
    "europe",
    "latam",
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
  ];

  return indianLocations.some((city) => loc.includes(city));
}
