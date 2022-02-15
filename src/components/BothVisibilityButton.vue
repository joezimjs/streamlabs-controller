<template>
	<ControlButton @click="toggleVisibility">
		<RecordIcon :class="$style.icon" /> <PlusIcon :class="$style.icon" /> <StreamIcon :class="$style.icon" />
	</ControlButton>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { useSources, Source } from '@/stores/sources';
import ControlButton from '@/components/ControlButton.vue';
import RecordIcon from '@/components/RecordIcon.vue';
import StreamIcon from '@/components/StreamIcon.vue';
import PlusIcon from '@/components/PlusIcon.vue';

const store = useSources();

const props = defineProps({
	source: {
		type: Object as PropType<Source>,
		required: true,
	},
});

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
