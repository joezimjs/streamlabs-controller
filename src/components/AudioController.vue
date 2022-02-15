<template>
	<ControlButton
		v-for="source in store.audioSources"
		:key="source.name"
		:is-active="!source.muted"
		@click="store.toggleMute(source)"
	>
		<AudioInputIcon v-if="source.audioType === 'input'" :class="$style.icon" />
		<AudioOutputIcon v-if="source.audioType === 'output'" :class="$style.icon" />
		{{ source.name }}
	</ControlButton>
</template>

<script setup lang="ts">
import { useAudioSources } from '@/stores/audioSources';
import ControlButton from '@/components/ControlButton.vue';
import AudioInputIcon from '@/components/AudioInputIcon.vue';
import AudioOutputIcon from '@/components/AudioOutputIcon.vue';

let store = useAudioSources();
</script>

<style lang="scss" module>
.icon {
	display: inline-block;
	vertical-align: middle;
	transform: translateY(-2px);
}
</style>
