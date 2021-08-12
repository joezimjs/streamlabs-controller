<template>
	<h1 :class="$style.appHeading">
		StreamLabs Controller
		<button :class="$style[status + 'Indicator']" :aria-label="connectionButtonTitle" @click="toggleConnection">
			{{ connectionButtonTitle }}
		</button>
	</h1>
	<template v-if="status == 'connected'">
		<div><RecordButton /> <StreamButton /></div>
		<div><AudioController /></div>
		<div><SceneController /></div>
		<div><SourceController /></div>
	</template>
	<h2 v-else>Disconnected. Please connect to StreamLabs to get started</h2>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useLog } from './hooks/useLog';
import { useWebsocket, ConnectionStatus } from './hooks/useWebsocket';
import SceneController from '@/components/SceneController.vue';
import SourceController from '@/components/SourceController.vue';
import AudioController from '@/components/AudioController.vue';
import RecordButton from '@/components/RecordButton.vue';
import StreamButton from '@/components/StreamButton.vue';

export default defineComponent({
	name: 'App',
	components: { RecordButton, StreamButton, SceneController, SourceController, AudioController },
	setup() {
		let { messages } = useLog();
		let { status, connect, disconnect } = useWebsocket();

		let connectionButtonTitle = computed(() => {
			if (status.value === ConnectionStatus.Opened || status.value === ConnectionStatus.Pending) {
				return 'Connecting';
			} else if (status.value === ConnectionStatus.Disconnected) {
				return 'Disconnected. Click to Connect.';
			} else return 'Connected';
		});

		function toggleConnection() {
			if (status.value === ConnectionStatus.Connected) disconnect();
			else if (status.value === ConnectionStatus.Disconnected) connect();
		}

		return { messages, status, connectionButtonTitle, toggleConnection };
	},
});
</script>

<style lang="scss">
body {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: left;
	background: #123;
	color: #e5e5e5;
	padding: 1em;
	margin: 0;
	position: relative;
}
</style>

<style lang="scss" module="$style">
.appHeading {
	vertical-align: top;
	font-size: 2rem;
	margin-top: 0;
}

.statusIndicator {
	height: 1rem;
	width: 1rem;
	border-radius: 1rem;
	color: transparent;
	overflow: hidden;
	border: 0;
	appearance: none;
	display: inline-block;
	vertical-align: middle;
}

.connectedIndicator {
	composes: statusIndicator;
	background: rgb(6, 184, 101);
}

.pendingIndicator,
.openedIndicator {
	composes: statusIndicator;
	background: rgb(211, 140, 9);
	animation: pending 1s infinite alternate;
}

.disconnectedIndicator {
	composes: statusIndicator;
	background: rgb(177, 23, 17);
	cursor: pointer;
}

@keyframes pending {
	from {
		box-shadow: 0 0 0 0 rgb(184, 77, 5);
	}
	to {
		box-shadow: 0 0 10px 2px rgb(184, 77, 5);
	}
}
</style>
