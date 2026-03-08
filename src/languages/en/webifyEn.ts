import { decodeKnownEntities } from '@src/core/text/decodeKnownEntities';
import type { NormalizedWebifyOptions } from '@src/core/contracts/options';
import { applyReplacementRules } from '@src/core/replacements';
import { applySmartPunctuation } from './smartPunctuation';
import { applyEnLayoutRules, applyEnUnbreakableRules, applyEnUnitRules } from './rules';

export function webifyEn(text: string, config: NormalizedWebifyOptions['en']): string {
	let result = text;

	if (config.rules.decodeKnownEntities) {
		result = decodeKnownEntities(result);
	}

	if (config.rules.replacements) {
		result = applyReplacementRules(result, config.replacements);
	}

	if (config.rules.smartPunctuation) {
		result = applySmartPunctuation(result);
	}

	if (config.rules.layout) {
		result = applyEnLayoutRules(result);
	}

	if (config.rules.unbreakables) {
		result = applyEnUnbreakableRules(result, config.unbreakables);
	}

	if (config.rules.units) {
		result = applyEnUnitRules(result, config.units);
	}

	return result;
}
