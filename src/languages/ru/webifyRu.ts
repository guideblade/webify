import type { NormalizedWebifyOptions } from '@src/core/contracts/options';
import { applyReplacementRules } from '@src/core/replacements';
import {
	applyRuAbbreviationRules,
	applyRuQuoteRules,
	applyRuUnbreakableRules,
	applyRuUnitRules,
} from '@src/languages/ru/rules';
import { decodeKnownEntities } from '@src/languages/ru/utils/decodeKnownEntities';

export function webifyRu(text: string, config: NormalizedWebifyOptions['ru']): string {
	let result = text;

	if (config.rules.decodeKnownEntities) {
		result = decodeKnownEntities(result);
	}

	if (config.rules.replacements) {
		result = applyReplacementRules(result, config.replacements);
	}

	if (config.rules.quotes) {
		result = applyRuQuoteRules(result);
	}

	if (config.rules.unbreakables) {
		result = applyRuUnbreakableRules(result, config.unbreakables);
	}

	if (config.rules.abbreviations) {
		result = applyRuAbbreviationRules(result, config.abbreviations);
	}

	if (config.rules.units) {
		result = applyRuUnitRules(result, config.units);
	}

	return result;
}
