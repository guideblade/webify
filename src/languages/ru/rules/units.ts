import { CHARS } from '@src/config/chars';
import { makeBindPreNumberRule } from '@src/languages/ru/utils/makeBindPreNumberRule';
import { makeAlternation } from '@src/languages/ru/utils/makeAlternation';

const NUMBER_PATTERN = String.raw`(?:\d[\d.,]*|\b[IVXLCDM]+\b)`;
const DIGIT_NUMBER_PATTERN = String.raw`\d[\d.,]*`;

function countDigits(value: string): number {
	return value.replace(/\D/g, '').length;
}

function countLetters(value: string): number {
	return Array.from(value).length;
}

type RuUnitConfig = {
	post: readonly string[];
	preNumber: readonly string[];
	operators: readonly string[];
};

export function applyRuUnitRules(text: string, config: RuUnitConfig): string {
	const simpleUnitPattern = `(?:${makeAlternation(config.post)})`;
	const unitOperatorPattern = `(?:${makeAlternation(config.operators)})`;
	const compoundUnitPattern = `${simpleUnitPattern}(?:\\s*${unitOperatorPattern}\\s*${simpleUnitPattern})*`;
	const bindPreNumberUnitsRule = makeBindPreNumberRule(config.preNumber);
	const shortNumberWordPattern = new RegExp(
		`(${DIGIT_NUMBER_PATTERN}) +(\\p{L}+)(?!\\.)(?=$|[^\\p{L}\\p{N}_])`,
		'giu',
	);
	const postUnitsPattern = new RegExp(
		`(${NUMBER_PATTERN})\\s+(${compoundUnitPattern})(?=$|[^\\p{L}\\p{N}_])`,
		'giu',
	);

	const withPostUnits = text.replace(postUnitsPattern, (_match, number: string, unit: string) => {
		if (!/\d$/u.test(number)) {
			return `${number} ${unit}`;
		}

		const normalizedUnit = unit.replace(new RegExp(`\\s*(${unitOperatorPattern})\\s*`, 'gu'), '$1');
		return `${number}${CHARS.NBSP.unicode}${normalizedUnit}`;
	});

	const withPreNumberUnits = withPostUnits.replace(bindPreNumberUnitsRule[0], bindPreNumberUnitsRule[1]);

	return withPreNumberUnits.replace(shortNumberWordPattern, (_match, number: string, word: string) => {
		if (!/\d$/u.test(number)) {
			return `${number} ${word}`;
		}

		if (countDigits(number) <= 2 || countLetters(word) <= 2) {
			return `${number}${CHARS.NBSP.unicode}${word}`;
		}

		return `${number} ${word}`;
	});
}
