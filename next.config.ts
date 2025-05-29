const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pps.whatsapp.net',
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
