import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import { reactRouterHonoServer } from "react-router-hono-server/dev";
import tsconfigPaths from "vite-tsconfig-paths";
import checker from "vite-plugin-checker";
import compression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";

export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [
      tailwindcss(),
      reactRouter(),
      reactRouterHonoServer({
        dev: {
          exclude: [/^\/(resources)\/.+/],
        },
      }),
      tsconfigPaths(),
      checker({ typescript: true }),
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
      visualizer({
        filename: "./build/client/stats.html",
        gzipSize: true,
        brotliSize: true,
        open: true,
      }),
    ],
    server: {
      open: true,
      // biome-ignore lint/nursery/noProcessEnv: Its ok to use process.env here
      port: Number(process.env.PORT || 4280),
    },
    preview: { open: true },
    esbuild: {
      treeShaking: true,
      target: "es2022",
      pure: [
        // "console.log",
        // "console.warn",
        // "console.error",
        // "Logging.info",
        // "Logging.warn",
        // "Logging.error",
      ],
    },
    build: {
      minify: "esbuild",
      terserOptions: {
        mangle: {
          toplevel: true,
          keep_classnames: false,
          keep_fnames: false,
          reserved: ["React", "ReactDOM", "$", "_"],
          properties: {
            regex: /^[_#@$]/,
            reserved: ["metadata", "props", "state", "React", "ReactDOM"],
            keep_quoted: true,
          },
        },
        nameCache: {},
        compress:
          mode === "production"
            ? {
                drop_console: true,
                drop_debugger: true,
                passes: 3,
              }
            : {},
        format: {
          comments: false,
        },
      },
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: true,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          chunkFileNames: "assets/[name]-[hash].js",
          entryFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash].[ext]",
        },
        treeshake: {
          preset: "recommended",
          moduleSideEffects: false,
        },
      },
      chunkSizeWarningLimit: 1000,
      reportCompressedSize: true,
      target: "es2022",
      cssTarget: "chrome80",
    },
    resolve: {
      alias: {},
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router",
        "@react-router/node",
        "react-i18next",
        "i18next",
        "i18next-browser-languagedetector",
        "i18next-http-backend",
        "i18next-fs-backend",
        "@tanstack/react-query",
        "@epic-web/client-hints",
        "zod",
        "isbot",
      ],
      esbuildOptions: {
        target: "es2022",
        platform: "node",
        format: "esm",
        treeShaking: true,
        minify: true,
        legalComments: "none",
      },
    },
  });
};
