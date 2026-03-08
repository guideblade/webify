// TYPE AND DATA ONLY
export type Char = {
	unicode: string;
	entity: string;
};

export const CHARS = {
	NBSP: { unicode: '\u00A0', entity: '&nbsp;' },
	NBHYPHEN: { unicode: '\u2011', entity: '&#8209;' },
	THINSP: { unicode: '\u2009', entity: '&thinsp;' },
	MDASH: { unicode: '\u2014', entity: '&mdash;' },
	HELLIP: { unicode: '\u2026', entity: '&hellip;' },
	SECTION: { unicode: '\u00A7', entity: '&sect;' },
	COPYRIGHT: { unicode: '\u00A9', entity: '&copy;' },
	REGISTERED: { unicode: '\u00AE', entity: '&reg;' },
	TRADEMARK: { unicode: '\u2122', entity: '&trade;' },
	DEGREE: { unicode: '\u00B0', entity: '&deg;' },
	LAQUO: { unicode: '\u00AB', entity: '&laquo;' },
	RAQUO: { unicode: '\u00BB', entity: '&raquo;' },
	LEFT_SINGLE_QUOTE: { unicode: '\u2018', entity: '&lsquo;' },
	RIGHT_SINGLE_QUOTE: { unicode: '\u2019', entity: '&#8217;' },
	APOSTROPHE: { unicode: '\u2019', entity: '&#8217;' },
	LOW_DOUBLE_QUOTE: { unicode: '\u201E', entity: '&bdquo;' },
	LEFT_DOUBLE_QUOTE: { unicode: '\u201C', entity: '&ldquo;' },
	RIGHT_DOUBLE_QUOTE: { unicode: '\u201D', entity: '&rdquo;' },
	BULLET: { unicode: '\u2022', entity: '&bull;' },
	NDASH: { unicode: '\u2013', entity: '&ndash;' },
	MINUS: { unicode: '\u2212', entity: '&minus;' },
	PLUS_MINUS: { unicode: '\u00B1', entity: '&plusmn;' },
	NUMERO: { unicode: '\u2116', entity: '&#8470;' },
	PRIME: { unicode: '\u2032', entity: '&prime;' },
	DOUBLE_PRIME: { unicode: '\u2033', entity: '&Prime;' },
	MIDDOT: { unicode: '\u00B7', entity: '&middot;' },
	MULTIPLY: { unicode: '\u00D7', entity: '&times;' },
	DIVIDE: { unicode: '\u00F7', entity: '&divide;' },
} as const satisfies Record<string, Char>;
