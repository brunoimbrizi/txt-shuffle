const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const eases = require('eases');

const directions = {
	RIGHT				: 'right',
	LEFT 				: 'left',
	RANDOM			: 'random',
};

const animations = {
	SHOW 				: 'show',
	HIDE 				: 'hide',
	STAY 				: 'stay',
};

class CShuffle {
	constructor(params = {}) {
		// create member variables for all params
		for (const key in params) {
			this[key] = params[key];
		}

		this._glyphs 		= this.glyphs.split('');
		this._text 			= this.text.split('');
		this._delta  		= 1000 / this.fps;

		this._now 			= Date.now();
		this._start 		= Date.now();

		this._output		= '';
		this._playhead	= 0;

		// text indices
		this._tindices 	= this._text.map((t, i) => i);

		// flip direction when hiding
		if (this.animation == animations.HIDE) {
			if (this.direction == directions.LEFT) this.direction = directions.RIGHT;
			else if (this.direction == directions.RIGHT) this.direction = directions.LEFT;
		}

		// reverse text indices
		if (this.direction == directions.LEFT) this._tindices.reverse();
		// randomise text indices
		if (this.direction == directions.RANDOM) this._tindices = random.shuffle(this._tindices);


		const _onUpdate = () => {
			if (Date.now() - this._now < this._delta) {
				requestAnimationFrame(_onUpdate);
				return;
			}
			
			let t, output, complete;

			// update playhead
			this._now = Date.now();
			t = (this._now - this._start) * 0.001 / this.duration;
			
			// set progress
			this.progress(t);

			// loop until u reaches 0
			if (this.animation == animations.HIDE) complete = this._playhead <= 0;
			// loop until u reaches 1
			else complete = this._playhead >= 1;

			if (!complete) requestAnimationFrame(_onUpdate);
			else this._output = this.animation == animations.HIDE ? '' : this.text;
			
			if (this.onUpdate) this.onUpdate(this._output);
			if (complete && this.onComplete) this.onComplete(this._output);
		};

		if (this.autoplay) _onUpdate();
	}

	progress(t) {
		const { _tindices, _text, _glyphs } = this;
		const { animation, delay, delayResolve, text } = this;

		let uLen, vLen;
		let glyph, tidx, u, v;
		let output = '';

		// t = linear time
		if (animation == animations.HIDE) t = 1 - t;

		// u = shuffle curve
		// u starts at delay
		u = math.clamp01(t - delay);
		u = eases.quartOut(u);

		// v = resolve curve
		// v starts at u + it's own delay
		v = math.clamp01(t - delay - delayResolve);
		// v duration is deducted from it's delay (increase speed)
		v = v * (1 / (1 - delayResolve));
		v = eases.quadInOut(v);

		uLen = Math.round(u * text.length);
		vLen = Math.round(v * text.length);

		for (let i = 0; i < text.length; i++) {
			tidx = _tindices[i];
			glyph = _text[i];

			if (tidx >= uLen && animation != animations.STAY) glyph = ' ';
			if (glyph != ' ' && tidx >= vLen) glyph = random.pick(_glyphs);

			output = `${output}${glyph}`;
		}

		this._playhead = u;
		this._output = output;

		return output;
	}
}

/*
class CShuffleScroll {
	constructor(params = {}) {
		// create member variables for all params
		for (const key in params) {
			this[key] = params[key];
		}

		this._glyphs 		= this.glyphs.split('');
		this._text 			= this.text.split('');
		this._delta  		= 1000 / this.fps;

		// text indices
		this._tindices 	= this._text.map((t, i) => i);
		// glyph indices
		this._gindices 	= this._glyphs.map((t, i) => i);
		// shuffle indices
		this._sindices 	= this._text.map(t => 0);
		// resolve indices (glyph index for each char in text)
		this._rindices 	= this._text.map(t => this._glyphs.findIndex(g => g == t));

		// when hiding, start shuffling from resolve indices
		if (this.animation == animations.HIDE) this._sindices = this._rindices.concat();
		// on stay, increase shuffle indices by a random value
		if (this.animation == animations.STAY) this._sindices = this._rindices.map(r => math.mod(r - random.rangeFloor(5, this.stayFrames), this._glyphs.length));

		this._now 			= Date.now();
		this._start 		= Date.now();
		this._frame 		= 0;

		let glyph, output, complete, resolved;
		let tidx, sidx, ridx;
		
		const _onUpdate = () => {
			if (Date.now() - _now < _delta) {
				requestAnimationFrame(_onUpdate);
				return;
			}

			_now = Date.now();
			if (_now - _start > delay * 1000) _frame++;

			output = '';
			resolved = 0;

			for (let i = 0; i < text.length; i++) {
				sidx = _sindices[i];
				ridx = _rindices[i];

				// increase shuffle index left to right
				if (animation == animations.SHOW) {
					if (sidx != ridx) {
						if (i < _frame) sidx++;
					}
					else resolved++;
				}
				// decrease shuffle index left to right
				if (animation == animations.HIDE) {
					if (sidx > 0) {
						if (i < _frame) sidx--;
					}
					else resolved++;
				}
				// increase all shuffle indices
				if (animation == animations.STAY) {
					if (sidx != ridx) sidx++;
					else resolved++;
				}

				// get corresponding glyph
				glyph = _glyphs[sidx % _glyphs.length];
				// update shuffle indices array
				_sindices[i] = sidx % _glyphs.length;

				output = `${output}${glyph}`;
			}

			// keep looping until all glyphs are resolved
			complete = resolved >= text.length;

			if (!complete) requestAnimationFrame(_onUpdate);
			else output = animation == animations.HIDE ? '' : text;
			
			if (onUpdate) onUpdate(output);
			if (complete && onComplete) onComplete(output);
		};

		_onUpdate();
	}
}
*/









/**
 * Starts a text shuffle animation in two tiers.
 * First shuffling through random characters and then resolving into the target text.
 *
 * text 							- target text string
 * duration 					- duration of shuffle/resolve animation in seconds
 * delay 							- delay to start shuffling
 * delayResolve 			- delay to start resolving
 * fps 								- framerate
 * glyphs 						- glyphs to use in the shuffle animation
 * animation 					- possible values: `show`, `hide`, `stay`
 * direction 					- possible values: `left`, `right`, `random`
 * onUpdate 					- callback function, returns the output string
 * onComplete					- callback function, returns the output string
 * autoplay						- when `false` use `shuffleInstance.progress(t)` to control the animation
 */
const shuffle = ({
	text 					= '',
	duration 			= 1,
	delay 				= 0,
	delayResolve 	= 0.2,
	fps 					= 60,
	glyphs 				= ' !#$&%()*+0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuüvwxyz{|}~',
	animation 		= animations.SHOW,
	direction 		= directions.RIGHT,
	onUpdate 			= null,
	onComplete 		= null,
	autoplay 			= true,
} = {}) => {
	return new CShuffle({ text, duration, delay, delayResolve, fps, glyphs, animation, direction, onUpdate, onComplete, autoplay });
}

/**
 * Starts a text shuffle animation inspired by https://lcd.ertdfgcvb.xyz/
 * It goes through every character in `glyphs` until it finds a match in the target text.
 *
 * text 							- target text string
 * delay 							- delay to start shuffling
 * fps 								- framerate
 * glyphs 						- glyphs to use in the shuffle animation
 * animation 					- possible values: `show`, `hide`, `stay`
 * stayFrames 				- max number of frames in the `stay` animation
 * onUpdate 					- callback function, returns the output string
 * onComplete					- callback function, returns the output string
 * autoplay						- when `false` use `shuffleInstance.progress(t)` to control the animation
 */

const shuffleScroll = ({
	text 					= '',
	delay 				= 0,
	fps 					= 60,
	glyphs 				= ' \'"“”‘’¹²³!#$&%()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuüvwxyz{|}~½¼¡«»×░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌',
	animation 		= animations.SHOW,
	stayFrames 		= 25,
	onUpdate 			= null,
	onComplete 		= null,
} = {}) => {
	const _glyphs = glyphs.split('');
	const _text 	= text.split('');
	const _delta  = 1000 / fps;

	// text indices
	let _tindices = _text.map((t, i) => i);
	// glyph indices
	let _gindices = _glyphs.map((t, i) => i);
	// shuffle indices
	let _sindices = _text.map(t => 0);
	// resolve indices (glyph index for each char in text)
	let _rindices = _text.map(t => _glyphs.findIndex(g => g == t));

	// when hiding, start shuffling from resolve indices
	if (animation == animations.HIDE) _sindices = _rindices.concat();
	// on stay, increase shuffle indices by a random value
	if (animation == animations.STAY) _sindices = _rindices.map(r => math.mod(r - random.rangeFloor(5, stayFrames), _glyphs.length));

	let _now 			= Date.now();
	let _start 		= Date.now();
	let _frame 		= 0;

	let glyph, output, complete, resolved;
	let tidx, sidx, ridx;
	
	const _onUpdate = () => {
		if (Date.now() - _now < _delta) {
			requestAnimationFrame(_onUpdate);
			return;
		}

		_now = Date.now();
		if (_now - _start > delay * 1000) _frame++;

		output = '';
		resolved = 0;

		for (let i = 0; i < text.length; i++) {
			sidx = _sindices[i];
			ridx = _rindices[i];

			// increase shuffle index left to right
			if (animation == animations.SHOW) {
				if (sidx != ridx) {
					if (i < _frame) sidx++;
				}
				else resolved++;
			}
			// decrease shuffle index left to right
			if (animation == animations.HIDE) {
				if (sidx > 0) {
					if (i < _frame) sidx--;
				}
				else resolved++;
			}
			// increase all shuffle indices
			if (animation == animations.STAY) {
				if (sidx != ridx) sidx++;
				else resolved++;
			}

			// get corresponding glyph
			glyph = _glyphs[sidx % _glyphs.length];
			// update shuffle indices array
			_sindices[i] = sidx % _glyphs.length;

			output = `${output}${glyph}`;
		}

		// keep looping until all glyphs are resolved
		complete = resolved >= text.length;

		if (!complete) requestAnimationFrame(_onUpdate);
		else output = animation == animations.HIDE ? '' : text;
		
		if (onUpdate) onUpdate(output);
		if (complete && onComplete) onComplete(output);
	};

	_onUpdate();
}


module.exports = {
	animations,
	directions,
	shuffle,
	shuffleScroll,
};
