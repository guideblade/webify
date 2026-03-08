// TYPE ONLY
import type { WebifyOverrideOptions } from '../webify';

declare global {
	interface String {
		webify(options?: WebifyOverrideOptions): string;
	}
}

export {};
