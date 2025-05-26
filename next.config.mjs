/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: {
    buildActivity: false,
  },
  images: {
    domains: ['dash.grabpay.id'],
  },
  eslint: {
    ignoreDuringBuilds: true, // 🔧 Mematikan ESLint saat build
  },
};

export default nextConfig;
