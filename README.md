# Webify

Webify formats plain text with proper web typography.
It fixes issues like incorrect quotes and dashes, prevents awkward line breaks, and supports English and Russian.

## Install

```bash
npm install @guideblade/webify
```

## Examples

Webify provides three functions: `webify()`, `createWebify()`, and `installStringWebify()`.

### Russian

#### webify()

```ts
import { webify } from '@guideblade/webify';

const text = webify('И даже то, что быть не может, однажды тоже может быть.', {
	language: 'ru',
	mode: 'html-entities',
});
console.log(text); // --> И&nbsp;даже&nbsp;то, что быть не&nbsp;может, однажды тоже может быть.
```

#### createWebify()

```ts
import { createWebify } from '@guideblade/webify';

const myWebify = createWebify({ language: 'ru', mode: 'html-entities' });
const text = myWebify('Буфер не бесконечный.');
console.log(text); // --> Буфер не&nbsp;бесконечный.
```

#### installStringWebify()

```ts
import { installStringWebify } from '@guideblade/webify';

installStringWebify({ language: 'ru', mode: 'html-entities' });
console.log(
	`Для этого мы подключаем потенциальных работодателей еще на третьем-четвертом курсе", - прокомментировал ректор...`.webify(),
); // --> Для этого мы&nbsp;подключаем потенциальных работодателей еще на&nbsp;третьем&#8209;четвертом курсе&raquo;,&nbsp;&mdash; прокомментировал ректор&hellip;
```

### English

Default mode is `unicode`, which outputs literal characters.

#### webify()

```ts
import { webify } from '@guideblade/webify';

const text = webify(`Gosh, think of the headline: "Hero cop killed by savage fox!"`, { language: 'en' });
console.log(text); // --> Gosh, think of the headline: “Hero cop killed by savage fox!”
```

#### createWebify()

```ts
import { createWebify } from '@guideblade/webify';

const myWebify = createWebify({ language: 'en' });
const text = myWebify("We shouldn't rush.");
console.log(text); // --> We shouldn’t rush.
```

#### installStringWebify()

```ts
import { installStringWebify } from '@guideblade/webify';

installStringWebify({ language: 'en' });
console.log(`I couldn't wait for you to come and clear the cupboards`.webify()); // --> I couldn’t wait for you to come and clear the cupboards
```
