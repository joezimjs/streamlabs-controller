import { defineStore } from 'pinia';
import { useWebsocket } from '@/hooks/useWebsocket';
import { useScenes } from '@/stores/scenes';
import { watch } from 'vue';

const { request, subscribe } = useWebsocket();

export interface Source {
	alignment: number;
	cx: number;
	cy: number;
	groupChildren?: Source[];
	id: number;
	locked: boolean;
	muted: boolean;
	name: string;
	render: boolean;
	source_cx: number;
	source_cy: number;
	type: string;
	volume: number;
	x: number;
	y: number;
	parentGroupName?: string;
}

export const useSources = defineStore({
	id: 'sources',

	/**
	 * INITIALIZE STORE
	 */
	__initialize(store) {
		const sceneStore = useScenes();

		async function getSources() {
			const response = await request('GetCurrentScene');
			store.sources = response.sources;
		}

		watch(
			() => sceneStore.activeScene,
			async () => {
				if (sceneStore.activeScene) {
					getSources();
				}
			},
			{ immediate: true }
		);

		subscribe('SourceOrderChanged', getSources);
		subscribe('SceneItemAdded', getSources);
		subscribe('SceneItemRemoved', getSources);
		subscribe('SceneItemVisibilityChanged', getSources);
	},

	/**
	 * STATE
	 */
	state: () => ({
		sources: [] as Source[],
	}),

	/**
	 * ACTIONS
	 */
	actions: {
		async toggleVisibility(source: Source) {
			request('SetSceneItemRender', { source: source.name, render: !source.render });
		},
	},
});
