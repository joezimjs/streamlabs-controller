<template>
	<ControlButton :disabled="disabled" :is-active="isRecording" @click="toggleRecording">{{
		isRecording ? 'Recording' : 'Record'
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
		let isRecording: Ref<boolean> = ref(false);
		let disabled: Ref<boolean> = computed(() => status.value !== ConnectionStatus.Connected);

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

		return { isRecording, disabled, toggleRecording };
	},
});
</script>

<style lang="scss" module></style>
