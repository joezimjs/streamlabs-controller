<template>
	<ControlButton :disabled="disabled" @click="toggleStreaming">{{
		isStreaming ? 'Streaming' : 'Go Live'
	}}</ControlButton>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, computed } from 'vue';
import ControlButton from '@/components/ControlButton.vue';
import { useWebsocket, ConnectionStatus } from '@/hooks/useWebsocket';

type StreamingStatus = 'starting' | 'live' | 'ending' | 'offline';

export default defineComponent({
	components: { ControlButton },
	setup() {
		let { onConnected, subscribe, request, status } = useWebsocket();
		let streamingStatus: Ref<StreamingStatus> = ref('offline');
		let isStreaming: Ref<boolean> = computed(() => streamingStatus.value === 'live');
		let disabled: Ref<boolean> = computed(() => status.value !== ConnectionStatus.Connected);

		onConnected(() => {
			subscribe(
				'StreamingService',
				'streamingStatusChange',
				(status: StreamingStatus) => ((streamingStatus.value = status), console.log(status))
			);
		});

		function toggleStreaming() {
			if (status.value === ConnectionStatus.Connected) {
				request('StreamingService', 'toggleStreaming');
			}
		}

		return { isStreaming, streamingStatus, disabled, toggleStreaming };
	},
});
</script>

<style lang="scss" module></style>
