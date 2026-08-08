/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This app is 100% client-side data (localStorage). No image domains needed
  // because every image used is a hand-drawn inline/public SVG.
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
