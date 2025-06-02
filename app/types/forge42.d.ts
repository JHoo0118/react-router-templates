declare module "@forge42/seo-tools/remix/sitemap" {
    import type { RouteManifest, ServerRoute } from "@remix-run/server-runtime";
    export function generateRemixSitemap(config: {
      domain: string;
      routes: RouteManifest<ServerRoute> | Array<Omit<ServerRoute, "children">>;
      ignore?: string[];
      urlTransformer?: (url: string) => string;
      sitemapData?: Record<string, unknown>;
    }): Promise<string>;
  }