require("dotenv").config({ path: "../../.env" });
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: true,
  },
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });

    return config;
  },
  images: {
    domains: ["avatars.githubusercontent.com", "images.unsplash.com", "localhost"],
  },
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: process.env.API_URL + "/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
