<template>
	<ControlButton :is-active="isVisible" @click="toggleVisibility">
		<EyeIcon :class="$style.icon" />
	</ControlButton>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import { useSources, Source } from '@/stores/sources';
import ControlButton from '@/components/ControlButton.vue';
import EyeIcon from '@/components/EyeIcon.vue';

export default defineComponent({
	components: { ControlButton, EyeIcon },
	props: {
		source: {
			type: Object as PropType<Source>,
			required: true,
		},
	},
	setup(props) {
		let store = useSources();

		let isVisible = computed(() => {
			return store.sourceIsVisible(props.source, 'visible');
		});

		function toggleVisibility() {
			store.setVisibility(props.source, !isVisible.value, 'visible');
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
