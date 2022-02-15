<template>
	<ControlButton :disabled="disabled" :is-active="isRecording" @click="toggleRecording">{{
		isRecording ? 'Recording' : 'Record'
	}}</ControlButton>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ControlButton from '@/components/ControlButton.vue';
import { useWebsocket, ConnectionStatus } from '@/hooks/useWebsocket';

const { onConnected, subscribe, request, status } = useWebsocket();
const isRecording = ref<boolean>(false);
const disabled = computed<boolean>(() => status.value !== ConnectionStatus.Connected);

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

<style lang="scss" module></style>
