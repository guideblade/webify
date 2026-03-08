import {
	DEFAULT_EN_WEBIFY_OPTIONS,
	DEFAULT_RU_WEBIFY_OPTIONS,
	DEFAULT_WEBIFY_OPTIONS,
} from '../config/defaults';
import { LANG_EN, LANG_RU, SUPPORTED_LANGS, type Language } from '../config/languages';
import { MODE_HTML_ENTITIES, MODE_UNICODE, SUPPORTED_MODES, type Mode } from '../config/modes';
import type {
	NormalizedWebifyOptions,
	RuWebifyOptions,
	RuWebifyOverrideOptions,
	TextReplacementRule,
	WebifyHook,
	WebifyHookContext,
	WebifyHookInput,
	WebifyOverrideOptions,
	WebifyOptions,
} from './contracts/options';

type LooseRecord = Record<string, unknown>;

const SUPPORTED_LANG_SET = new Set<string>(SUPPORTED_LANGS);
const SUPPORTED_MODE_SET = new Set<string>(SUPPORTED_MODES);

function isPlainObject(value: unknown): value is LooseRecord {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertPlainObject(value: unknown, path: string): LooseRecord {
	if (!isPlainObject(value)) {
		throw new TypeError(`${path} must be an object`);
	}

	return value;
}

function assertAllowedKeys(object: LooseRecord, allowedKeys: readonly string[], path: string): void {
	const allowedKeySet = new Set(allowedKeys);

	for (const key of Object.keys(object)) {
		if (!allowedKeySet.has(key)) {
			throw new TypeError(`${path}.${key} is not a supported option`);
		}
	}
}

function normalizeLanguage(value: unknown): Language {
	if (typeof value !== 'string') {
		throw new TypeError('options.language must be a string');
	}

	const normalized = value.toLowerCase();
	if (!SUPPORTED_LANG_SET.has(normalized)) {
		throw new RangeError(`options.language must be one of: ${SUPPORTED_LANGS.join(', ')}`);
	}

	return normalized as Language;
}

function normalizeMode(value: unknown): Mode {
	if (value === undefined) {
		return DEFAULT_WEBIFY_OPTIONS.mode;
	}

	if (typeof value !== 'string') {
		throw new TypeError('options.mode must be a string');
	}

	const normalized = value.toLowerCase();
	if (!SUPPORTED_MODE_SET.has(normalized)) {
		throw new RangeError(`options.mode must be one of: ${MODE_HTML_ENTITIES}, ${MODE_UNICODE}`);
	}

	return normalized as Mode;
}

function normalizeBoolean(value: unknown, path: string, fallback: boolean): boolean {
	if (value === undefined) {
		return fallback;
	}

	if (typeof value !== 'boolean') {
		throw new TypeError(`${path} must be a boolean`);
	}

	return value;
}

function normalizeStringList(value: unknown, path: string): readonly string[] {
	if (!Array.isArray(value)) {
		throw new TypeError(`${path} must be an array of strings`);
	}

	const result: string[] = [];
	for (const item of value) {
		if (typeof item !== 'string') {
			throw new TypeError(`${path} must contain only strings`);
		}

		const normalized = item.trim();
		if (!normalized) {
			throw new TypeError(`${path} must not contain empty strings`);
		}

		if (!result.includes(normalized)) {
			result.push(normalized);
		}
	}

	return result;
}

function normalizeStringListOverride(
	value: unknown,
	base: readonly string[],
	path: string,
): readonly string[] {
	if (value === undefined) {
		return [...base];
	}

	const override = assertPlainObject(value, path);
	assertAllowedKeys(override, ['replace', 'extend'], path);

	let result =
		override.replace === undefined
			? [...base]
			: [...normalizeStringList(override.replace, `${path}.replace`)];
	if (override.extend !== undefined) {
		for (const item of normalizeStringList(override.extend, `${path}.extend`)) {
			if (!result.includes(item)) {
				result.push(item);
			}
		}
	}

	return result;
}

function normalizeHookList(value: WebifyHookInput | undefined, path: string): readonly WebifyHook[] {
	if (value === undefined) {
		return [];
	}

	const hooks = Array.isArray(value) ? value : [value];
	for (const hook of hooks) {
		if (typeof hook !== 'function') {
			throw new TypeError(`${path} must contain only functions`);
		}
	}

	return [...hooks];
}

function normalizeHooks(value: unknown): NormalizedWebifyOptions['hooks'] {
	if (value === undefined) {
		return {
			beforeLanguage: [],
			afterLanguage: [],
			beforeSerialize: [],
			afterSerialize: [],
		};
	}

	const hooks = assertPlainObject(value, 'options.hooks');
	assertAllowedKeys(
		hooks,
		['beforeLanguage', 'afterLanguage', 'beforeSerialize', 'afterSerialize'],
		'options.hooks',
	);

	return {
		beforeLanguage: normalizeHookList(
			hooks.beforeLanguage as WebifyHookInput | undefined,
			'options.hooks.beforeLanguage',
		),
		afterLanguage: normalizeHookList(
			hooks.afterLanguage as WebifyHookInput | undefined,
			'options.hooks.afterLanguage',
		),
		beforeSerialize: normalizeHookList(
			hooks.beforeSerialize as WebifyHookInput | undefined,
			'options.hooks.beforeSerialize',
		),
		afterSerialize: normalizeHookList(
			hooks.afterSerialize as WebifyHookInput | undefined,
			'options.hooks.afterSerialize',
		),
	};
}

function normalizeReplacementRule(value: unknown, path: string): TextReplacementRule {
	const rule = assertPlainObject(value, path);
	assertAllowedKeys(rule, ['pattern', 'replace', 'repeatUntilStable', 'priority'], path);

	if (!(rule.pattern instanceof RegExp)) {
		throw new TypeError(`${path}.pattern must be a RegExp`);
	}

	if (typeof rule.replace !== 'string' && typeof rule.replace !== 'function') {
		throw new TypeError(`${path}.replace must be a string or function`);
	}

	if (rule.repeatUntilStable !== undefined && typeof rule.repeatUntilStable !== 'boolean') {
		throw new TypeError(`${path}.repeatUntilStable must be a boolean`);
	}

	if (
		rule.priority !== undefined &&
		(typeof rule.priority !== 'number' || !Number.isFinite(rule.priority))
	) {
		throw new TypeError(`${path}.priority must be a finite number`);
	}

	return {
		pattern: rule.pattern,
		replace: rule.replace as TextReplacementRule['replace'],
		repeatUntilStable: rule.repeatUntilStable,
		priority: rule.priority,
	};
}

function normalizeReplacementRuleList(value: unknown, path: string): readonly TextReplacementRule[] {
	if (!Array.isArray(value)) {
		throw new TypeError(`${path} must be an array`);
	}

	return value.map((rule, index) => normalizeReplacementRule(rule, `${path}[${index}]`));
}

function normalizeReplacementOverrides(
	value: unknown,
	base: readonly TextReplacementRule[],
	path: string,
): readonly TextReplacementRule[] {
	if (value === undefined) {
		return [...base];
	}

	const container = assertPlainObject(value, path);
	assertAllowedKeys(container, ['replace', 'extend'], path);

	let result =
		container.replace === undefined
			? [...base]
			: [...normalizeReplacementRuleList(container.replace, `${path}.replace`)];

	if (container.extend !== undefined) {
		result = [...result, ...normalizeReplacementRuleList(container.extend, `${path}.extend`)];
	}

	return result;
}

function normalizeRuOptions(
	options: WebifyOptions | WebifyOverrideOptions,
	language: Language,
): NormalizedWebifyOptions['ru'] {
	const defaults = DEFAULT_RU_WEBIFY_OPTIONS;
	const ruOptions = options as RuWebifyOptions | RuWebifyOverrideOptions;

	if (language !== LANG_RU) {
		return {
			rules: { ...defaults.rules },
			unbreakables: {
				prefixWords: [...defaults.unbreakables.prefixWords.replace],
				postpositiveParticles: [...defaults.unbreakables.postpositiveParticles.replace],
			},
			abbreviations: {
				final: [...defaults.abbreviations.final.replace],
				prepositional: [...defaults.abbreviations.prepositional.replace],
			},
			units: {
				post: [...defaults.units.post.replace],
				preNumber: [...defaults.units.preNumber.replace],
				operators: [...defaults.units.operators.replace],
			},
			replacements: [...defaults.replacements.replace],
		};
	}

	const rules = options.rules === undefined ? {} : assertPlainObject(options.rules, 'options.rules');
	assertAllowedKeys(
		rules,
		['decodeKnownEntities', 'replacements', 'quotes', 'unbreakables', 'abbreviations', 'units'],
		'options.rules',
	);

	const unbreakables =
		options.unbreakables === undefined
			? {}
			: assertPlainObject(options.unbreakables, 'options.unbreakables');
	assertAllowedKeys(unbreakables, ['prefixWords', 'postpositiveParticles'], 'options.unbreakables');

	const abbreviations =
		ruOptions.abbreviations === undefined
			? {}
			: assertPlainObject(ruOptions.abbreviations, 'options.abbreviations');
	assertAllowedKeys(abbreviations, ['final', 'prepositional'], 'options.abbreviations');

	const units = options.units === undefined ? {} : assertPlainObject(options.units, 'options.units');
	assertAllowedKeys(units, ['post', 'preNumber', 'operators'], 'options.units');

	return {
		rules: {
			decodeKnownEntities: normalizeBoolean(
				rules.decodeKnownEntities,
				'options.rules.decodeKnownEntities',
				defaults.rules.decodeKnownEntities,
			),
			replacements: normalizeBoolean(
				rules.replacements,
				'options.rules.replacements',
				defaults.rules.replacements,
			),
			quotes: normalizeBoolean(rules.quotes, 'options.rules.quotes', defaults.rules.quotes),
			unbreakables: normalizeBoolean(
				rules.unbreakables,
				'options.rules.unbreakables',
				defaults.rules.unbreakables,
			),
			abbreviations: normalizeBoolean(
				rules.abbreviations,
				'options.rules.abbreviations',
				defaults.rules.abbreviations,
			),
			units: normalizeBoolean(rules.units, 'options.rules.units', defaults.rules.units),
		},
		unbreakables: {
			prefixWords: normalizeStringListOverride(
				unbreakables.prefixWords,
				defaults.unbreakables.prefixWords.replace,
				'options.unbreakables.prefixWords',
			),
			postpositiveParticles: normalizeStringListOverride(
				unbreakables.postpositiveParticles,
				defaults.unbreakables.postpositiveParticles.replace,
				'options.unbreakables.postpositiveParticles',
			),
		},
		abbreviations: {
			final: normalizeStringListOverride(
				abbreviations.final,
				defaults.abbreviations.final.replace,
				'options.abbreviations.final',
			),
			prepositional: normalizeStringListOverride(
				abbreviations.prepositional,
				defaults.abbreviations.prepositional.replace,
				'options.abbreviations.prepositional',
			),
		},
		units: {
			post: normalizeStringListOverride(units.post, defaults.units.post.replace, 'options.units.post'),
			preNumber: normalizeStringListOverride(
				units.preNumber,
				defaults.units.preNumber.replace,
				'options.units.preNumber',
			),
			operators: normalizeStringListOverride(
				units.operators,
				defaults.units.operators.replace,
				'options.units.operators',
			),
		},
		replacements: normalizeReplacementOverrides(
			options.replacements,
			defaults.replacements.replace,
			'options.replacements',
		),
	};
}

function normalizeEnOptions(
	options: WebifyOptions | WebifyOverrideOptions,
	language: Language,
): NormalizedWebifyOptions['en'] {
	const defaults = DEFAULT_EN_WEBIFY_OPTIONS;

	if (language !== LANG_EN) {
		return {
			rules: { ...defaults.rules },
			unbreakables: {
				prefixWords: [...defaults.unbreakables.prefixWords.replace],
			},
			units: {
				post: [...defaults.units.post.replace],
				preNumber: [...defaults.units.preNumber.replace],
				operators: [...defaults.units.operators.replace],
			},
			replacements: [...defaults.replacements.replace],
		};
	}

	if ('abbreviations' in options && options.abbreviations !== undefined) {
		throw new TypeError('options.abbreviations is not supported for language=en');
	}

	const rules = options.rules === undefined ? {} : assertPlainObject(options.rules, 'options.rules');
	assertAllowedKeys(
		rules,
		['decodeKnownEntities', 'replacements', 'smartPunctuation', 'layout', 'unbreakables', 'units'],
		'options.rules',
	);

	const unbreakables =
		options.unbreakables === undefined
			? {}
			: assertPlainObject(options.unbreakables, 'options.unbreakables');
	assertAllowedKeys(unbreakables, ['prefixWords'], 'options.unbreakables');

	const units = options.units === undefined ? {} : assertPlainObject(options.units, 'options.units');
	assertAllowedKeys(units, ['post', 'preNumber', 'operators'], 'options.units');

	return {
		rules: {
			decodeKnownEntities: normalizeBoolean(
				rules.decodeKnownEntities,
				'options.rules.decodeKnownEntities',
				defaults.rules.decodeKnownEntities,
			),
			replacements: normalizeBoolean(
				rules.replacements,
				'options.rules.replacements',
				defaults.rules.replacements,
			),
			smartPunctuation: normalizeBoolean(
				rules.smartPunctuation,
				'options.rules.smartPunctuation',
				defaults.rules.smartPunctuation,
			),
			layout: normalizeBoolean(rules.layout, 'options.rules.layout', defaults.rules.layout),
			unbreakables: normalizeBoolean(
				rules.unbreakables,
				'options.rules.unbreakables',
				defaults.rules.unbreakables,
			),
			units: normalizeBoolean(rules.units, 'options.rules.units', defaults.rules.units),
		},
		unbreakables: {
			prefixWords: normalizeStringListOverride(
				unbreakables.prefixWords,
				defaults.unbreakables.prefixWords.replace,
				'options.unbreakables.prefixWords',
			),
		},
		units: {
			post: normalizeStringListOverride(units.post, defaults.units.post.replace, 'options.units.post'),
			preNumber: normalizeStringListOverride(
				units.preNumber,
				defaults.units.preNumber.replace,
				'options.units.preNumber',
			),
			operators: normalizeStringListOverride(
				units.operators,
				defaults.units.operators.replace,
				'options.units.operators',
			),
		},
		replacements: normalizeReplacementOverrides(
			options.replacements,
			defaults.replacements.replace,
			'options.replacements',
		),
	};
}

export function normalizeWebifyOptions(options: WebifyOptions | WebifyOverrideOptions): NormalizedWebifyOptions {
	if (!isPlainObject(options)) {
		throw new TypeError('options must be an object');
	}

	assertAllowedKeys(
		options,
		['language', 'mode', 'hooks', 'rules', 'unbreakables', 'abbreviations', 'units', 'replacements'],
		'options',
	);

	const language = normalizeLanguage(options.language);

	return {
		language,
		mode: normalizeMode(options.mode),
		hooks: normalizeHooks(options.hooks),
		ru: normalizeRuOptions(options, language),
		en: normalizeEnOptions(options, language),
	};
}

export function applyHooks(
	text: string,
	hooks: readonly WebifyHook[],
	context: Readonly<WebifyHookContext>,
): string {
	let result = text;

	for (const hook of hooks) {
		result = hook(result, context);
	}

	return result;
}
