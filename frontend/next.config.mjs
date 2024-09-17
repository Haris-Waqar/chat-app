/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["tailwindui.com"], // Add the allowed domain
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
