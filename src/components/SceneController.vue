<template>
	<ControlButton
		v-for="scene in store.scenes"
		:key="scene.id"
		:is-active="store.isActiveScene(scene)"
		@click="store.selectScene(scene)"
	>
		{{ scene.name }}
	</ControlButton>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useScenes } from '@/stores/scenes';
import ControlButton from '@/components/ControlButton.vue';

export default defineComponent({
	components: { ControlButton },
	setup() {
		let store = useScenes();

		return {
			// scenes: toRef(sceneStore, 'scenes'),
			// selectScene: sceneStore.selectScene,
			// isActiveScene: sceneStore.isActiveScene,
			store,
		};
	},
});
</script>
