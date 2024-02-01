/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "*.desmog.com",
      },
      {
        hostname: "localhost:3001",
      },
      {
        hostname: "*.unfccc.int",
      },
      {
        hostname: "*.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
