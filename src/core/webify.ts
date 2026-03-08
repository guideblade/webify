import { LANG_EN, LANG_RU, type Language } from '@src/config/languages';
import { MODE_HTML_ENTITIES } from '@src/config/modes';
import { encodeHtmlEntities } from '@src/encoding/html';
import { webifyEn } from '@src/languages/en/webifyEn';
import { webifyRu } from '@src/languages/ru/webifyRu';
import { applyHooks, normalizeWebifyOptions } from './normalizeOptions';
import { protectLinkLikeTokens } from './text/protectedTokens';
import type {
	EnWebifyOptions,
	RuWebifyOptions,
	WebifyInstance,
	WebifyOptions,
	WebifyOptionsForLanguage,
	WebifyOverrideOptions,
	WebifyOverrideOptionsForLanguage,
} from './contracts/options';

export type {
	EnWebifyOptions,
	RuWebifyOptions,
	WebifyInstance,
	WebifyOptions,
	WebifyOverrideOptions,
} from './contracts/options';

function isPlainObject(value: unknown): value is Record<string, unknown> {
	if (typeof value !== 'object' || value === null) {
		return false;
	}

	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}

function cloneAndFreezeValue<T>(value: T): T {
	if (Array.isArray(value)) {
		return Object.freeze(value.map((item) => cloneAndFreezeValue(item))) as unknown as T;
	}

	if (value instanceof RegExp || typeof value === 'function') {
		return value;
	}

	if (isPlainObject(value)) {
		const clone: Record<string, unknown> = {};
		for (const key of Object.keys(value)) {
			clone[key] = cloneAndFreezeValue(value[key]);
		}

		return Object.freeze(clone) as unknown as T;
	}

	return value;
}

function cloneAndFreezeOptions<L extends Language>(
	options: WebifyOptionsForLanguage<L>,
): WebifyOptionsForLanguage<L> {
	return cloneAndFreezeValue(options);
}

function mergeHooks(
	defaultHooks: WebifyOptions['hooks'],
	overrideHooks: WebifyOverrideOptions['hooks'],
): WebifyOptions['hooks'] {
	if (defaultHooks === undefined && overrideHooks === undefined) {
		return undefined;
	}

	return {
		...defaultHooks,
		...overrideHooks,
	};
}

function formatWithNormalizedOptions(text: string, options: WebifyOptions | WebifyOverrideOptions): string {
	const normalized = normalizeWebifyOptions(options);
	const context = {
		language: normalized.language,
		mode: normalized.mode,
	} as const;

	let result = applyHooks(text, normalized.hooks.beforeLanguage, context);
	const protectedTokens = protectLinkLikeTokens(result);
	result = protectedTokens.text;

	switch (normalized.language) {
		case LANG_EN:
			result = webifyEn(result, normalized.en);
			break;
		case LANG_RU:
			result = webifyRu(result, normalized.ru);
			break;
	}

	result = protectedTokens.restore(result);
	result = applyHooks(result, normalized.hooks.afterLanguage, context);
	result = applyHooks(result, normalized.hooks.beforeSerialize, context);

	if (normalized.mode === MODE_HTML_ENTITIES) {
		result = encodeHtmlEntities(result);
	}

	return applyHooks(result, normalized.hooks.afterSerialize, context);
}

function mergeWebifyOptions<L extends Language>(
	defaultOptions: WebifyOptionsForLanguage<L>,
	overrideOptions?: WebifyOverrideOptionsForLanguage<L>,
): WebifyOptionsForLanguage<L> {
	if (overrideOptions === undefined) {
		return { ...defaultOptions };
	}

	return {
		...defaultOptions,
		...overrideOptions,
		language: defaultOptions.language,
		hooks: {
			...defaultOptions.hooks,
			...overrideOptions.hooks,
		},
		rules: {
			...defaultOptions.rules,
			...overrideOptions.rules,
		},
		unbreakables: {
			...defaultOptions.unbreakables,
			...overrideOptions.unbreakables,
		},
		units: {
			...defaultOptions.units,
			...overrideOptions.units,
		},
		replacements: {
			...defaultOptions.replacements,
			...overrideOptions.replacements,
		},
		...('abbreviations' in defaultOptions
			? {
					abbreviations: {
						...defaultOptions.abbreviations,
						...('abbreviations' in overrideOptions ? overrideOptions.abbreviations : undefined),
					},
		}
			: {}),
	} as WebifyOptionsForLanguage<L>;
}

function mergeInstalledStringOptions(
	defaultOptions: WebifyOptions,
	overrideOptions?: WebifyOverrideOptions,
): WebifyOptions {
	if (overrideOptions === undefined) {
		return defaultOptions;
	}

	if (overrideOptions.language === undefined || overrideOptions.language === defaultOptions.language) {
		return mergeWebifyOptions(
			defaultOptions as WebifyOptionsForLanguage<typeof defaultOptions.language>,
			overrideOptions as WebifyOverrideOptionsForLanguage<typeof defaultOptions.language>,
		);
	}

	return {
		...overrideOptions,
		language: overrideOptions.language,
		mode: overrideOptions.mode ?? defaultOptions.mode,
		hooks: mergeHooks(defaultOptions.hooks, overrideOptions.hooks),
	} as WebifyOptions;
}

function installStringMethod(defaultOptions: WebifyOptions): void {
	if (typeof (String.prototype as unknown as Record<string, unknown>).webify === 'function') {
		throw new TypeError('String.prototype.webify is already installed');
	}

	Object.defineProperty(String.prototype, 'webify', {
		value(this: string, options?: WebifyOverrideOptions): string {
			return formatWithNormalizedOptions(this.toString(), mergeInstalledStringOptions(defaultOptions, options));
		},
		configurable: true,
	});
}

export function webify(text: string, options: WebifyOptions): string {
	if (typeof text !== 'string') {
		throw new TypeError('webify expects a string');
	}

	if (options === undefined) {
		throw new TypeError('webify requires options with an explicit language');
	}

	return formatWithNormalizedOptions(text, options);
}

export function createWebify(defaultOptions: RuWebifyOptions): WebifyInstance<typeof LANG_RU>;
export function createWebify(defaultOptions: EnWebifyOptions): WebifyInstance<typeof LANG_EN>;
export function createWebify<L extends Language>(
	defaultOptions: WebifyOptionsForLanguage<L>,
): WebifyInstance<L>;
export function createWebify<L extends Language>(
	defaultOptions: WebifyOptionsForLanguage<L>,
): WebifyInstance<L> {
	const frozenDefaults = cloneAndFreezeOptions(defaultOptions);
	const formatter = ((text: string, options?: WebifyOverrideOptionsForLanguage<L>) => {
		if (typeof text !== 'string') {
			throw new TypeError('webify expects a string');
		}

		return formatWithNormalizedOptions(text, mergeWebifyOptions(frozenDefaults, options));
	}) as WebifyInstance<L>;

	formatter.with = (options: WebifyOverrideOptionsForLanguage<L>) =>
		createWebify(mergeWebifyOptions(frozenDefaults, options));
	formatter.installStringMethod = () => {
		installStringMethod(frozenDefaults);
	};
	formatter.defaults = frozenDefaults as Readonly<WebifyOptionsForLanguage<L>>;

	return formatter;
}

export function installStringWebify(defaultOptions: WebifyOptions): void {
	if (defaultOptions === undefined) {
		throw new TypeError('installStringWebify requires options with an explicit language');
	}

	createWebify(defaultOptions).installStringMethod();
}
