<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
	isRecording: {
		type: Boolean,
		required: true,
	},
});

const iconType = computed(() => (props.isRecording ? 'Stop' : 'Record'));
</script>

<template>
	<span :class="$style['icon' + iconType]"> </span>
</template>

<style lang="scss" module>
.icon {
	height: 1em;
	width: 1em;
	padding: 0;
	line-height: 0;
	display: inline-block;
	background: currentColor;
}

.iconRecord {
	composes: icon;
	border-radius: 1em;
}

.iconStop {
	composes: icon;
}
</style>
