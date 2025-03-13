import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { reactRouterHonoServer } from "react-router-hono-server/dev";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    reactRouterHonoServer({
      dev: {
        exclude: [/^\/(resources)\/.+/],
      },
    }),
    tsconfigPaths(),
  ],
  server: {
    open: true,
    // biome-ignore lint/nursery/noProcessEnv: Its ok to use process.env here
    port: Number(process.env.PORT || 4280),
  },
});
