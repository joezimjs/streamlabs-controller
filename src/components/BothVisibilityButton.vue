<template>
	<ControlButton @click="toggleVisibility">
		<RecordIcon :class="$style.icon" /> <PlusIcon :class="$style.icon" /> <StreamIcon :class="$style.icon" />
	</ControlButton>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useSources, Source } from '@/stores/sources';
import ControlButton from '@/components/ControlButton.vue';
import RecordIcon from '@/components/RecordIcon.vue';
import StreamIcon from '@/components/StreamIcon.vue';
import PlusIcon from '@/components/PlusIcon.vue';

export default defineComponent({
	components: { ControlButton, RecordIcon, StreamIcon, PlusIcon },
	props: {
		source: {
			type: Object as PropType<Source>,
			required: true,
		},
	},
	setup(props) {
		let store = useSources();

		function toggleVisibility() {
			store.setVisibility(props.source, true, 'recordingVisible');
			store.setVisibility(props.source, true, 'streamVisible');
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
