import { CHARS } from '@src/config/chars';
import type { TupleRule } from '../contracts/options';
import { makeAlternation } from './makeAlternation';

export function makeBindPreviousWordRule(words: readonly string[]): TupleRule {
	const alt = makeAlternation(words);

	return [
		new RegExp(`(?<=[\\p{L}\\p{N}${CHARS.NBHYPHEN.unicode}])\\s+(${alt})(?=$|[^\\p{L}\\p{N}_])`, 'giu'),
		`${CHARS.NBSP.unicode}$1`,
	] as const;
}
