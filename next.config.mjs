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
    ignoreDuringBuilds: true,
  },
  basePath: '/cms',
};

export default nextConfig;
