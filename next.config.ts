/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://", "") || "",
      "res.cloudinary.com",
      "pbs.twimg.com",
    ],
  },
  async rewrites() {
    return [
      {
        source: "/:company",
        destination: "/[company]",
      },
    ];
  },
};

module.exports = nextConfig;
