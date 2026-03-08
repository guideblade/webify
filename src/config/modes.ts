// TYPE AND DATA ONLY
export const MODE_UNICODE = 'unicode';
export const MODE_HTML_ENTITIES = 'html-entities';
export const SUPPORTED_MODES = [MODE_UNICODE, MODE_HTML_ENTITIES] as const;

export type Mode = typeof MODE_UNICODE | typeof MODE_HTML_ENTITIES;
