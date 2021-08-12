<template>
	<ControlButton :disabled="disabled" :is-active="isRecording" @click="toggleRecording">{{
		isRecording ? 'Recording' : 'Record'
	}}</ControlButton>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, computed } from 'vue';
import ControlButton from '@/components/ControlButton.vue';
import { useWebsocket, ConnectionStatus } from '@/hooks/useWebsocket';

type RecordingStatus = 'recording' | 'stopping' | 'offline';

export default defineComponent({
	components: { ControlButton },
	setup() {
		let { onConnected, subscribe, request, status } = useWebsocket();
		let recordingStatus: Ref<RecordingStatus> = ref('offline');
		let isRecording: Ref<boolean> = computed(() => recordingStatus.value === 'recording');
		let disabled: Ref<boolean> = computed(() => status.value !== ConnectionStatus.Connected);

		onConnected(() => {
			// console.log('RECORD BUTTON ON CONNECT');
			subscribe(
				'StreamingService',
				'recordingStatusChange',
				(status: RecordingStatus) => (recordingStatus.value = status)
			);
		}, true);

		function toggleRecording() {
			if (status.value === ConnectionStatus.Connected) {
				request('StreamingService', 'toggleRecording');
			}
		}

		return { isRecording, recordingStatus, disabled, toggleRecording };
	},
});
</script>

<style lang="scss" module></style>
