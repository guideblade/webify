import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['cjs', 'esm'],
	dts: true,
	clean: true,
	splitting: false,
	sourcemap: false,
	target: 'es2020',
	outDir: 'dist',
	outExtension({ format }) {
		return {
			js: format === 'esm' ? '.mjs' : '.js',
		};
	},
});
