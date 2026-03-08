import type { TextReplacementRule } from './contracts/options';

const MAX_STABILITY_PASSES = 25;

function getPriority(rule: TextReplacementRule): number {
	return rule.priority ?? 0;
}

function getPatternWeight(rule: TextReplacementRule): number {
	return rule.pattern.source.length;
}

export function sortReplacementRules(rules: readonly TextReplacementRule[]): TextReplacementRule[] {
	return rules
		.map((rule, index) => ({ rule, index }))
		.sort((left, right) => {
			const priorityDelta = getPriority(right.rule) - getPriority(left.rule);
			if (priorityDelta !== 0) {
				return priorityDelta;
			}

			const weightDelta = getPatternWeight(right.rule) - getPatternWeight(left.rule);
			if (weightDelta !== 0) {
				return weightDelta;
			}

			return left.index - right.index;
		})
		.map(({ rule }) => rule);
}

export function applyReplacementRules(text: string, rules: readonly TextReplacementRule[]): string {
	let result = text;

	for (const rule of sortReplacementRules(rules)) {
		const replacer = rule.replace;

		if (rule.repeatUntilStable) {
			let passCount = 0;
			let previous = result;
			let next =
				typeof replacer === 'string'
					? previous.replace(rule.pattern, replacer)
					: previous.replace(rule.pattern, replacer);

			while (next !== previous) {
				passCount += 1;
				if (passCount > MAX_STABILITY_PASSES) {
					throw new Error('webify replacement rule did not stabilize');
				}

				previous = next;
				next =
					typeof replacer === 'string'
						? previous.replace(rule.pattern, replacer)
						: previous.replace(rule.pattern, replacer);
			}

			result = next;
			continue;
		}

		result =
			typeof replacer === 'string'
				? result.replace(rule.pattern, replacer)
				: result.replace(rule.pattern, replacer);
	}

	return result;
}
