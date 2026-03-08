import { describe, expect, it } from 'vitest';
import { LANG_EN, LANG_RU } from '@src/config/languages';
import { installStringWebify } from '../../webify';

describe('installStringWebify', () => {
	it('should require explicit language for installStringWebify', () => {
		expect(() => installStringWebify(undefined as never)).toThrow(/explicit language/);
	});

	it('should install the default russian webify string method', () => {
		try {
			installStringWebify({ language: LANG_RU, mode: 'html-entities' });
			expect(
				(
					'\u0418\u041f \u0414\u0430\u043d\u0438\u043b \u041a\u043e\u043b\u0431\u0430\u0441\u0435\u043d\u043a\u043e' as unknown as Record<
						string,
						() => string
					>
				).webify(),
			).toBe(
				'\u0418\u041f&nbsp;\u0414\u0430\u043d\u0438\u043b \u041a\u043e\u043b\u0431\u0430\u0441\u0435\u043d\u043a\u043e',
			);
		} finally {
			delete (String.prototype as unknown as Record<string, unknown>).webify;
		}
	});

	it('should throw when installStringWebify is called twice', () => {
		try {
			installStringWebify({ language: LANG_EN, mode: 'unicode' });
			expect(() => installStringWebify({ language: LANG_RU, mode: 'unicode' })).toThrow(
				/already installed/,
			);
		} finally {
			delete (String.prototype as unknown as Record<string, unknown>).webify;
		}
	});

	it('should apply same-language per-call overrides on the installed string method', () => {
		try {
			installStringWebify({ language: LANG_EN, mode: 'unicode' });
			expect(('\"Hello\"' as unknown as Record<string, (options?: object) => string>).webify()).toBe(
				'\u201cHello\u201d',
			);
			expect(
				('\"Hello\"' as unknown as Record<string, (options?: object) => string>).webify({
					mode: 'html-entities',
				}),
			).toBe('&ldquo;Hello&rdquo;');
		} finally {
			delete (String.prototype as unknown as Record<string, unknown>).webify;
		}
	});

	it('should allow per-call language switching on the installed string method', () => {
		try {
			installStringWebify({ language: LANG_EN, mode: 'unicode' });
			expect(
				('\"hello\"' as unknown as Record<string, (options?: object) => string>).webify({
					language: LANG_RU,
				}),
			).toBe('\u00abhello\u00bb');
		} finally {
			delete (String.prototype as unknown as Record<string, unknown>).webify;
		}
	});

	it('should inherit installed mode and hooks when switching language per call', () => {
		try {
			installStringWebify({
				language: LANG_EN,
				mode: 'html-entities',
				hooks: {
					afterSerialize: (text) => `${text}!`,
				},
			});
			expect(
				('\"hello\"' as unknown as Record<string, (options?: object) => string>).webify({
					language: LANG_RU,
				}),
			).toBe('&laquo;hello&raquo;!');
		} finally {
			delete (String.prototype as unknown as Record<string, unknown>).webify;
		}
	});

	it('should not carry same-language nested rule overrides across language switches', () => {
		try {
			installStringWebify({
				language: LANG_EN,
				mode: 'unicode',
				rules: {
					smartPunctuation: false,
				},
			});
			expect(
				('\"hello\"' as unknown as Record<string, (options?: object) => string>).webify({
					language: LANG_RU,
				}),
			).toBe('\u00abhello\u00bb');
		} finally {
			delete (String.prototype as unknown as Record<string, unknown>).webify;
		}
	});
});
