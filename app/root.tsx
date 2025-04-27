import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  useRouteLoaderData,
} from "react-router";
import { useChangeLanguage } from "remix-i18next/react";
import { ClientHintCheck, getHints } from "./services/client-hints";
import type { Route } from "./+types/root";
import tailwindcss from "./app.css?url";
import { useTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export async function loader({ context, request }: Route.LoaderArgs) {
  const { lang, clientEnv } = context;
  const hints = getHints(request);
  return { lang, clientEnv, hints };
}

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: tailwindcss },
];

export const handle = {
  i18n: "common",
};

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");
  const { i18n } = useTranslation();
  return (
    <html lang={data?.lang ?? "ko"} dir={i18n.dir()}>
      <head>
        <ClientHintCheck />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 5 * 1000,
          },
        },
      })
  );
  const { lang, clientEnv } = loaderData;
  useChangeLanguage(lang);
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: We set the window.env variable to the client env */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.env = ${JSON.stringify(clientEnv)}`,
        }}
      />
    </QueryClientProvider>
  );
}

export const ErrorBoundary = () => {
  const error = useRouteError();
  const { t } = useTranslation();

  const errorStatusCode = isRouteErrorResponse(error) ? error.status : "500";

  return (
    <div className="placeholder-index relative h-full min-h-screen w-screen flex items-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-blue-950 dark:to-blue-900 justify-center dark:bg-white sm:pb-16 sm:pt-8">
      <div className="relative mx-auto max-w-[90rem] sm:px-6 lg:px-8">
        <div className="relative  min-h-72 flex flex-col justify-center sm:overflow-hidden sm:rounded-2xl p-1 md:p-4 lg:p-6">
          <h1 className="text-center w-full text-red-600 text-2xl pb-2">
            {t(`error.${errorStatusCode}.title`)}
          </h1>
          <p className="text-lg dark:text-white text-center w-full">
            {t(`error.${errorStatusCode}.description`)}
          </p>
        </div>
      </div>
    </div>
  );
};
