/** @type {import('next').NextConfig} */
const nextConfig = {
    // Disable SWC minification to avoid binary issues
    swcMinify: false,

    // Existing config
    reactStrictMode: true,
};

module.exports = nextConfig;
