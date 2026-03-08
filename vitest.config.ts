import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['src/__tests__/**/*.test.ts', 'src/__tests__/**/*.spec.ts'],
		coverage: {
			provider: 'v8',
			exclude: [
				'src/config/**',
				'src/core/contracts/**',
				'src/types/**',
				'src/languages/en/data/**',
				'src/languages/ru/data/**',
				'src/__tests__/**/fixtures/**',
			],
		},
	},
	resolve: {
		alias: {
			'@src': fileURLToPath(new URL('./src', import.meta.url)),
			'@config': fileURLToPath(new URL('./src/config', import.meta.url)),
		},
	},
});
