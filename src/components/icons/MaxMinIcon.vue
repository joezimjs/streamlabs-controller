<template>
	<svg
		v-if="!isFullScreen"
		viewBox="0 0 24 24"
		width="16"
		height="16"
		stroke="currentColor"
		stroke-width="2"
		fill="none"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="css-i6dzq1"
	>
		<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
	</svg>
	<svg
		v-else
		viewBox="0 0 24 24"
		width="16"
		height="16"
		stroke="currentColor"
		stroke-width="2"
		fill="none"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="css-i6dzq1"
	>
		<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
	</svg>
</template>

<script setup lang="ts">
defineProps({
	isFullScreen: {
		type: Boolean,
		default: false,
	},
});
</script>
