<template>
	<ControlButton :is-active="source.render" @click="toggleVisibility">
		<RecordIcon :class="$style.icon" />
	</ControlButton>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { useSources, Source } from '@/stores/sources';
import ControlButton from '@/components/ControlButton.vue';
import RecordIcon from '@/components/RecordIcon.vue';

const props = defineProps({
	source: {
		type: Object as PropType<Source>,
		required: true,
	},
});
const store = useSources();

function toggleVisibility() {
	store.toggleVisibility(props.source);
}
</script>

<style lang="scss" module>
.icon {
	display: inline-block;
	vertical-align: middle;
}
</style>
