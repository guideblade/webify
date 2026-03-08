import { describe, it, expect } from 'vitest';
import { webify } from '@src/webify';

import { cases, config } from './fixtures/cases';

describe('webify formatting', () => {
	it.each(cases)('should format: %s', (input, expected) => {
		expect(webify(input, config)).toBe(expected);
	});
});
