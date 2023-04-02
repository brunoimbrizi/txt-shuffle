txt-shuffle
===========

Text shuffling animations [TODO description]

## Install
```
npm install txt-shuffle
```

## Example
```js
const { shuffle } = require('txt-shuffle');

shuffle({ text: 'Hello world', fps: 5, onUpdate: (output) => {
	console.log(output);
} });
```
Output:

```
kE}3 7
Hep|> k|dJ 
Hello GUAo_
Hello worlz
Hello world
```

## Demo
[TODO]

## Usage

#### `shuffle(options)`

- `options`
	- `text` (default `''`) text string
	- `duration` (default `1`) duration of shuffle/resolve animation in seconds
	- `delay` (default `0`) delay to start shuffline
	- `delayResolve` (default `0.2`) delay to start resolving
	- `fps` (default `30`) framerate
	- `glyphs` (see below) glyphs to use in the shuffle animation
	- `animation` (default `show`) possible values: `show`, `hide`, `stay`
	- `direction` (default `right`) possible values: `left`, `right`, `random`
	- `onUpdate` callback function, returns the output string
	- `onComplete` callback function, returns the output string

`glyphs` default 
```
 !#$&%()*+0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuüvwxyz{|}~
```

#### `shuffleLCD(options)`
An attempt to recreate the effect in [LCD 1 by ertdfgcvb](https://lcd.ertdfgcvb.xyz/)

- `options`
	- `text` (default `''`) text string
	- `delay` (default `0`) delay to start shuffline
	- `fps` (default `30`) framerate
	- `glyphs` (see below) glyphs to use in the shuffle animation
	- `animation` (default `show`) possible values: `show`, `hide`, `stay`
	- `stayFrames` (default `25`) max number of frames in the `stay` animation
	- `onUpdate` callback function, returns the output string
	- `onComplete` callback function, returns the output string

`glyphs` default 
```
 \'"“”‘’¹²³!#$&%()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuüvwxyz{|}~½¼¡«»×░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌
```

## License

MIT, see [LICENSE](LICENSE) for details.
