import { z } from "zod";
import { resources } from "~/localization/resource";
import type { Route } from "./+types/resource.locales";

export async function loader({ request, context }: Route.LoaderArgs) {
  const { env } = context;
  const url = new URL(request.url);

  const lng = z
    .string()
    .refine((lng): lng is keyof typeof resources =>
      Object.keys(resources).includes(lng)
    )
    .parse(url.searchParams.get("lng"));

  const namespaces = resources[lng];

  const ns = z
    .string()
    .refine((ns): ns is keyof typeof namespaces => {
      return Object.keys(resources[lng]).includes(ns);
    })
    .parse(url.searchParams.get("ns"));

  const headers = new Headers();

  // On production, we want to add cache headers to the response
  if (env.APP_DEPLOYMENT_ENV === "production") {
    headers.set(
      "Cache-Control",
      "max-age=300, s-maxage=86400, stale-while-revalidate=604800, stale-if-error=604800"
    );
  }

  return Response.json(namespaces[ns], { headers });
}
