<script setup lang="ts">
import { useAudioSources } from '@/stores/audioSources';
import AppButton from '@/components/buttons/AppButton.vue';
import AudioInputIcon from '@/components/icons/AudioInputIcon.vue';
import AudioOutputIcon from '@/components/icons/AudioOutputIcon.vue';
import VolumeIcon from '@/components/icons/VolumeIcon.vue';

const store = useAudioSources();
</script>

<template>
	<div v-for="source in store.audioSources" :key="source.name" :class="$style.sourceRow">
		<AppButton :is-active="!source.muted" @click="store.toggleMute(source)" :id="source.name" :class="$style.button">
			<AudioInputIcon v-if="source.audioType === 'input'" :is-active="!source.muted" />
			<AudioOutputIcon v-if="source.audioType === 'output'" :is-active="!source.muted" />
		</AppButton>
		<div :class="$style.label">
			{{ source.name }}<br />
			<div :class="$style.volumeBar">
				<div :class="$style.volumeBarPercent" :style="{ width: (source.volume || 0) + 100 + '%' }"></div>
			</div>
		</div>
		<AppButton is-active :class="$style.button" @click="store.decreaseVolume(source)">
			<VolumeIcon vol-direction="down" />
		</AppButton>
		<AppButton is-active :class="$style.button" @click="store.increaseVolume(source)">
			<VolumeIcon vol-direction="up" />
		</AppButton>
	</div>
</template>

<style lang="scss" module>
.button {
	margin: 0;
}
.sourceRow {
	// background: #444;
	height: 50px;
	margin-bottom: 0.25rem;
	display: flex;
	align-items: center;
	margin-left: -0.5rem;

	> * {
		margin-left: 0.5rem;
	}
}

.label {
	flex-grow: 1;
}

.volumeBar {
	width: 100%;
	background: rgba(255, 255, 255, 0.5);
	margin-top: 0.25rem;

	&Percent {
		height: 0.25rem;
		background: #34699f;
	}
}
</style>
