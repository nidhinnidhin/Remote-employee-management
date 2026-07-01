const nextConfig = {
  output: "standalone",

  // Expose server-only env vars to middleware (Edge Runtime).
  // Middleware cannot read process.env from .env files at runtime directly,
  // so we forward the variable here so the proxy can reach the backend.
  env: {
    API_URL_INTERNAL: process.env.API_URL_INTERNAL || "http://backend:4000/api",
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

process.removeAllListeners("warning");

export default nextConfig;