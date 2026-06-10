import type { NextConfig } from "next";

// All site imagery now lives in /public/photos/ — no remote image hosts needed.
// If we add a CDN later (Cloudinary, Vercel Blob, etc.) re-introduce a
// remotePatterns entry scoped to that host only.
const nextConfig: NextConfig = {
  images: {},
};

export default nextConfig;
