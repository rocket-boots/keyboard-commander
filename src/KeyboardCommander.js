import Observer from './Observer.js';

const COMMAND_EVENT = 'command';
const MISSING_COMMAND_EVENT = 'missingCommand';
const KEY_EVENT = 'keydown'; // Note that keyPress acts different and doesn't trigger for some keys

class KeyboardCommander extends Observer {
	constructor(keyCommandMapping = {}, options = {}) {
		super();
		// this.state = options.state || 'default';
		this.mapping = {};
		this.setMapping(keyCommandMapping);
		this.document = options.document || window?.document || null;
		if (!this.document?.addEventListener) throw error('document with addEventListener is required');
		this.keyPressListener = (event) => this.handleKeyPress(event);
		// Set up event hooks, if provided
		this.setupEventListeners(options);
		// Advanced settings
		this.nodeNamesDontTrigger = ['TEXTAREA', 'INPUT'];
		this.nodeNamesAllowDefault = ['TEXTAREA', 'INPUT']; // redundant since they won't get triggered
		// Start it up
		this.mount();
	}

	setMapping(mappingParam = {}) {
		if (typeof mappingParam !== 'object') throw new Error('Invalid type for mapping param');
		return this.mapping = {...mappingParam};
	}

	mapKey(key, command) {
		this.mapping[key] = command;
		return true;
	}

	mapUnmappedKey(key, command) {
		if (this.mapping[key]) return false; // Don't overwrite a mapping
		return this.mapKey(key, command);
	}

	unmapKey(key) {
		if (this.mapping[key]) return false;
		delete this.mapping[key];
		return true;
	}

	mount() {
		this.document.addEventListener(KEY_EVENT, this.keyPressListener);
	}

	unmount() {
		this.document.removeEventListener(KEY_EVENT, this.keyPressListener);
	}

	handleKeyPress(event) {
		// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
		const { key, code, keyCode, altKey, ctrlKey, shiftKey, metaKey, repeat } = event;
		const details = { code, keyCode, altKey, ctrlKey, shiftKey, metaKey, repeat };
		const { nodeName } = event.target;
		if (this.nodeNamesDontTrigger.includes(nodeName)) return;
		if (!this.nodeNamesAllowDefault.includes(nodeName)) {
			event.preventDefault();
		}
		this.triggerKey(key, details);
	}

	setupEventListeners(listenersObj = {}) {
		[COMMAND_EVENT, MISSING_COMMAND_EVENT].forEach((eventName) => {
			// Assumes that the value will be a function
			if (listenersObj[eventName]) this.on(eventName, listenersObj[eventName]);
		});
	}

	triggerCommand(command) {
		this.trigger(COMMAND_EVENT, command);
	}

	triggerMissingCommand(key) {
		// console.warn('No command for', key);
		this.trigger(MISSING_COMMAND_EVENT, key);
	}

	triggerKey(key, details = {}) {
		const command = this.mapping[key];
		// TODO: Look at details and handle them in the mapping
		if (command) {
			this.triggerCommand(command);
		} else {
			this.triggerMissingCommand(key);
		}
	}

	getKeysMapped() {
		return Object.keys(this.mapping);
	}

	getCommands() {
		const uniqueCommands = new Set();
		this.getKeysMapped().forEach((key) => uniqueCommands.add(this.mapping[key]));
		return Array.from(uniqueCommands);
	}
}

export default KeyboardCommander;
