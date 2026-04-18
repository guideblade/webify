import { describe, expect, it } from 'vitest';
import { webify } from '@src/webify';

describe('webify ru preposition "по"', () => {
	it('does not treat uppercase "ПО" as a preposition in html entities mode', () => {
		expect(
			webify('Скачать наше ПО можно на сайте...', {
				language: 'ru',
				mode: 'html-entities',
			}),
		).toBe('Скачать наше ПО можно на&nbsp;сайте&hellip;');
	});

	it('still binds lowercase and sentence-case "по" in unicode mode', () => {
		expect(
			webify('По возможности скачать по ссылке.', {
				language: 'ru',
				mode: 'unicode',
			}),
		).toBe('По\u00A0возможности скачать по\u00A0ссылке.');
	});
});
