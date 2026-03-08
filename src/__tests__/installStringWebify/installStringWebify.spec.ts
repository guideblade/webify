import { describe, expect, it } from 'vitest';
import { installStringWebify } from '../../webify';

describe('installStringWebify exports', () => {
	it('should export a function', () => {
		expect(typeof installStringWebify).toBe('function');
	});
});
