/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  
  // FIX: Necessary for Next.js to process CSS imports inside node_modules/react-pdf
  transpilePackages: ['react-pdf'],
};

export default nextConfig;