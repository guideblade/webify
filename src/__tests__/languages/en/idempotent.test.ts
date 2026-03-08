import { describe, it, expect } from 'vitest';
import { webify } from '@src/webify';

import { cases as unicodeCases, config as unicodeConfig } from './unicode/fixtures/cases';
import { cases as entityCases, config as entityConfig } from './entities/fixtures/cases';

describe('webify en idempotency', () => {
	it.each(unicodeCases)('should be idempotent in unicode mode: %s', (_input, expected) => {
		expect(webify(expected, unicodeConfig)).toBe(expected);
	});

	it.each(entityCases)('should be idempotent in entity mode: %s', (_input, expected) => {
		expect(webify(expected, entityConfig)).toBe(expected);
	});
});
