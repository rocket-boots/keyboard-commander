# Keyboard Commander
*A small js library that converts key hits to commands and allows remapping keys*

## How to Use

1. Bring the library into your project: `npm install github:rocket-boots/keyboard-commander` (optionally add a `#tag` to the end, e.g., `#v0.2.0`)
2. Import into one of your components
    ```js
	import { KeyboardCommander } from 'keyboard-commander';
	```
3. Create a mapping object between keys and a set of commands that your app or game will interpret later
    ```js
	const mapping = {
		w: 'wear/wield',
		e: 'eat',
		r: 'read',
		Tab: 'next target',
		Enter: 'action',
	};
	```
	Note that keys are case sensitive, and the commands can be anything - a string, function, object, etc.

4. Create a function to handle the commands
    ```js
	const handleCommand = (command) => { /* do something based on the command received */ };
	```

5. Instantiate a keyboard commander object, passing in the mapping
    ```js
	const kbCommander = new KeyboardCommander(mapping);
	kbCommander.on('command', handleCommand);
	// Alternatively:
	// const kbCommander = new KeyboardCommander(mapping, { command: handleCommand });
	```

## API - KeyboardCommander methods

### Observe
* `on` will set up an observer to listen for an event (arg 1) and then run a listener function (arg 2)
  - There are currently four events: `command`, `missingCommand`, `mount`, `unmount`, `mapping`
* `off` will remove an event and listener

### Map/Unmap Keys
* `setMapping` takes a mapping object as an argument and sets it internally, overwriting whatever mapping currently exists
* `mapKey` maps an individual key (arg 1) to a command (arg 2)
* `mapUnmappedKey` only maps a key to a command if it is not set already
* `unmapKey` remove a key mapping

### Trigger Events
* `triggerCommand` triggers a command event
* `triggerMissingCommand` triggers a missingCommand event
* `triggerKey` triggers a key hit

### Information
* `getKeysMapped` returns an array of the keys that are currently mapped
* `getCommands` returns an array of the commands that are currently mapped
* `isKeyDown` true/false whether or not the key is being held down
* `isCommandDown` true/false whether the command is held down; can be used instead of triggers

### Lifecycle
* `mount` adds the event listeners to the document
* `unmount` removes the event listeners


## An Example

* Try it out: http://rocket-boots.github.io/keyboard-commander/
* Code: https://github.com/rocket-boots/keyboard-commander/blob/main/index.html

## Known Issues

* When hitting keys fast together with Shift, there's the possibility that a key gets stuck in the key-down (`true`) state.
