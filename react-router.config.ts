import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  buildDirectory: "dist",
  future: {
    unstable_viteEnvironmentApi: true,
    unstable_splitRouteModules: true,
    unstable_optimizeDeps: true,
  },
} satisfies Config;
