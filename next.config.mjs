/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['10.0.0.79', '192.168.2.101', '192.168.1.55'],
  // output : 'export' //for static export, but breaks next-auth - use for tauri only
}

export default nextConfig
