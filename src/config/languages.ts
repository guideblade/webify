// TYPE AND DATA ONLY
export const LANG_EN = 'en';
export const LANG_RU = 'ru';

export const SUPPORTED_LANGS = [LANG_EN, LANG_RU] as const;
export type Language = (typeof SUPPORTED_LANGS)[number];
