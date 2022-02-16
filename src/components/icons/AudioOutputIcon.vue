<script setup lang="ts">
defineProps({
	isActive: {
		type: Boolean,
		default: true,
	},
});
</script>

<template>
	<svg
		v-if="isActive"
		viewBox="0 0 24 24"
		width="16"
		height="16"
		stroke="currentColor"
		stroke-width="2"
		fill="none"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
		<path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
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
	>
		<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
		<line x1="23" y1="9" x2="17" y2="15"></line>
		<line x1="17" y1="9" x2="23" y2="15"></line>
	</svg>
</template>
