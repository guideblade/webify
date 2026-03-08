// DATA ONLY
import { LANG_EN, LANG_RU } from './languages';
import { MODE_UNICODE } from './modes';
import type { EnWebifyOptions, RuWebifyOptions } from '../core/contracts/options';
import {
	FINAL_ABBREVIATIONS,
	POST_UNITS as RU_POST_UNITS,
	POSTPOSITIVE_PARTICLES,
	PRE_NUMBER_UNITS as RU_PRE_NUMBER_UNITS,
	PREPOSITIONAL_ABBREVIATIONS,
	UNIT_OPERATORS as RU_UNIT_OPERATORS,
	UNBREAKABLE_PREFIX_WORDS,
} from '../languages/ru/data';
import {
	POST_UNITS as EN_POST_UNITS,
	PRE_NUMBER_UNITS as EN_PRE_NUMBER_UNITS,
	UNIT_OPERATORS as EN_UNIT_OPERATORS,
	UNBREAKABLE_PREFIX_WORDS as EN_UNBREAKABLE_PREFIX_WORDS,
} from '../languages/en/data';
import { DEFAULT_EN_REPLACEMENT_RULES } from '../languages/en/normalize';
import { DEFAULT_RU_REPLACEMENT_RULES } from '../languages/ru/rules/replacements';

export const DEFAULT_RU_WEBIFY_OPTIONS = {
	language: LANG_RU,
	mode: MODE_UNICODE,
	hooks: {
		beforeLanguage: [],
		afterLanguage: [],
		beforeSerialize: [],
		afterSerialize: [],
	},
	rules: {
		decodeKnownEntities: true,
		replacements: true,
		quotes: true,
		unbreakables: true,
		abbreviations: true,
		units: true,
	},
	unbreakables: {
		prefixWords: { replace: UNBREAKABLE_PREFIX_WORDS },
		postpositiveParticles: { replace: POSTPOSITIVE_PARTICLES },
	},
	abbreviations: {
		final: { replace: FINAL_ABBREVIATIONS },
		prepositional: { replace: PREPOSITIONAL_ABBREVIATIONS },
	},
	units: {
		post: { replace: RU_POST_UNITS },
		preNumber: { replace: RU_PRE_NUMBER_UNITS },
		operators: { replace: RU_UNIT_OPERATORS },
	},
	replacements: {
		replace: DEFAULT_RU_REPLACEMENT_RULES,
		extend: [],
	},
} as const satisfies RuWebifyOptions;

export const DEFAULT_EN_WEBIFY_OPTIONS = {
	language: LANG_EN,
	mode: MODE_UNICODE,
	hooks: {
		beforeLanguage: [],
		afterLanguage: [],
		beforeSerialize: [],
		afterSerialize: [],
	},
	rules: {
		decodeKnownEntities: true,
		replacements: true,
		smartPunctuation: true,
		layout: true,
		unbreakables: true,
		units: true,
	},
	unbreakables: {
		prefixWords: { replace: EN_UNBREAKABLE_PREFIX_WORDS },
	},
	units: {
		post: { replace: EN_POST_UNITS },
		preNumber: { replace: EN_PRE_NUMBER_UNITS },
		operators: { replace: EN_UNIT_OPERATORS },
	},
	replacements: {
		replace: DEFAULT_EN_REPLACEMENT_RULES,
		extend: [],
	},
} as const satisfies EnWebifyOptions;

export const DEFAULT_WEBIFY_OPTIONS = DEFAULT_RU_WEBIFY_OPTIONS;
