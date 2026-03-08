import { CHARS } from '@src/config/chars';
import { makeAlternation } from '@src/core/text/makeAlternation';
import { makeBindPreNumberRule } from '@src/core/text/makeBindPreNumberRule';

const NUMBER_PATTERN = String.raw`(?:\d[\d.,]*|\b[IVXLCDM]+\b)`;

type EnUnitConfig = {
	post: readonly string[];
	preNumber: readonly string[];
	operators: readonly string[];
};

export function applyEnUnitRules(text: string, config: EnUnitConfig): string {
	const simpleUnitPattern = `(?:${makeAlternation(config.post)})`;
	const unitOperatorPattern = `(?:${makeAlternation(config.operators)})`;
	const compoundUnitPattern = `${simpleUnitPattern}(?:\\s*${unitOperatorPattern}\\s*${simpleUnitPattern})*`;
	const bindPreNumberUnitsRule = makeBindPreNumberRule(config.preNumber);
	const postUnitsPattern = new RegExp(
		`(${NUMBER_PATTERN})\\s+(${compoundUnitPattern})(?=$|[^\\p{L}\\p{N}_])`,
		'giu',
	);

	const withPostUnits = text.replace(postUnitsPattern, (_match, number: string, unit: string) => {
		const normalizedUnit = unit.replace(new RegExp(`\\s*(${unitOperatorPattern})\\s*`, 'gu'), '$1');
		return `${number}${CHARS.NBSP.unicode}${normalizedUnit}`;
	});

	return withPostUnits.replace(bindPreNumberUnitsRule[0], bindPreNumberUnitsRule[1]);
}
