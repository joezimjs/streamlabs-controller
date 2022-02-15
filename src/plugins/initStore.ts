/* eslint-disable */
import { PiniaPluginContext } from 'pinia';
import 'pinia';

const initializedStores = new Set();

declare module 'pinia' {
	export interface DefineStoreOptions<Id, S, G, A> {
		__initialize?: (store: any) => void | Promise<void>;
	}
}

export default function initStorePlugin(context: PiniaPluginContext) {
	const isInitialized = initializedStores.has(context.store.$id);
	if (!isInitialized && typeof context.options.__initialize === 'function') {
		initializedStores.add(context.store.$id);
		context.options.__initialize(context.store);
	}
	return;
}
