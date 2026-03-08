import type { TupleRule } from '@src/core/contracts/types';
import { makeBindNextWordRule } from '@src/languages/ru/utils/makeBindNextWordRule';

export const RU_NBSP = [
	'\u0432',
	'\u0432\u043e',
	'\u043a',
	'\u043a\u043e',
	'\u0441',
	'\u0441\u043e',
	'\u0443',
	'\u043e',
	'\u043e\u0431',
	'\u043e\u0431\u043e',
	'\u043d\u0430',
	'\u043f\u043e',
	'\u043e\u0442',
	'\u043e\u0442\u043e',
	'\u0434\u043e',
	'\u0437\u0430',
	'\u0438\u0437',
	'\u0438\u0437\u043e',
	'\u0430',
	'\u0438',
	'\u044f',
	'\u043d\u043e',
	'\u0434\u0430',
	'\u043d\u0435',
	'\u043d\u0438',
	'\u0436\u0435',
	'\u043b\u0438',
] as const;

export const RU_BIND_SHORT_WORDS_RULE: TupleRule = makeBindNextWordRule(RU_NBSP);
export const RU_BIND_SHORT_WORDS_AGGRESSIVE_RULE: TupleRule = makeBindNextWordRule([...RU_NBSP]);
