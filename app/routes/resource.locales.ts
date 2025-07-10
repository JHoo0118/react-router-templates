import { z } from "zod";

import type { Route } from "./+types/resource.locales";

import { resources } from "~/localization/resource";

export async function loader({ request, context }: Route.LoaderArgs) {
  const { env } = context;
  const url = new URL(request.url);

  const lngParam = url.searchParams.get("lng");
  if (!lngParam || !(lngParam in resources)) {
    throw new Response("Invalid language", { status: 400 });
  }
  const lng = lngParam as keyof typeof resources;
  const namespaces = resources[lng];

  const nsParam = url.searchParams.get("ns");
  if (!nsParam || !(nsParam in namespaces)) {
    throw new Response("Invalid namespace", { status: 400 });
  }
  const ns = nsParam as keyof typeof namespaces;

  const headers = new Headers();

  // On production, we want to add cache headers to the response
  if (env.APP_DEPLOYMENT_ENV === "production") {
    headers.set(
      "Cache-Control",
      "max-age=300, s-maxage=86400, stale-while-revalidate=604800, stale-if-error=604800",
    );
  }

  return Response.json(namespaces[ns], { headers });
}
