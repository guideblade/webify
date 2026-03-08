import { CHARS } from '@src/config/chars';
import type { TupleRule } from '../contracts/options';
import { makeAlternation } from './makeAlternation';

export function makeBindNextWordRule(words: readonly string[]): TupleRule {
	const alt = makeAlternation(words);
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
			'giu',
		),
		`$1${CHARS.NBSP.unicode}`,
	] as const;
}
