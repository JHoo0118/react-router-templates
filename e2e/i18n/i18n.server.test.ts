import { test, expect } from "@playwright/test";
import remixI18n from "../../app/localization/i18n.server";

test("Remix I18n - returns the correct default language from the request", async () => {
  const request = new Request("http://localhost:4280");
  const defaultLanguage = await remixI18n.getLocale(request);
  expect(defaultLanguage).toBe("ko");
});

test("Remix I18n - returns the correct default language from the request if search param lang is invalid", async () => {
  const request = new Request("http://localhost:4280?lng=invalid");
  const defaultLanguage = await remixI18n.getLocale(request);
  expect(defaultLanguage).toBe("ko");
});

test("Remix I18n - returns the correct language when specified in the search params from the request", async () => {
  const request = new Request("http://localhost:4280?lng=en");
  const defaultLanguage = await remixI18n.getLocale(request);
  expect(defaultLanguage).toBe("en");
});
