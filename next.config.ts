import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse (via pdfjs-dist) sets up a Worker internally for PDF processing.
  // Turbopack/webpack bundling breaks that setup in server code — it tries to load
  // a worker chunk file that never gets emitted at the path it expects, failing with
  // "Setting up fake worker failed: Cannot find module '.../pdf.worker.mjs'".
  // serverExternalPackages tells Next.js to leave these alone and let Node.js's own
  // require/import resolve them at runtime instead of bundling them — the documented
  // fix for this exact class of package (also needed for sharp, canvas, etc.).
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
};

export default nextConfig;
