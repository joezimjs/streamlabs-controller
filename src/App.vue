<script setup lang="ts">
import { computed, ref } from 'vue';
import { useLog } from './hooks/useLog';
import { useWebsocket, ConnectionStatus } from './hooks/useWebsocket';
import SceneList from '@/components/SceneList.vue';
import SourceList from '@/components/SourceList.vue';
import AudioSourceList from '@/components/AudioSourceList.vue';
import RecordButton from '@/components/buttons/RecordButton.vue';
import StreamButton from '@/components/buttons/StreamButton.vue';
import PowerIcon from '@/components/icons/PowerIcon.vue';
import CameraPositionControl from '@/components/CameraPositionControl.vue';
import ScreenSwitch from '@/components/ScreenSwitch.vue';
import AppButton from './components/buttons/AppButton.vue';

useLog();
const { status, host, port, password, connect, disconnect, saveConnectionSettings /* , request */ } = useWebsocket();
// window.request = request;

const showSettings = ref(false);

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
	else connect();
}

function saveSettings() {
	saveConnectionSettings();

	showSettings.value = false;
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
			<AppButton :class="$style.pushRight" @click="showSettings = true">Settings</AppButton>
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
				<div :class="$style.controlsContainer">
					<div :class="$style.positionContainer">
						<h2 :class="$style.columnHeader">Screen</h2>
						<ScreenSwitch />
					</div>
					<div :class="$style.positionContainer">
						<h2 :class="$style.columnHeader">Camera Position</h2>
						<CameraPositionControl />
					</div>
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

	<div :class="$style.modal" v-if="showSettings">
		<h2 @click="showSettings = false">Settings</h2>
		<div :class="$style.settingsForm">
			<label for="host">Connection Host</label> <input v-model="host" id="host" />
			<label for="port">Connection Port</label> <input v-model="port" id="port" />
			<label for="password">Auth Password</label> <input v-model="password" id="password" />
		</div>
		<AppButton @click="saveSettings()">Save</AppButton>
		<AppButton @click="showSettings = false">Cancel</AppButton>
	</div>
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
	grid-template-columns: 2fr 2fr 3fr;
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

	.pushRight {
		margin-left: auto;
		margin-right: 1rem;
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

.controlsContainer {
	display: flex;
	margin: 1rem -1rem 0;
	align-items: center;

	> * {
		margin: 0 1.5rem;
	}
}
.positionContainer {
	// width: 50%;
	// margin: 1rem auto 0;
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

.modal {
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: #123;
	padding: 2rem;

	button {
		margin: 2rem 2rem 0 0;
		padding: 0.75rem 3rem;
	}
}

.settingsForm {
	display: grid;
	grid-template-columns: max-content max-content;
	width: auto;
	gap: 1rem;
}
</style>
