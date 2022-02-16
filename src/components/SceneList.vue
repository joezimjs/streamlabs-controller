<template>
	<HighlightRowButton
		v-for="scene in store.scenes"
		:key="scene"
		:is-active="store.isActiveScene(scene)"
		@click="store.selectScene(scene)"
		>{{ scene }}</HighlightRowButton
	>
</template>

<script setup lang="ts">
import { useScenes } from '@/stores/scenes';
import HighlightRowButton from '@/components/buttons/HighlightRowButton.vue';

const store = useScenes();
</script>
