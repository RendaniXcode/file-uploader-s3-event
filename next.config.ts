/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true, // Keep Strict Mode enabled for better debugging
  swcMinify: true, // Enable SWC-based minification for better performance

  // Environmental variables for S3 configuration
  env: {
    NEXT_PUBLIC_AWS_BUCKET_NAME: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
    NEXT_PUBLIC_AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION,
    NEXT_PUBLIC_AWS_ACCESS_KEY_ID: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    NEXT_PUBLIC_AWS_ACCELERATE_ENDPOINT: process.env.NEXT_PUBLIC_AWS_ACCELERATE_ENDPOINT,
  },

  // Custom Webpack configuration (optional, if needed)
  webpack(config) {
    // Optionally, add custom Webpack configuration here
    return config;
  },

  // You can also add headers or redirects here if required
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },

  // Optional: Enable image optimization (if you plan to serve images in your app)
  images: {
    domains: ["your-image-domain.com"], // Add any domains you will use for images
  },

  // Optional: Enable experimental features (if required)
  experimental: {
    appDir: true, // If you are using the app directory structure
  },
};
