import type { NextConfig } from "next";
import { trustedRemoteImageHosts } from "./lib/images";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: trustedRemoteImageHosts.map((hostname) => ({
      protocol: "https",
      hostname,
      pathname: "/**",
    })),
  },
};

export default nextConfig;
