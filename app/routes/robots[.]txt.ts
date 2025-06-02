import { generateRobotsTxt } from "@forge42/seo-tools/robots";

import type { Route } from "./+types/robots[.]txt";

import { createDomain } from "~/utils/http";

export async function loader({ request, context }: Route.LoaderArgs) {
  const { env } = context;
  const isProductionDeployment = env.APP_DEPLOYMENT_ENV === "production";
  const domain = createDomain(request);
  const robotsTxt = generateRobotsTxt([
    {
      userAgent: "*",
      [isProductionDeployment ? "allow" : "disallow"]: ["/"],
      sitemap: [`${domain}/sitemap-index.xml`],
    },
  ]);
  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
