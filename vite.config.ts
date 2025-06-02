import { reactRouter } from "@react-router/dev/vite";

import { defineConfig, loadEnv } from "vite";
import { reactRouterHonoServer } from "react-router-hono-server/dev";
import tsconfigPaths from "vite-tsconfig-paths";
import checker from "vite-plugin-checker";
import compression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const isProduction = mode === "production";

  return defineConfig({
    plugins: [
      reactRouter(),
      vanillaExtractPlugin(),
      reactRouterHonoServer({
        dev: {
          exclude: [/^\/(resources)\/.+/],
        },
      }),
      tsconfigPaths(),
      !isProduction && checker({ typescript: true }),
      compression({
        algorithm: "gzip",
        ext: ".gz",
        threshold: 10240,
        deleteOriginFile: false,
      }),
      compression({
        algorithm: "brotliCompress",
        ext: ".br",
        threshold: 10240,
        deleteOriginFile: false,
      }),
      !isProduction &&
        visualizer({
          filename: "./build/client/stats.html",
          gzipSize: true,
          brotliSize: true,
          open: true,
        }),
    ],
    server: {
      open: true,
      allowedHosts: true,
      watch: {
        ignored: [
          "**/*.spec.ts",
          "**/*.test.ts",
          "**/tests/**",
          "**/playwright-report/**",
          "**/test-results/**",
        ],
      },
      // biome-ignore lint/nursery/noProcessEnv: Its ok to use process.env here
      port: Number(process.env.PORT || 4280),
    },
    preview: { open: true },
    esbuild: {
      treeShaking: true,
    },
    build: {
      minify: "esbuild",
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: isProduction ? false : true,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          chunkFileNames: "assets/[name]-[hash].js",
          entryFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash].[ext]",
        },
        treeshake: {
          preset: "recommended",
          moduleSideEffects: true,
        },
      },
      chunkSizeWarningLimit: 1000,
      reportCompressedSize: true,
      target: "es2020",
      cssTarget: "chrome80",
    },
    optimizeDeps: {
      esbuildOptions: {
        target: "es2020",
        supported: {
          "top-level-await": true,
        },
        treeShaking: true,
        minify: true,
        legalComments: "none",
      },
    },
  });
};
