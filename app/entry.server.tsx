import { createReadableStreamFromReadable } from "@react-router/node";
import { createInstance } from "i18next";
import { isbot } from "isbot";
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { I18nextProvider, initReactI18next } from "react-i18next";
import {
  type AppLoadContext,
  type EntryContext,
  type HandleErrorFunction,
  ServerRouter,
} from "react-router";

import i18n from "./localization/i18n"; // your i18n configuration file
import i18nextOpts from "./localization/i18n.server";
import { resources } from "./localization/resource";

// Reject all pending promises from handler functions after 10 seconds
export const streamTimeout = 10000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  context: EntryContext,
  appContext: AppLoadContext
) {
  // onShellReady: 초기 HTML 셸을 빠르게 전송하고 나머지 콘텐츠를 스트리밍합니다. 사용자에게 빠른 첫 페이지 로드를 제공합니다.
  // onAllReady: 모든 콘텐츠(데이터 페칭, 컴포넌트 렌더링 등)가 완료될 때까지 기다린 후 전체 HTML을 전송합니다. 검색 엔진 크롤러나 정적 페이지 생성에 적합합니다.
  const callbackName =
    isbot(request.headers.get("user-agent")) || context.isSpaMode
      ? "onAllReady"
      : "onShellReady";
  const instance = createInstance();
  const lng = appContext.lang;
  const ns = i18nextOpts.getRouteNamespaces(context);

  await instance
    .use(initReactI18next) // Tell our instance to use react-i18next
    .init({
      ...i18n, // spread the configuration
      lng, // The locale we detected above
      ns, // The namespaces the routes about to render wants to use
      resources,
    });

  return new Promise((resolve, reject) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={instance}>
        <ServerRouter context={context} url={request.url} />
      </I18nextProvider>,
      {
        [callbackName]: () => {
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          responseHeaders.set(
            "Strict-Transport-Security",
            "max-age=31536000; includeSubDomains; preload"
          );
          responseHeaders.set("X-Content-Type-Options", "nosniff");
          responseHeaders.set(
            "Referrer-Policy",
            "strict-origin-when-cross-origin"
          );
          responseHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
          responseHeaders.set("Cross-Origin-Embedder-Policy", "unsafe-none");
          responseHeaders.set("X-Frame-Options", "DENY");
          responseHeaders.set("X-XSS-Protection", "1; mode=block");
          resolve(
            // @ts-expect-error - We purposely do not define the body as existent so it's not used inside loaders as it's injected there as well
            appContext.body(stream, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          didError = true;
          // biome-ignore lint/suspicious/noConsole: We console log the error
          console.error(error);
        },
      }
    );
    // Abort the streaming render pass after 11 seconds so to allow the rejected
    // boundaries to be flushed
    setTimeout(abort, streamTimeout + 1000);
  });
}

export const handleError: HandleErrorFunction = (error, { request }) => {
  if (!request.signal.aborted && process.env.NODE_ENV === "production") {
    // Also log to console for server-side visibility
    console.error(error);
  }
};
