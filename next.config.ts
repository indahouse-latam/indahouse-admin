import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve("."),
  },
  typescript: {
    // ⚠️ Permite que el build se complete incluso con errores de TypeScript
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠️ Permite que el build se complete incluso con errores de ESLint
    ignoreDuringBuilds: true,
  },
} as any;

export default nextConfig;
