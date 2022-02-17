<script setup lang="ts">
import { computed } from 'vue';
import { useLog } from './hooks/useLog';
import { useWebsocket, ConnectionStatus } from './hooks/useWebsocket';
import SceneList from '@/components/SceneList.vue';
import SourceList from '@/components/SourceList.vue';
import AudioSourceList from '@/components/AudioSourceList.vue';
import RecordButton from '@/components/buttons/RecordButton.vue';
import StreamButton from '@/components/buttons/StreamButton.vue';
import PowerIcon from '@/components/icons/PowerIcon.vue';
import CameraPositionControl from '@/components/CameraPositionControl.vue';

useLog();
const { status, connect, disconnect /* , request */ } = useWebsocket();

// window.request = request;

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
				<SourceList />
			</div>
			<div>
				<h2 :class="$style.columnHeader">Audio Sources</h2>
				<AudioSourceList />
				<div :class="$style.cameraPositionContainer">
					<h2 :class="$style.columnHeader">Camera Position</h2>
					<CameraPositionControl />
				</div>
			</div>
		</template>
	</div>
	<div v-if="status == 'pending'" :class="$style.loadingSection">
		<h2>CONNECTING</h2>
		<div :class="$style.spinner">
			<div :class="$style.spinnerBall"></div>
		</div>
	</div>
	<h2 v-else-if="status == 'disconnected'">Disconnected. Please connect to OBS Studio to get started</h2>
</template>

<style lang="scss">
body {
	font-family: sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	background: #123;
	color: #e5e5e5;
	padding: 0 1rem;
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
	min-height: 3.75rem;
	margin: 0 -1rem;

	> * {
		margin: 0 0 0 1rem;
	}
}

.appHeading {
	vertical-align: top;
	font-size: 2rem;
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
.cameraPositionContainer {
	width: 50%;
	margin: 1rem auto 0;
	text-align: center;
}

.loadingSection {
	text-align: center;

	h2 {
		margin-bottom: 3rem;
	}
}

.spinner {
	width: 50px;
	height: 50px;
	margin: 0 auto;
	transform: none;
	animation: spinner 0.375s infinite linear;

	&Ball {
		height: 10px;
		width: 10px;
		border-radius: 10px;
		background: #fff;
	}
}

@keyframes spinner {
	to {
		transform: rotateZ(360deg);
	}
}
</style>
