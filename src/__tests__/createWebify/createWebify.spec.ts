import { describe, expect, it } from 'vitest';
import { createWebify } from '../../webify';

describe('createWebify exports', () => {
	it('should export a function', () => {
		expect(typeof createWebify).toBe('function');
	});
});
