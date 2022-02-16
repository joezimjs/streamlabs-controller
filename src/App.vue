<script setup lang="ts">
import { computed } from 'vue';
import { useLog } from './hooks/useLog';
import { useWebsocket, ConnectionStatus } from './hooks/useWebsocket';
import SceneList from '@/components/SceneList.vue';
import SourceController from '@/components/SourceList.vue';
import AudioController from '@/components/AudioController.vue';
import RecordButton from '@/components/buttons/RecordButton.vue';
import StreamButton from '@/components/buttons/StreamButton.vue';
import PowerIcon from '@/components/icons/PowerIcon.vue';

useLog();
const { status, connect, disconnect } = useWebsocket();

const connectionButtonTitle = computed(() => {
	switch (status.value) {
		case ConnectionStatus.Pending:
			return 'Connecting';
		case ConnectionStatus.Disconnected:
			return 'Disconnected. Click to Connect.';
		default:
			return 'Connected';
	}
});

function toggleConnection() {
	if (status.value === ConnectionStatus.Connected) disconnect();
	else if (status.value === ConnectionStatus.Disconnected) connect();
}
</script>

<template>
	<div :class="$style.appContainer">
		<header :class="$style.appHeader">
			<button :class="$style[status + 'Indicator']" :aria-label="connectionButtonTitle" @click="toggleConnection">
				<PowerIcon :class="$style.powerIcon" />
			</button>
			<h1 :class="$style.appHeading">Stream Controller</h1>
			<template v-if="status == 'connected'">
				<RecordButton />
				<StreamButton />
			</template>
		</header>

		<template v-if="status == 'connected'">
			<div>
				<h2 :class="$style.columnHeader">Scenes</h2>
				<SceneList />
			</div>
			<div>
				<h2 :class="$style.columnHeader">Sources</h2>
				<SourceController />
			</div>
			<div>
				<h2 :class="$style.columnHeader">Audio Sources</h2>
				<AudioController />
			</div>
		</template>
		<h2 v-else>Disconnected. Please connect to OBS Studio to get started</h2>
	</div>
</template>

<style lang="scss">
body {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: left;
	background: #123;
	color: #e5e5e5;
	padding: 0 1em;
	margin: 0;
	position: relative;
}
</style>

<style lang="scss" module>
.appContainer {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 1rem;
}

.appHeader {
	grid-column: 1 / span 3;
	display: flex;
	align-items: center;
	gap: 1rem;
	min-height: 4rem;
	background: #111;
	margin-inline: -1rem;
	padding-inline: 1rem;
}

.appHeading {
	vertical-align: top;
	font-size: 2rem;
	margin: 0;
}

.statusIndicator {
	height: 1.5rem;
	width: 1.5rem;
	border-radius: 1.5rem;
	padding: 0;
	color: inherit;
	border: 0;
	appearance: none;
	cursor: pointer;
	background: transparent;
}

.connectedIndicator {
	composes: statusIndicator;
	color: rgb(6, 184, 101);
}

.pendingIndicator,
.openedIndicator {
	composes: statusIndicator;
	color: rgb(211, 140, 9);
	animation: pending 1s infinite alternate;
}

.disconnectedIndicator {
	composes: statusIndicator;
	color: rgb(177, 23, 17);
}

.powerIcon {
	height: 1.5rem;
	width: 1.5rem;
}

@keyframes pending {
	from {
		box-shadow: 0 0 0 0 rgb(184, 77, 5);
	}
	to {
		box-shadow: 0 0 10px 2px rgb(184, 77, 5);
	}
}

.columnHeader {
	margin: 0 0 1rem;
	font-size: 1.25rem;
}
</style>
