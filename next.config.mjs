/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.s3.wasabisys.com",
      },
    ],
  },
};

export default nextConfig;
