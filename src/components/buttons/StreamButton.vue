<template>
	<AppButton :disabled="disabled" :class="$style[statusClass]" @click="toggleStreaming">
		<RecordingStatusIcon :class="$style.icon" :is-recording="isStreaming" />
		{{ isStreaming ? 'Streaming' : 'Go Live' }}
	</AppButton>
</template>

<script setup lang="ts">
import { ref, Ref, computed } from 'vue';
import AppButton from '@/components/buttons/AppButton.vue';
import { useWebsocket, ConnectionStatus } from '@/hooks/useWebsocket';
import RecordingStatusIcon from '../icons/RecordingStatusIcon.vue';

const { onConnected, subscribe, request, status } = useWebsocket();
const isStreaming: Ref<boolean> = ref(false);
const disabled: Ref<boolean> = computed(() => status.value !== ConnectionStatus.Connected);
const statusClass = computed(() => (isStreaming.value ? 'active' : 'inactive'));

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

<style lang="scss" module>
.active {
	background: #c00;
	.icon {
		color: #e5e5e5;
	}
}

.inactive {
	background: transparent;
	.icon {
		color: #c00;
		margin-right: 0.5rem;
	}
}
</style>
