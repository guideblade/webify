import {
	createWebify,
	type WebifyOptions,
	type WebifyOverrideOptions,
} from '@src/core/webify';

declare global {
	interface String {
		webify(options?: WebifyOverrideOptions): string;
	}
}

export function installStringWebify(defaultOptions: WebifyOptions): void {
	createWebify(defaultOptions).installStringMethod();
}
