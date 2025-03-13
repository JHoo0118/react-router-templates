import korean from "../../resources/locales/ko/common.json";
import english from "../../resources/locales/en/common.json";

const languages = ["en", "ko"] as const;
export const supportedLanguages = [...languages];
export type Language = (typeof languages)[number];

type Resource = {
  common: typeof korean;
};

export type Namespace = keyof Resource;

export const resources: Record<Language, Resource> = {
  ko: {
    common: korean,
  },
  en: {
    common: english,
  },
};
