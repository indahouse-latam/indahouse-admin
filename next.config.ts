import type { NextConfig } from "next";
import path from "path";
import { POLYGON_AMOY_RPC_URL } from "./src/config/env";

void POLYGON_AMOY_RPC_URL;

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
