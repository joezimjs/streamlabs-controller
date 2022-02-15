<template>
	<ControlButton :disabled="disabled" :is-active="isStreaming" @click="toggleStreaming">{{
		isStreaming ? 'Streaming' : 'Go Live'
	}}</ControlButton>
</template>

<script setup lang="ts">
import { ref, Ref, computed } from 'vue';
import ControlButton from '@/components/ControlButton.vue';
import { useWebsocket, ConnectionStatus } from '@/hooks/useWebsocket';

const { onConnected, subscribe, request, status } = useWebsocket();
const isStreaming: Ref<boolean> = ref(false);
const disabled: Ref<boolean> = computed(() => status.value !== ConnectionStatus.Connected);

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
</script>

<style lang="scss" module></style>
