<template>
	<AppButton :disabled="disabled" :class="$style[statusClass]" @click="toggleRecording">
		<RecordingStatusIcon :class="$style.icon" :is-recording="isRecording" />
		{{ isRecording ? 'Recording' : 'Record' }}
	</AppButton>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useWebsocket, ConnectionStatus } from '@/hooks/useWebsocket';
import AppButton from '@/components/buttons/AppButton.vue';
import RecordingStatusIcon from '../icons/RecordingStatusIcon.vue';

const { onConnected, subscribe, request, status } = useWebsocket();
const isRecording = ref(false);
const disabled = computed(() => status.value !== ConnectionStatus.Connected);
const statusClass = computed(() => (isRecording.value ? 'active' : 'inactive'));

function setIsRecording(bool: boolean) {
	return () => (isRecording.value = bool);
}

subscribe('RecordingStarting', setIsRecording(true));
subscribe('RecordingStarted', setIsRecording(true));
subscribe('RecordingResumed', setIsRecording(true));
subscribe('RecordingStopping', setIsRecording(false));
subscribe('RecordingStopped', setIsRecording(false));
subscribe('RecordingPaused', setIsRecording(false));

onConnected(async () => {
	const status = await request('GetRecordingStatus');
	isRecording.value = status.isRecording || false;
}, true);

function toggleRecording() {
	if (status.value === ConnectionStatus.Connected) {
		request('StartStopRecording');
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
	}
}
</style>
