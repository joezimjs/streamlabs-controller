<template>
	<ControlButton
		v-for="source in store.audioSources"
		:key="source.sourceId"
		:is-active="!source.muted"
		@click="store.setMuted(source, !source.muted)"
	>
		<AudioInputIcon v-if="store.getAudioType(source) === 'input'" :class="$style.icon" />
		<AudioOutputIcon v-if="store.getAudioType(source) === 'output'" :class="$style.icon" />
		{{ source.name }}
	</ControlButton>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAudioSources } from '@/stores/audioSources';
import ControlButton from '@/components/ControlButton.vue';
import AudioInputIcon from '@/components/AudioInputIcon.vue';
import AudioOutputIcon from '@/components/AudioOutputIcon.vue';

export default defineComponent({
	components: { ControlButton, AudioInputIcon, AudioOutputIcon },
	setup() {
		let store = useAudioSources();

		return { store };
	},
});
</script>

<style lang="scss" module>
.icon {
	display: inline-block;
	vertical-align: middle;
	transform: translateY(-2px);
}
</style>
