// TYPE ONLY
import { LANG_EN, LANG_RU } from '../../config/languages';
import type { Language } from '../../config/languages';
import type { Mode } from '../../config/modes';

export type TupleRule = readonly [RegExp, string];

export type ReplaceCallback = (substring: string, ...args: unknown[]) => string;

export type TextReplacementRule = {
	pattern: RegExp;
	replace: string | ReplaceCallback;
	repeatUntilStable?: boolean;
	priority?: number;
};

export type StringListOverride = {
	replace?: readonly string[];
	extend?: readonly string[];
};

export type ReplacementRuleListOverride = {
	replace?: readonly TextReplacementRule[];
	extend?: readonly TextReplacementRule[];
};

export type WebifyHookContext = {
	language: Language;
	mode: Mode;
};

export type WebifyHook = (text: string, context: Readonly<WebifyHookContext>) => string;

export type WebifyHookInput = WebifyHook | readonly WebifyHook[];

export type WebifyHooks = {
	beforeLanguage?: WebifyHookInput;
	afterLanguage?: WebifyHookInput;
	beforeSerialize?: WebifyHookInput;
	afterSerialize?: WebifyHookInput;
};

export type RuRuleOptions = {
	decodeKnownEntities?: boolean;
	replacements?: boolean;
	quotes?: boolean;
	unbreakables?: boolean;
	abbreviations?: boolean;
	units?: boolean;
};

export type RuWebifyOptions = {
	language: typeof LANG_RU;
	mode?: Mode;
	hooks?: WebifyHooks;
	rules?: RuRuleOptions;
	unbreakables?: {
		prefixWords?: StringListOverride;
		postpositiveParticles?: StringListOverride;
	};
	abbreviations?: {
		final?: StringListOverride;
		prepositional?: StringListOverride;
	};
	units?: {
		post?: StringListOverride;
		preNumber?: StringListOverride;
		operators?: StringListOverride;
	};
	replacements?: ReplacementRuleListOverride;
};

export type EnRuleOptions = {
	decodeKnownEntities?: boolean;
	replacements?: boolean;
	smartPunctuation?: boolean;
	layout?: boolean;
	unbreakables?: boolean;
	units?: boolean;
};

export type EnWebifyOptions = {
	language: typeof LANG_EN;
	mode?: Mode;
	hooks?: WebifyHooks;
	rules?: EnRuleOptions;
	unbreakables?: {
		prefixWords?: StringListOverride;
	};
	units?: {
		post?: StringListOverride;
		preNumber?: StringListOverride;
		operators?: StringListOverride;
	};
	replacements?: ReplacementRuleListOverride;
};

export type WebifyOptions = RuWebifyOptions | EnWebifyOptions;

export type RuWebifyOverrideOptions = Omit<RuWebifyOptions, 'language'> & {
	language?: typeof LANG_RU;
};

export type EnWebifyOverrideOptions = Omit<EnWebifyOptions, 'language'> & {
	language?: typeof LANG_EN;
};

export type WebifyOverrideOptions = RuWebifyOverrideOptions | EnWebifyOverrideOptions;

export type WebifyOptionsForLanguage<L extends Language> = L extends typeof LANG_EN
	? EnWebifyOptions
	: RuWebifyOptions;

export type WebifyOverrideOptionsForLanguage<L extends Language> = L extends typeof LANG_EN
	? EnWebifyOverrideOptions
	: RuWebifyOverrideOptions;

export type WebifyInstance<L extends Language = Language> = {
	(text: string, options?: WebifyOverrideOptionsForLanguage<L>): string;
	with(options: WebifyOverrideOptionsForLanguage<L>): WebifyInstance<L>;
	installStringMethod(): void;
	defaults: Readonly<WebifyOptionsForLanguage<L>>;
};

export type NormalizedWebifyOptions = {
	language: Language;
	mode: Mode;
	hooks: {
		beforeLanguage: readonly WebifyHook[];
		afterLanguage: readonly WebifyHook[];
		beforeSerialize: readonly WebifyHook[];
		afterSerialize: readonly WebifyHook[];
	};
	ru: {
		rules: Required<RuRuleOptions>;
		unbreakables: {
			prefixWords: readonly string[];
			postpositiveParticles: readonly string[];
		};
		abbreviations: {
			final: readonly string[];
			prepositional: readonly string[];
		};
		units: {
			post: readonly string[];
			preNumber: readonly string[];
			operators: readonly string[];
		};
		replacements: readonly TextReplacementRule[];
	};
	en: {
		rules: Required<EnRuleOptions>;
		unbreakables: {
			prefixWords: readonly string[];
		};
		units: {
			post: readonly string[];
			preNumber: readonly string[];
			operators: readonly string[];
		};
		replacements: readonly TextReplacementRule[];
	};
};
