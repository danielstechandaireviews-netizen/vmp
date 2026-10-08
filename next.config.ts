import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build the whole site as static files in out/. Every page is pre-rendered at
  // build time, so it can be served by any static host (Cloudflare Pages).
  // The hand-written homepage and partners page in public/ are copied into out/
  // as index.html and partners.html, so "/" serves the homepage directly.
  output: "export",
};

export default nextConfig;
