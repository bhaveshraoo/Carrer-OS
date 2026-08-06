import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Silence the multiple-lockfile Turbopack warning by explicitly setting root
  // to this project's directory, not the parent workspace directory.
  turbopack: {
    root: path.join(__dirname),
  },
  // pdf-parse (via pdfjs-dist) sets up a Worker internally for PDF processing.
  // Turbopack/webpack bundling breaks that setup in server code — it tries to load
  // a worker chunk file that never gets emitted at the path it expects, failing with
  // "Setting up fake worker failed: Cannot find module '.../pdf.worker.mjs'".
  // serverExternalPackages tells Next.js to leave these alone and let Node.js's own
  // require/import resolve them at runtime instead of bundling them — the documented
  // fix for this exact class of package (also needed for sharp, canvas, etc.).
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Permissions-Policy", value: "camera=(self), microphone=(self), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;
