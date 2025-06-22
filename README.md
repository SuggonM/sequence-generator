# sequence-generator
Iterate through character sets using "principle of shortest length"

This is a simple generator that yields alphanumeric strings `[0-9a-zA-Z]` in an increasing order of length, meaning it will yield all combinations of characters for a given length before moving on to the next length.

The algorithm was inspired by css `@counter-style` ([demo here](https://codepen.io/Suggon/pen/pvJxpmx)), and same pattern can also be found in JS minifiers that convert the variable names into shortest length.

This can be useful for cases where you need a sequence of unique alphanumeric strings, and order matters. One example is assigning short IDs (identifiers) to each entity. Another use case is in the command line, where the size of a command cannot exceed `8191` characters[^1].

[^1]: https://learn.microsoft.com/en-us/troubleshoot/windows-client/shell-experience/command-line-string-limitation#more-information

The generator is 100% [lazy](https://github.com/tc39/proposal-iterator-helpers#why-not-use-arrayfrom--arrayprototype-methods) (~~just like me~~), thus no memory is allocated to store the entire sequence. It simply yields the immediate next value without having to memorize past or future values.

## Installation
```bash
npm install sequence-gen
```

## Simple Usage
The package is an [ES6 class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) with the following exports:
- `Sequence`: The class itself; used for generator [fine-tuning](#advanced-usage)
- `sequence`: A readymade generator function created with default options
	- `minLength`: Minimum character length to generate; default is `1`
	- `maxLength`: Maximum character length to generate; default is `Infinity`

```js
import sequence from 'sequence-generator';

// 0 … 9, a … z, A … Z, 00 … ZZ, 000 … ZZZ, 0000 ……
const infiniteGen = sequence();

// 0 … 9, a … z, A … Z
const finiteGen = sequence({ maxLength: 1 });

// 00 … ZZ, 000 … ZZZ, 0000 ……
const startFrom2 = sequence({ minLength: 2 });

// 000 … ZZZ
const threeCharSequence = sequence({ minLength: 3, maxLength: 3 });
```

Further examples can be found in [#Advanced Usage](#advanced-usage).

## Math Details
To calculate the number of "combinations" (well mathematically, it's a [different term](https://www.statskingdom.com/combinations-calculator.html#:~:text=Permutations%20with%0Arepetitions%20formula)) for a fixed character length:
```math
Combinations = n^r
```
where, $n$ = no. of characters in a cycle, and $r$ = length of the string

But since the string length is increasing, we find the ***total*** of all combinations:
```math
\sum^R_{r=1} n^r = n^1 + n^2 + n^3 + \ldots + n^R
```

Visualizing the above formula to find iterator size for different `maxLength`s:
```lua
                     62^1 = 62       <= maxLength: 1
              62^1 + 62^2 = 3906     <= maxLength: 2
       62^1 + 62^2 + 62^3 = 242234   <= maxLength: 3
62^1 + 62^2 + 62^3 + 62^4 = 15018570 <= maxLength: 4
and so on...
```
(`62` is the number of characters in the default character set)

Thus as far as size efficiency goes, one shouldn't need a character `maxLength` greater than `3` for most practical applications. Again, that wouldn't make much difference since the default `maxLength` is `Infinity` anyway.

## Advanced Usage
### Customizing Character Set
By default, the generator cycles through 62 alphanumeric characters `[0-9a-zA-Z]`. Since the `Sequence` export is an ES6 class which is well-known for extensibility, the internal character set can easily be customized. Simply inspect the [source code](https://github.com/SuggonM/sequence-generator/blob/main/index.js) and pick one among `numbers`, `lowers`, `uppers` or `charSet` to override.

```js
import { Sequence } from 'sequence-generator';

class AlphabetsOnly extends Sequence {
	*numbers() { return; } // nullify number charset
}

const alphabets = new AlphabetsOnly().sequence();
console.log(alphabets.next().value); // 'a' - no numbers, only letters
```

```js
class MoreLetters extends Sequence {
	*lowers() {
		yield '_';             // prepend an underscore
		yield* super.lowers(); // include all letters from super class
		yield '💯';            // append a cool emoji
	}
}
```

```js
class MyOwnCharset extends Sequence {
	*charSet() {
		yield* ['a', 'b', 'c', 'd', 'e']; // a b c d e aa ab ac ad ae ba bb bc bd be
	}
}
```

### Limiting the Iterator
An iterator created without `maxLength` is infinite, but in cases where a fixed number of iterations is needed (say, exactly 500), [iterator helpers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator#instance_methods) implements [`Iterator.prototype.take()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator/take) (and many other generator manipulation methods) that can help achieve the desired result.
```js
import sequence from 'sequence-generator';

let lastID;
for (const id of sequence().take(62)) {
	lastID = id;
}
console.log(lastID); // Z
```
