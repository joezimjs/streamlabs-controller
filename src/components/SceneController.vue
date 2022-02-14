<template>
	<ControlButton
		v-for="scene in store.scenes"
		:key="scene"
		:is-active="store.isActiveScene(scene)"
		@click="store.selectScene(scene)"
	>
		{{ scene }}
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

		return { store };
	},
});
</script>
