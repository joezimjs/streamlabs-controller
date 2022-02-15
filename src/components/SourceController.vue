<template>
	<div v-for="source in sourceList" :key="source.id">
		<span :class="$style.sourceName">
			<FolderIcon v-if="source.type === 'group'" />
			{{ source.name }}:
		</span>
		<VisibilityButton :source="source" />

		<div v-if="source.type === 'group'" :class="$style.childContainer">
			<SourceController :sources="source.groupChildren" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import VisibilityButton from '@/components/VisibilityButton.vue';
import { Source, useSources } from '@/stores/sources';
import FolderIcon from '@/components/FolderIcon.vue';

const props = defineProps({
	sources: { type: Array as PropType<Source[]>, default: null },
});
const store = useSources();
const sourceList = computed(() => (props.sources ? props.sources : store.sources));
</script>

<style lang="scss" module>
.sourceName {
	min-width: 128px;
	max-width: 128px;
	display: inline-block;
	vertical-align: middle;
	padding-left: 8px;
}

.childContainer {
	padding-left: 40px;
}
</style>
