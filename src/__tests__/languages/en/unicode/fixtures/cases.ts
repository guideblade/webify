// DATA ONLY
import { MODE_UNICODE } from '@config/modes';
import { LANG_EN } from '@src/config/languages';

export const config = {
	mode: MODE_UNICODE,
	language: LANG_EN,
} as const;

export const cases: Array<[string, string]> = [
	[
		'Gosh, think of the headline: "Hero cop killed by savage fox!"',
		'Gosh, think of the headline: “Hero cop killed by savage fox!”',
	],
	['16" vinyl, 6\'2" tall', '16″ vinyl, 6′2″ tall'],
	['9½" cable, 4\'11⅛" length', '9½″ cable, 4′11⅛″ length'],
	['Series "X120"', 'Series “X120”'],
	["Phone 4's screen is scratched.", 'Phone 4’s screen is scratched.'],
	["Send 'em in. Salt 'n' pepper. 'Til it's done.", 'Send ’em in. Salt ’n’ pepper. ’Til it’s done.'],
	["'92 felt fast. (The whole '90s did.)", '’92 felt fast. (The whole ’90s did.)'],
	[
		'The "small" package is 10" wide, shipped in the \'90s.',
		'The “small” package is 10″ wide, shipped in the ’90s.',
	],
	["I can't believe it failed.", 'I can’t believe it failed.'],
	['30" "notes in quotes".', '30″ “notes in quotes”.'],
	['Hold... and proceed.', 'Hold… and proceed.'],
	['A. B. C. Anderson approved it.', 'A. B. C. Anderson approved it.'],
	['Hi. UX. UI. Test.', 'Hi. UX. UI. Test.'],
	['Max speed is 55 mph.', 'Max speed is 55 mph.'],
	['Tompson and Mike (TM)', 'Tompson and Mike (TM)'],
	['Desk # 12 is reserved.', 'Desk # 12 is reserved.'],
	['Reading dropped to -8 °F.', 'Reading dropped to -8 °F.'],
	["We shouldn't rush.", 'We shouldn’t rush.'],
	[
		`I couldn't wait for you to come and clear the cupboards`,
		'I couldn’t wait for you to come and clear the cupboards',
	],
	['Visit "https://ab-c.com".', 'Visit “https://ab-c.com”.'],
	['Find www.ab-c.com, then leave.', 'Find www.ab-c.com, then leave.'],
	['Write to a-b@test-mail.com.', 'Write to a-b@test-mail.com.'],
	['Open ab-c.com now.', 'Open ab-c.com now.'],
];
