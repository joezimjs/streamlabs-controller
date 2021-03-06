import OBSWebSocket from 'obs-websocket-js';
import { computed, ref, Ref } from 'vue';
import { useLog } from './useLog';

export enum ConnectionStatus {
	Disconnected = 'disconnected',
	Pending = 'pending',
	Connected = 'connected',
}

const socket = new OBSWebSocket();
const status: Ref<ConnectionStatus> = ref(ConnectionStatus.Disconnected);
const eventsSubscribedTo: string[] = [];

const { logMessage } = useLog();

subscribe('AuthenticationSuccess', () => {
	status.value = ConnectionStatus.Connected;
});

subscribe('ConnectionClosed', () => {
	status.value = ConnectionStatus.Disconnected;
});

// Don't use `subscribe` because this is simply about logging, but it's specific to errors
socket.on('error', (data: any) => {
	logMessage('ERROR', data);
});

/**
 * Main way of bringing functionality into components. Will automatically attempt to connect the first time it's used.
 * Returns the public API for communicating with OBS.
 */
export function useWebsocket() {
	// Connection Variables
	const host = ref<string>(localStorage.getItem('host') ?? location.hostname);
	const port = ref<string>(localStorage.getItem('port') ?? '4444');
	const password = ref<string>(localStorage.getItem('password') ?? '');

	// Save Connection variables to localStorage to save work on refresh
	function saveConnectionSettings() {
		localStorage.setItem('host', host.value);
		localStorage.setItem('port', port.value);
		localStorage.setItem('password', password.value);

		connect();
	}

	/**
	 * Connect to OBS
	 */
	async function connect() {
		if (status.value !== ConnectionStatus.Disconnected) return;

		status.value = ConnectionStatus.Pending;

		try {
			await socket.connect({ address: `${host.value}:${port.value}`, password: password.value });
		} catch (error) {
			alert('Could Not Connect');
		}
	}

	connect();

	return {
		status,
		host,
		port,
		password,
		saveConnectionSettings,
		request,
		subscribe,
		connect,
		disconnect: socket.disconnect.bind(socket),
		onConnected,
	};
}

/**
 * Helper for running code once the connection is established, or immediately if already established
 */
function onConnected(cb: () => void, activateOnce = false) {
	if (status.value == ConnectionStatus.Connected) {
		cb();
		if (!activateOnce) {
			subscribe('AuthenticationSuccess', cb);
		}
	} else {
		subscribe('AuthenticationSuccess', cb, activateOnce);
	}
}

/**
 * Send a request to OBS to either force an action or to get information
 */
async function request(method: any, ...args: [any] | [undefined?]) {
	try {
		logMessage('request', method, args);
		const response = await socket.send(method, ...args);
		logMessage('response', { request: { args, method }, response });

		return response;
	} catch (e) {
		logMessage('ERROR', 'Failed request', method, e);
	}
}

/**
 * Handle any events from OBS. Will resolve any requests with the response and make a call to any
 * subscriptions subscribed to the response type.
 */
function subscribe(
	eventName: Parameters<typeof socket.on>[0],
	callback: Parameters<typeof socket.on>[1],
	once = false
) {
	if (once) {
		socket.once(eventName, callback);
	} else {
		socket.on(eventName, callback);
	}

	if (!eventsSubscribedTo.includes(eventName)) {
		eventsSubscribedTo.push(eventName);

		// Auto-log any events we listen for in this app
		socket.on(eventName, (...args) => {
			logMessage('event', eventName, args);
		});
	}
}
