import './types/string-augmentation';

export { createWebify, installStringWebify, webify } from './webify';
export type {
	EnRuleOptions,
	EnWebifyOptions,
	ReplaceCallback,
	ReplacementRuleListOverride,
	RuRuleOptions,
	RuWebifyOptions,
	StringListOverride,
	TextReplacementRule,
	WebifyHook,
	WebifyHookContext,
	WebifyHooks,
	WebifyInstance,
	WebifyOptions,
	WebifyOverrideOptions,
} from './webify';
export {
	DEFAULT_EN_WEBIFY_OPTIONS,
	DEFAULT_RU_WEBIFY_OPTIONS,
	DEFAULT_WEBIFY_OPTIONS,
} from './webify';
export {
	DEFAULT_EN_REPLACEMENT_RULES,
	EN_ELLIPSIS_REPLACEMENT_RULES,
	EN_SYMBOL_SHORTHAND_REPLACEMENT_RULES,
} from './webify';
export { CHARS } from './config/chars';
export type { Char } from './config/chars';
