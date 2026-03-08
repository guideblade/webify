import {
	ADDRESS_PREFIX_TERMS,
	EXTRA_PRONOUN_PREFIX_TERMS,
	SPECIAL_PREFIX_TERMS,
} from '@src/languages/ru/data/unbreakables';
import { makeBindNextWordRule } from '@src/languages/ru/utils/makeBindNextWordRule';
import { makeBindPreviousWordRule } from '@src/languages/ru/utils/makeBindPreviousWordRule';

type RuUnbreakableConfig = {
	prefixWords: readonly string[];
	postpositiveParticles: readonly string[];
};

export function applyRuUnbreakableRules(text: string, config: RuUnbreakableConfig): string {
	const bindUnbreakablePrefixWordsRule = makeBindNextWordRule(config.prefixWords);
	const bindAddressPrefixTermsRule = makeBindNextWordRule(ADDRESS_PREFIX_TERMS);
	const bindExtraPronounTermsRule = makeBindNextWordRule(EXTRA_PRONOUN_PREFIX_TERMS);
	const bindSpecialPrefixTermsRule = makeBindNextWordRule(SPECIAL_PREFIX_TERMS);
	const bindPostpositiveParticlesRule = makeBindPreviousWordRule(config.postpositiveParticles);

	return text
		.replace(bindUnbreakablePrefixWordsRule[0], bindUnbreakablePrefixWordsRule[1])
		.replace(bindAddressPrefixTermsRule[0], bindAddressPrefixTermsRule[1])
		.replace(bindExtraPronounTermsRule[0], bindExtraPronounTermsRule[1])
		.replace(bindSpecialPrefixTermsRule[0], bindSpecialPrefixTermsRule[1])
		.replace(bindPostpositiveParticlesRule[0], bindPostpositiveParticlesRule[1]);
}
