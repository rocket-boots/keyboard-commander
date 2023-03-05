/**
 * @jest-environment jsdom
 */

import KeyboardCommander from './KeyboardCommander.js';

// beforeAll(() => {});

// afterAll(() => {});

describe('KeyboardCommander', () => {
	test('A keyboard commander can be instantiated', async () => {
		const kbc = new KeyboardCommander();
		expect(kbc).toBeTruthy();
	});

	test('A key triggers appropriate command', async () => {
		const kbc = new KeyboardCommander({
			'a': 'move left',
		});
		let lastCommand = null;
		kbc.on('command', (command) => { lastCommand = command; });
		kbc.triggerKey('a');
		expect(lastCommand).toBe('move left');
	});
});
