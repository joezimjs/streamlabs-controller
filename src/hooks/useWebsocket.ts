import SockJS from 'sockjs-client';
import { ref, Ref, watch, watchEffect } from 'vue';
import { useLog } from './useLog';

export enum ConnectionStatus {
	Disconnected = 'disconnected',
	Opened = 'opened',
	Pending = 'pending',
	Connected = 'connected',
}

type RequestBody = {
	jsonrpc: string;
	id: number;
	method: string;
	params: { resource: string; args: any };
};

type Request = {
	body: RequestBody;
	resolve: Function;
	reject: Function;
};

const status: Ref<ConnectionStatus> = ref(ConnectionStatus.Disconnected);
let socket: WebSocket;

const token = 'd5c34b8138c24c791927b96995b41bb483d93ada';
const port = 59650;
const host = '127.0.0.1';
const url = `http://${host}:${port}/api`;

let nextRequestId = 1;
const requests: Request[] = [];
const subscriptions: { [key: string]: any } = {};

const { logMessage } = useLog();

watch(status, (newStatus) => logMessage(newStatus, 'connection'));

/**
 * Main way of bringing functionality into components. Will automatically attempt to connect the first time it's used.
 * Returns the public API for communicating with StreamLabs.
 */
export function useWebsocket() {
	connect();

	return { status, request, subscribe, connect, disconnect, onConnected, onDisconnected };
}

/**
 * Connect to StreamLabs
 */
function connect() {
	if (status.value !== ConnectionStatus.Disconnected) return;

	status.value = ConnectionStatus.Pending;
	socket = new SockJS(url);

	socket.onopen = () => {
		status.value = ConnectionStatus.Opened;

		// send token for auth
		request('TcpServerService', 'auth', token)
			.then(function onConnectionHandler() {
				status.value = ConnectionStatus.Connected;
			})
			.catch((e: { message: any }) => {
				alert(e.message);
			});
	};

	socket.onmessage = (e) => {
		onMessageHandler(e.data);
		logMessage(e.data.toString(), 'response');
	};

	socket.onclose = (e) => {
		status.value = ConnectionStatus.Disconnected;
	};
}

/**
 * Disconnect from StreamLabs
 */
function disconnect() {
	socket.close();
	status.value = ConnectionStatus.Disconnected;
}

/**
 * Helper for running code once the connection is established, or immediately if already established
 */
function onConnected(cb: Function) {
	watchEffect(() => {
		if (status.value === ConnectionStatus.Connected) {
			cb();
		}
	});
}

/**
 * Helper for running code once the connection is established, or immediately if already established
 */
function onDisconnected(cb: Function) {
	watchEffect(() => {
		if (status.value === ConnectionStatus.Disconnected) {
			cb();
		}
	});
}

/**
 * Send a request to StreamLabs to either force an action or to get information
 */
function request(resourceId: string, methodName: string, ...args: any[]): Promise<any> {
	const requestBody: RequestBody = {
		jsonrpc: '2.0',
		id: nextRequestId++,
		method: methodName,
		params: { resource: resourceId, args },
	};

	logMessage(requestBody, 'request');

	return new Promise((resolve, reject) => {
		requests[requestBody.id] = {
			body: requestBody,
			resolve,
			reject,
		};

		socket.send(JSON.stringify(requestBody));
	});
}

/**
 * Handle any responses from StreamLabs. Will resolve any requests with the response and make a call to any
 * subscriptions subscribed to the response type.
 */
function onMessageHandler(data: any) {
	const message = JSON.parse(data);
	const request = requests[message.id];

	if (request) {
		if (message.error) {
			request.reject(message.error);
		} else {
			request.resolve(message.result);
		}
		delete requests[message.id];
	}

	const result = message.result;
	if (!result) return;

	if (result._type === 'EVENT' && result.emitter === 'STREAM' && subscriptions[message.result.resourceId].length) {
		subscriptions[message.result.resourceId].forEach((cb: Function) => cb(result.data));
	}
}

/**
 * Subscribe a callback to handle any messages from StreamLabs of a specified type
 */

/* TODO: create enums for resourceID and channelName */
async function subscribe(resourceId: string, channelName: string, cb: Function) {
	request(resourceId, channelName).then((subscriptionInfo) => {
		subscriptions[subscriptionInfo.resourceId] = subscriptions[subscriptionInfo.resourceId] || [];
		subscriptions[subscriptionInfo.resourceId].push(cb);
	});
}
