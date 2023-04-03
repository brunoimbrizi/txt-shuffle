const { shuffle, shuffleScroll, directions, animations } = require('../../index.js');
const Tweakpane = require('tweakpane');

const paramsA = {
	text 				: 'We chase misprinted lies',
	duration 		: 2,
	fps 				: 60,
	animation 	: animations.SHOW,
	direction 	: directions.RANDOM,
	nglyphs 		: '',
};

const paramsB = {
	text 				: 'We face the path of time',
	fps 				: 60,
	stayFrames 	: 25,
	animation 	: animations.SHOW,
	nglyphs 		: '',
};

let el;

const setup = () => {
	el = document.querySelector('pre');

	// init parameters panel
	createPane();
	// play first animation
	playShuffle();
};

const onUpdate = (output) => {
	el.innerText = output;
};

const playShuffle = () => {
	const { text, duration, fps, nglyphs, direction, animation } = paramsA;
	const glyphs = nglyphs.length ? nglyphs : undefined;

	shuffle({ text, duration, fps, glyphs, direction, animation, onUpdate });
};

const playShuffleScroll = () => {
	const { text, fps, nglyphs, stayFrames, animation } = paramsB;
	const glyphs = nglyphs.length ? nglyphs : undefined;

	shuffleScroll({ text, fps, glyphs, stayFrames, animation, onUpdate });
};

const createPane = () => {
	const pane = new Tweakpane.Pane();
	let folder;

	folder = pane.addFolder({ title: 'SHUFFLE' });
	folder.addInput(paramsA, 'text');
	folder.addInput(paramsA, 'duration', { min: 0, max: 3, step: 0.1 });
	folder.addInput(paramsA, 'fps', { min: 1, max: 60, step: 1 });
	folder.addInput(paramsA, 'animation', { options: animations });
	folder.addInput(paramsA, 'direction', { options: directions });
	folder.addInput(paramsA, 'nglyphs', { label: 'glyphs'});
	folder.addButton({ title: 'SHUFFLE', label: 'play' }).on('click', playShuffle);

	/*
	folder = pane.addFolder({ title: 'SHUFFLE SCROLL' });
	folder.addInput(paramsB, 'text');
	folder.addInput(paramsB, 'fps', { min: 1, max: 60, step: 1 });
	folder.addInput(paramsB, 'animation', { options: animations });
	folder.addInput(paramsB, 'stayFrames', { min: 1, max: 60, step: 1 });
	folder.addInput(paramsB, 'nglyphs', { label: 'glyphs'});
	folder.addButton({ title: 'SHUFFLE SCROLL', label: 'play' }).on('click', playShuffleScroll);
	*/
};

setup();
