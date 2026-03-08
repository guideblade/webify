import { describe, it, expect } from 'vitest';
import { webify } from '@src/webify';

import { cases, config } from './fixtures/cases';

describe('webify', () => {
	for (const [input, expected] of cases) {
		it(`should format: ${input.slice(0, 20)}...`, () => {
			expect(webify(input, config)).toBe(expected);
		});
	}
});
