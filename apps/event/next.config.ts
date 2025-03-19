const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['@repo/ui'],
  outputFileTracingRoot: path.join(__dirname, '../../'),
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (isServer) {
      config.plugins.push(new PrismaPlugin());
    }
    return config;
  },
};

export default nextConfig;
