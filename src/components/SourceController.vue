<template>
	<ControlButton v-for="source in sources" :key="source.id">
		{{ source.name }}
	</ControlButton>
</template>

<script lang="ts">
import { defineComponent, toRef } from 'vue';
import ControlButton from '@/components/ControlButton.vue';
import { useSources } from '@/stores/sources';

export default defineComponent({
	components: { ControlButton },
	setup() {
		let sourceStore = useSources();
		sourceStore.initialize();

		return {
			sources: toRef(sourceStore, 'sources'),
		};
	},
});
</script>
