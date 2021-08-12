<template>
	<ControlButton :is-active="isVisible" @click="toggleVisibility">
		<StreamIcon :class="$style.icon" />
	</ControlButton>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import { useSources, Source } from '@/stores/sources';
import ControlButton from '@/components/ControlButton.vue';
import StreamIcon from '@/components/StreamIcon.vue';

export default defineComponent({
	components: { ControlButton, StreamIcon },
	props: {
		source: {
			type: Object as PropType<Source>,
			required: true,
		},
	},
	setup(props) {
		let store = useSources();

		let isVisible = computed(() => {
			return store.sourceIsVisible(props.source, 'streamVisible');
		});

		function toggleVisibility() {
			store.setVisibility(props.source, !isVisible.value, 'streamVisible');
		}

		return { isVisible, toggleVisibility };
	},
});
</script>

<style lang="scss" module>
.icon {
	display: inline-block;
	vertical-align: middle;
}
</style>
