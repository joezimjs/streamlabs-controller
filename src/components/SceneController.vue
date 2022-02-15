<template>
	<ControlButton
		v-for="scene in store.scenes"
		:key="scene"
		:is-active="store.isActiveScene(scene)"
		@click="store.selectScene(scene)"
		>{{ scene }}</ControlButton
	>
</template>

<script setup lang="ts">
import { useScenes } from '@/stores/scenes';
import ControlButton from '@/components/ControlButton.vue';

const store = useScenes();
</script>
