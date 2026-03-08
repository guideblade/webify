import { describe, expect, it } from 'vitest';
import { LANG_EN, LANG_RU } from '@src/config/languages';
import { createWebify, type EnWebifyOptions } from '../../webify';

describe('createWebify', () => {
	it('should create configured instances with override support', () => {
		const penguin = createWebify({
			language: LANG_RU,
			mode: 'html-entities',
			abbreviations: {
				prepositional: {
					extend: ['\u0427\u041f'],
				},
			},
		});

		expect(penguin.defaults.language).toBe(LANG_RU);
		expect(penguin('\u0427\u041f \u0420\u043e\u043c\u0430\u0448\u043a\u0430')).toBe(
			'\u0427\u041f&nbsp;\u0420\u043e\u043c\u0430\u0448\u043a\u0430',
		);
		expect(penguin('\u0427\u041f \u0420\u043e\u043c\u0430\u0448\u043a\u0430', { mode: 'unicode' })).toBe(
			'\u0427\u041f\u00A0\u0420\u043e\u043c\u0430\u0448\u043a\u0430',
		);
	});

	it('should detach formatter behavior from later mutations of the caller defaults', () => {
		const defaults: EnWebifyOptions = {
			language: LANG_EN,
			mode: 'unicode',
		};
		const formatter = createWebify(defaults);

		expect(formatter('"Hello"')).toBe('\u201cHello\u201d');

		defaults.mode = 'html-entities';

		expect(formatter('"Hello"')).toBe('\u201cHello\u201d');
		expect(formatter.defaults.mode).toBe('unicode');
	});

	it('should expose deeply frozen defaults without altering behavior', () => {
		const formatter = createWebify({
			language: LANG_EN,
			mode: 'unicode',
			unbreakables: {
				prefixWords: {
					replace: ['a'],
				},
			},
		});

		expect(
			() =>
				(
					formatter.defaults.unbreakables?.prefixWords?.replace as unknown as string[]
				).push('the'),
		).toThrow(TypeError);
		expect(formatter('the fox')).toBe('the fox');
	});

	it('should derive chained instances from the internal snapshot instead of the caller object', () => {
		const defaults: EnWebifyOptions = {
			language: LANG_EN,
			mode: 'unicode',
		};
		const formatter = createWebify(defaults);
		const derived = formatter.with({ mode: 'html-entities' });

		defaults.mode = 'html-entities';

		expect(formatter('"Hello"')).toBe('\u201cHello\u201d');
		expect(derived('"Hello"')).toBe('&ldquo;Hello&rdquo;');
	});

	it('should install the default string method from a created instance', () => {
		const penguin = createWebify({
			language: LANG_EN,
			mode: 'unicode',
		});

		try {
			penguin.installStringMethod();
			expect(('Wait... then go.' as unknown as Record<string, () => string>).webify()).toBe(
				'Wait\u2026\u00A0then go.',
			);
		} finally {
			delete (String.prototype as unknown as Record<string, unknown>).webify;
		}
	});

	it('should throw when installing the string method twice from created instances', () => {
		const penguin = createWebify({
			language: LANG_EN,
			mode: 'unicode',
		});
		const bear = createWebify({
			language: LANG_RU,
			mode: 'unicode',
		});

		try {
			penguin.installStringMethod();
			expect(() => bear.installStringMethod()).toThrow(/already installed/);
		} finally {
			delete (String.prototype as unknown as Record<string, unknown>).webify;
		}
	});
});
