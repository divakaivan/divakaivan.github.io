/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // Use NEXT_PUBLIC_BASE_PATH env var so local dev works without a prefix
  // and GitHub Pages works with /terminal-cv
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  images: {
    // next/image optimisation is not available with static export
    unoptimized: true,
  },
};

export default nextConfig;
