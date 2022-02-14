<template>
	<ControlButton :is-active="source.render" @click="toggleVisibility">
		<EyeIcon :class="$style.icon" />
	</ControlButton>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
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

		function toggleVisibility() {
			store.toggleVisibility(props.source);
		}

		return { toggleVisibility };
	},
});
</script>

<style lang="scss" module>
.icon {
	display: inline-block;
	vertical-align: middle;
}
</style>
