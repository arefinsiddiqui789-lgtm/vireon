import type { NextConfig } from "next";

// Ensure NEXTAUTH_URL is always a valid URL — avoids "Invalid URL" at build
// time on Vercel when the variable is absent or empty.
const NEXTAUTH_URL =
  process.env.NEXTAUTH_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  env: {
    NEXTAUTH_URL,
  },
};

export default nextConfig;
