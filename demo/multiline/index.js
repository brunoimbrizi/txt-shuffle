const { shuffle, shuffleLCD, directions, animations } = require('../../index.js');
const { split } = require('canvas-hypertxt');
const Tweakpane = require('tweakpane');

let elPreset;
let canvas, context;
let lines = [];
let linesShuffle = [];
let idxPreset = -1;

// Alice In Chains - Nutshell
let text = `We chase misprinted lies
We face the path of time
And yet I fight, and yet I fight
This battle all alone
No one to cry to
No place to call home`;

// a list of different parameters to demo
const presets = [
	{ fn: 'shuffle', glyphs: '_' },
	{ fn: 'shuffle' },
	{ fn: 'shuffle', glyphs: '▂▄▆', fps: 40 },
	{ fn: 'shuffle', glyphs: 'weruoaszxcvnm', direction: directions.RANDOM },
	{ fn: 'shuffleLCD', fps: 40 },
];

const setup = () => {
	elPreset = document.querySelector('.preset');

	canvas = document.querySelector('canvas');
	context = canvas.getContext('2d');
	context.font = '48px monospace';

	window.addEventListener('resize', resize);
	canvas.addEventListener('click', onCanvasClick);

	resize();
	animate();

	// play first animation
	onCanvasClick();
};

const draw = () => {
	context.fillStyle = '#eee';
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = 'black';
	context.font = '48px monospace';
	context.textBaseline = 'top';

	let x = 20;
	let y = 200;

	linesShuffle.forEach(line => {
		context.fillText(line, x, y);
		y += 60;
	});
};

const playShuffle = () => {
	const preset = presets[idxPreset];
	const fn = eval(preset.fn);

	lines.forEach((line, i) => {
		fn({
			text 			: line,
			delay 		: i * 0.2,
			fps 			: preset.fps,
			glyphs 		: preset.glyphs,
			direction : preset.direction,
			onUpdate 	: (output) => { linesShuffle[i] = output; }
		});
	});
};

const animate = () => {
	requestAnimationFrame(animate);
	draw();
};

const resize = () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// split text into lines again after resizing the canvas
	lines = split(context, text, context.font, canvas.width);
};

const onCanvasClick = () => {
	idxPreset++;
	idxPreset %= presets.length;

	// update ui
	let str = `Example ${idxPreset}`;
	const preset = presets[idxPreset];
	for (const key in preset) {
		str = `${str} ${key}: ${preset[key]}`;
	}
	elPreset.innerText = str;

	playShuffle();
};

setup();
