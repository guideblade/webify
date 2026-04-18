import { CHARS } from '@src/config/chars';
import type { TupleRule } from '../contracts/options';
import { makeAlternation } from './makeAlternation';

function capitalizeWord(word: string): string {
	if (word.length === 0) {
		return word;
	}

	return `${word[0]!.toUpperCase()}${word.slice(1)}`;
}

function buildAlternation(words: readonly string[]): string {
	const variants = new Set(words);

	for (const word of words) {
		variants.add(capitalizeWord(word));
	}

	return makeAlternation([...variants]);
}

export function makeBindNextWordRule(words: readonly string[]): TupleRule {
	const alt = buildAlternation(words);
	const followingTokenClass = [
		'\\p{L}',
		'\\p{N}',
		'"',
		"'",
		'\\(',
		'\\[',
		CHARS.LAQUO.unicode,
		CHARS.LEFT_DOUBLE_QUOTE.unicode,
		CHARS.LOW_DOUBLE_QUOTE.unicode,
		CHARS.LEFT_SINGLE_QUOTE.unicode,
		CHARS.RIGHT_SINGLE_QUOTE.unicode,
	].join('');

	return [
		new RegExp(
			`(?<![\\p{L}\\p{N}_${CHARS.NBHYPHEN.unicode}])(${alt})\\s+(?=[${followingTokenClass}])`,
			'gu',
		),
		`$1${CHARS.NBSP.unicode}`,
	] as const;
}
