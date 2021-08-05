import { ref, Ref } from 'vue';

type Message = {
	type: string;
	data: any;
};

export const messages: Ref<Array<Message>> = ref([]);

export function logMessage(data: any, type: string): void {
	if (typeof data === 'string') {
		try {
			data = JSON.parse(data);
		} catch (e) {
			/* DO NOTHING */
		}
	}

	console.debug(`${type}:`, data);
	messages.value.push({ type, data });
}

export function clearLog(): void {
	messages.value = [];
}

export function useLog() {
	return { messages, logMessage, clearLog };
}

export default useLog;
