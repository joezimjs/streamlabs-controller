<script setup lang="ts">
import { computed, PropType } from 'vue';
import { Source, useSources } from '@/stores/sources';
import EyeIcon from '@/components/icons/EyeIcon.vue';
import HighlightRowButton from './buttons/HighlightRowButton.vue';

const props = defineProps({
	sources: { type: Array as PropType<Source[]>, default: null },
});
const store = useSources();
const sourceList = computed(() => (props.sources ? props.sources : store.sources));

function toggleVisibility(source: Source) {
	store.toggleVisibility(source);
}
</script>

<template>
	<div v-for="source in sourceList" :key="source.id" :class="$style.sourceRow">
		<HighlightRowButton :is-active="source.render" @click="toggleVisibility(source)">
			<span :class="$style.sourceName">{{ source.name }}</span>
			<EyeIcon :is-active="source.render" />
		</HighlightRowButton>
		<div v-if="source.type === 'group'" :class="$style.childContainer">
			<SourceList :sources="source.groupChildren" />
		</div>
	</div>
</template>

<style lang="scss" module>
.sourceName {
	margin-right: auto;
}

.childContainer {
	padding-left: 2rem;
}
</style>
