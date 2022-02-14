<template>
	<ControlButton :disabled="disabled" :is-active="isStreaming" @click="toggleStreaming">{{
		isStreaming ? 'Streaming' : 'Go Live'
	}}</ControlButton>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, computed } from 'vue';
import ControlButton from '@/components/ControlButton.vue';
import { useWebsocket, ConnectionStatus } from '@/hooks/useWebsocket';

export default defineComponent({
	components: { ControlButton },
	setup() {
		let { onConnected, subscribe, request, status } = useWebsocket();
		let isStreaming: Ref<boolean> = ref(false);
		let disabled: Ref<boolean> = computed(() => status.value !== ConnectionStatus.Connected);

		function setIsStreaming(bool: boolean) {
			return () => (isStreaming.value = bool);
		}

		subscribe('StreamStarting', setIsStreaming(true));
		subscribe('StreamStarted', setIsStreaming(true));
		subscribe('StreamStopping', setIsStreaming(false));
		subscribe('StreamStopped', setIsStreaming(false));

		onConnected(async () => {
			const status = await request('GetStreamingStatus');
			isStreaming.value = status.streaming || false;
		}, true);

		function toggleStreaming() {
			if (status.value === ConnectionStatus.Connected) {
				request('StartStopStreaming');
			}
		}

		return { isStreaming, disabled, toggleStreaming };
	},
});
</script>

<style lang="scss" module></style>
