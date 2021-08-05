<template>
	<ControlButton v-for="scene in scenes" :key="scene.id" :is-active="isActiveScene(scene)" @click="selectScene(scene)">
		{{ scene.name }}
	</ControlButton>
</template>

<script lang="ts">
import { defineComponent, toRef } from 'vue';
import { useScenes } from '@/stores/scenes';
import ControlButton from '@/components/ControlButton.vue';

export default defineComponent({
	components: { ControlButton },
	setup() {
		let sceneStore = useScenes();
		sceneStore.initialize();

		return {
			scenes: toRef(sceneStore, 'scenes'),
			selectScene: sceneStore.selectScene,
			isActiveScene: sceneStore.isActiveScene,
		};
	},
});
</script>
