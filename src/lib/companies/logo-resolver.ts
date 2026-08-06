/**
 * Real official high-resolution PNG brand logos for tech companies
 */
const REAL_BRAND_PNG_LOGOS: Record<string, string> = {
  google: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
  microsoft: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png",
  amazon: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/600px-Amazon_logo.svg.png",
  tcs: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/512px-Tata_Consultancy_Services_Logo.svg.png",
  infosys: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/600px-Infosys_logo.svg.png",
  accenture: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/512px-Accenture.svg.png",
  stripe: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/512px-Stripe_Logo%2C_revised_2016.svg.png",
  meesho: "https://upload.wikimedia.org/wikipedia/commons/8/80/Meesho_Logo.png",
  phonepe: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/512px-PhonePe_Logo.svg.png",
  postman: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Postman-logo.svg/512px-Postman-logo.svg.png",
  groww: "https://groww.in/favicon.ico",
  gitlab: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/GitLab_logo.svg/512px-GitLab_logo.svg.png",
  coinbase: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Coinbase-logo.svg/512px-Coinbase-logo.svg.png",
  roblox: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Roblox_player_icon_2022.svg/512px-Roblox_player_icon_2022.svg.png",
};

/**
 * Returns a real official brand PNG logo URL for any company
 */
export function getCompanyLogoUrl(companyName: string, companySlug?: string, providedUrl?: string | null): string {
  if (providedUrl && (providedUrl.startsWith("http://") || providedUrl.startsWith("https://"))) {
    return providedUrl;
  }

  const slug = (companySlug || companyName).toLowerCase().replace(/[^a-z0-9]/g, "");

  for (const [key, url] of Object.entries(REAL_BRAND_PNG_LOGOS)) {
    if (slug.includes(key)) {
      return url;
    }
  }

  // Real 128px high-res PNG favicon service from Google for all other corporate domains
  return `https://www.google.com/s2/favicons?domain=${slug}.com&sz=128`;
}
