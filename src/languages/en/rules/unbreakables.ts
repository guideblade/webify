import { makeBindNextWordRule } from '@src/core/text/makeBindNextWordRule';

type EnUnbreakableConfig = {
	prefixWords: readonly string[];
};

export function applyEnUnbreakableRules(text: string, config: EnUnbreakableConfig): string {
	const bindPrefixWordsRule = makeBindNextWordRule(config.prefixWords);
	return text.replace(bindPrefixWordsRule[0], bindPrefixWordsRule[1]);
}
