import { CHARS } from '@src/config/chars';

const DASH_SPACING_PATTERN = /(?<=[\p{L}\p{N}\p{Po}\p{Pf}"'])\s+([—–])\s+(?=\S)/gu;
const ELLIPSIS_GLUE_PATTERN = /(…)\s+(?=[\p{L}\p{N}])/gu;
const NEGATIVE_NUMBER_PATTERN = /(?<!\d)\s+-(\d+)/g;
const INITIAL_TO_INITIAL_PATTERN = /(?<![\p{L}\p{N}_])(\p{Lu}\.)\s*(?=\p{Lu}\.)/gu;
const INITIAL_TO_SURNAME_PATTERN = /(?<![\p{L}\p{N}_])(\p{Lu}\.)\s*(?=\p{Lu}\p{L}{1,})/gu;
const SURNAME_TO_INITIAL_PATTERN = /(\p{Lu}\p{L}{2,})\s+(?=\p{Lu}\.)/gu;

export function applyEnLayoutRules(text: string): string {
	let result = text;

	result = result.replace(DASH_SPACING_PATTERN, '$1');
	result = result.replace(ELLIPSIS_GLUE_PATTERN, `$1${CHARS.NBSP.unicode}`);
	result = result.replace(NEGATIVE_NUMBER_PATTERN, `${CHARS.NBSP.unicode}-$1`);
	result = result.replace(INITIAL_TO_INITIAL_PATTERN, `$1${CHARS.THINSP.unicode}`);
	result = result.replace(INITIAL_TO_SURNAME_PATTERN, `$1${CHARS.NBSP.unicode}`);
	result = result.replace(SURNAME_TO_INITIAL_PATTERN, `$1${CHARS.NBSP.unicode}`);

	return result;
}
