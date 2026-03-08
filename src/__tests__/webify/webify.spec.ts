import { describe, expect, it } from 'vitest';
import { webify } from '../../webify';

describe('webify exports', () => {
	it('should export a function', () => {
		expect(typeof webify).toBe('function');
	});
});
