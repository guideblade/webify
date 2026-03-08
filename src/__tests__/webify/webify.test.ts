import { describe, expect, it } from 'vitest';
import { LANG_EN, LANG_RU } from '@src/config/languages';
import {
	DEFAULT_EN_WEBIFY_OPTIONS,
	DEFAULT_WEBIFY_OPTIONS,
	EN_SYMBOL_SHORTHAND_REPLACEMENT_RULES,
	webify,
	type WebifyOptions,
} from '../../webify';

describe('webify', () => {
	it('should export the default config', () => {
		expect(DEFAULT_WEBIFY_OPTIONS.language).toBe(LANG_RU);
		expect(DEFAULT_WEBIFY_OPTIONS.mode).toBe('unicode');
		expect(DEFAULT_EN_WEBIFY_OPTIONS.language).toBe(LANG_EN);
	});

	it('should require explicit language for direct webify calls', () => {
		expect(() => webify('text', undefined as never)).toThrow(/explicit language/);
	});

	it('should reject unsupported top-level options', () => {
		expect(() => webify('text', { language: LANG_RU, foo: true } as WebifyOptions)).toThrow(
			/options\.foo/,
		);
	});

	it('should reject nested language configs in the public API', () => {
		expect(() => webify('text', { language: LANG_RU, ru: {} } as WebifyOptions)).toThrow(/options\.ru/);
		expect(() => webify('text', { language: LANG_EN, en: {} } as WebifyOptions)).toThrow(/options\.en/);
	});

	it('should reject unsupported modes', () => {
		expect(() => webify('text', { language: LANG_RU, mode: 'xml' as never })).toThrow(/options\.mode/);
	});

	it('should allow custom russian abbreviation extensions', () => {
		expect(
			webify('ЧП Ромашка', {
				language: LANG_RU,
				mode: 'unicode',
				abbreviations: {
					prepositional: {
						extend: ['ЧП'],
					},
				},
			}),
		).toBe('ЧП Ромашка');
	});

	it('should allow custom russian unit extensions', () => {
		expect(
			webify('Концентрация 5 мкг/мл', {
				language: LANG_RU,
				mode: 'unicode',
				units: {
					post: {
						extend: ['мкг/мл'],
					},
				},
			}),
		).toBe('Концентрация 5 мкг/мл');
	});

	it('should run hooks around serialization', () => {
		expect(
			webify('"hello"', {
				language: LANG_EN,
				mode: 'html-entities',
				hooks: {
					afterSerialize: (text) => `${text}!`,
				},
			}),
		).toBe('&ldquo;hello&rdquo;!');
	});

	it('should apply replacement extensions deterministically by priority', () => {
		expect(
			webify('abc', {
				language: LANG_EN,
				mode: 'unicode',
				rules: {
					smartPunctuation: false,
					layout: false,
					unbreakables: false,
					units: false,
				},
				replacements: {
					replace: [],
					extend: [
						{ pattern: /a/g, replace: 'Y', priority: 0 },
						{ pattern: /ab/g, replace: 'X', priority: 10 },
					],
				},
			}),
		).toBe('Xc');
	});

	it('should allow replacement overrides without extension', () => {
		expect(
			webify('Wait... then go.', {
				language: LANG_EN,
				mode: 'unicode',
				replacements: {
					replace: [],
				},
			}),
		).toBe('Wait... then go.');
	});

	it('should allow opting into english symbol shorthand replacements by extension', () => {
		expect(
			webify('Company (TM)', {
				language: LANG_EN,
				mode: 'unicode',
				replacements: {
					extend: EN_SYMBOL_SHORTHAND_REPLACEMENT_RULES,
				},
			}),
		).toBe('Company ™');
	});

	it('should preserve a dangling final quote in russian text', () => {
		expect(webify('Он сказал: "', { language: LANG_RU })).toBe('Он сказал: "');
	});

	it('should preserve an ambiguous trailing quote after a resolved russian quote pair', () => {
		expect(webify('Он пробежал "500 м" Ok"', { language: LANG_RU })).toBe('Он пробежал «500 м» Ok"');
	});

	it('should preserve the final raw quote in a trailing russian quote run', () => {
		expect(webify('Он пробежал "500 м" Ok "ok"""', { language: LANG_RU })).toBe(
			'Он пробежал «500 м» Ok «ok»»"',
		);
	});

	it('should preserve an unmatched opening quote in russian text', () => {
		expect(webify('Он сказал "привет', { language: LANG_RU })).toBe('Он сказал «привет');
	});

	it('should keep existing balanced nested russian quotes', () => {
		expect(webify('Цитата: "Он сказал "ок""', { language: LANG_RU })).toBe('Цитата: «Он сказал „ок“»');
	});
});
