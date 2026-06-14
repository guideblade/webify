// DATA ONLY
import { MODE_HTML_ENTITIES } from '@config/modes';
import { LANG_EN } from '@src/config/languages';

export const config = {
	mode: MODE_HTML_ENTITIES,
	language: LANG_EN,
} as const;

export const cases: Array<[string, string]> = [
	[
		'Gosh, think of the headline: "Hero cop killed by savage fox!"',
		'Gosh, think of&nbsp;the&nbsp;headline: &ldquo;Hero cop killed by&nbsp;savage fox!&rdquo;',
	],
	['16" vinyl, 6\'2" tall', '16&Prime; vinyl, 6&prime;2&Prime; tall'],
	['9½" cable, 4\'11⅛" length', '9½&Prime; cable, 4&prime;11⅛&Prime; length'],
	['Series "X120"', 'Series &ldquo;X120&rdquo;'],
	["Phone 4's screen is scratched.", 'Phone 4&#8217;s screen is scratched.'],
	[
		"Send 'em in. Salt 'n' pepper. 'Til it's done.",
		'Send &#8217;em in. Salt &#8217;n&#8217; pepper. &#8217;Til it&#8217;s done.',
	],
	["'92 felt fast. (The whole '90s did.)", '&#8217;92 felt fast. (The&nbsp;whole &#8217;90s did.)'],
	[
		'The "small" package is 10" wide, shipped in the \'90s.',
		'The&nbsp;&ldquo;small&rdquo; package is 10&Prime; wide, shipped in&nbsp;the&nbsp;&#8217;90s.',
	],
	["I can't believe it failed.", 'I can&#8217;t believe it failed.'],
	['30" "notes in quotes".', '30&Prime; &ldquo;notes in&nbsp;quotes&rdquo;.'],
	['Hold... and proceed.', 'Hold&hellip;&nbsp;and proceed.'],
	['A. B. C. Anderson approved it.', 'A.&thinsp;B.&thinsp;C.&nbsp;Anderson approved it.'],
	['Hi. UX. UI. Test.', 'Hi. UX. UI. Test.'],
	['Max speed is 55 mph.', 'Max speed is 55&nbsp;mph.'],
	['Tompson and Mike (TM)', 'Tompson and Mike (TM)'],
	['Desk # 12 is reserved.', 'Desk #&nbsp;12 is reserved.'],
	['Reading dropped to -8 °F.', 'Reading dropped to&nbsp;-8&nbsp;&deg;F.'],
	[
		`I couldn't wait for you to come and clear the cupboards`,
		'I couldn&#8217;t wait for you to&nbsp;come and clear the&nbsp;cupboards',
	],
	['Visit "https://ab-c.com".', 'Visit &ldquo;https://ab-c.com&rdquo;.'],
	['Find www.ab-c.com, then leave.', 'Find www.ab-c.com, then leave.'],
	['Write to a-b@test-mail.com.', 'Write to&nbsp;a-b@test-mail.com.'],
	['Open ab-c.com now.', 'Open ab-c.com now.'],
];
