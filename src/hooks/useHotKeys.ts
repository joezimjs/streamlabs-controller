import { useWebsocket } from '@/hooks/useWebsocket';

export enum KEY {
	Ctrl,
	Alt,
	Shift,
	Win,
}

type KeyModifiers = {
	control?: boolean;
	alt?: boolean;
	shift?: boolean;
	command?: boolean;
};

export function useHotKeys() {
	const { request } = useWebsocket();

	function triggerHotKey(...keys: (KEY | string)[]) {
		const options = { keyModifiers: {} as KeyModifiers, keyId: '' };

		keys.forEach((key) => {
			switch (key) {
				case KEY.Ctrl:
					options.keyModifiers.control = true;
					break;
				case KEY.Alt:
					options.keyModifiers.alt = true;
					break;
				case KEY.Shift:
					options.keyModifiers.shift = true;
					break;
				case KEY.Win:
					options.keyModifiers.command = true;
					break;
				default:
					options.keyId = 'OBS_KEY_' + key;
			}
		});
		return request('TriggerHotkeyBySequence', options);
	}

	return { triggerHotKey };
}
