<template>
	<div v-for="source in sources" :key="source.id">
		<span :class="$style.sourceName">
			<FolderIcon v-if="source.sceneNodeType === 'folder'" /> {{ source.name }}:
		</span>
		<VisibilityButton :source="source" />
		<RecordingVisibilityButton :source="source" />
		<StreamVisibilityButton :source="source" />
		<BothVisibilityButton :source="source" />

		<div v-if="source.sceneNodeType === 'folder'" :class="$style.childContainer">
			<SourceController :parent-id="source.id" />
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
// import ControlButton from '@/components/ControlButton.vue';
import VisibilityButton from '@/components/VisibilityButton.vue';
import RecordingVisibilityButton from '@/components/RecordingVisibilityButton.vue';
import StreamVisibilityButton from '@/components/StreamVisibilityButton.vue';
import BothVisibilityButton from '@/components/BothVisibilityButton.vue';
import { useSources } from '@/stores/sources';
import FolderIcon from '@/components/FolderIcon.vue';

export default defineComponent({
	components: {
		// ControlButton,
		FolderIcon,
		VisibilityButton,
		RecordingVisibilityButton,
		StreamVisibilityButton,
		BothVisibilityButton,
	},
	props: {
		parentId: { type: String, default: null },
	},
	setup(props) {
		let store = useSources();
		let sources = computed(() => {
			if (props.parentId) return store.getChildSources(props.parentId);
			else return store.rootSources;
		});
		return { store, sources };
	},
});
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
