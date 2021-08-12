import { defineStore } from 'pinia';
import { useWebsocket } from '@/hooks/useWebsocket';
import { useScenes } from '@/stores/scenes';
import { watch } from 'vue';

const { request, onConnected, subscribe } = useWebsocket();

export interface Source {
	id: string;
	name: string;
	resourceId: string;
	parentId?: string;
	visible?: boolean;
	streamVisible?: boolean;
	recordingVisible?: boolean;
	sceneNodeType?: string;
}

export const useSources = defineStore({
	id: 'sources',

	/**
	 * INITIALIZE STORE
	 */
	__initialize(store) {
		const sceneStore = useScenes();

		watch(
			() => sceneStore.activeScene,
			async () => {
				if (sceneStore.activeScene.resourceId) {
					store.sources = await request(sceneStore.activeScene.resourceId, 'getNodes');
				}
			}
		);

		onConnected(() => {
			subscribe('ScenesService', 'itemUpdated', (updatedSource: Source) => {
				const i = store.sources.findIndex((source: Source) => source.id === updatedSource.id);
				Object.assign(store.sources[i], updatedSource);
			});
		});
	},

	/**
	 * STATE
	 */
	state: () => ({
		sources: [] as Source[],
	}),

	/**
	 * GETTERS
	 */
	getters: {
		rootSources(state) {
			return state.sources.filter((source) => !source.parentId);
		},

		getChildSources(state) {
			// let sources = {};

			// state.sources.forEach(source => {
			// 	if (source.parentId)
			// })
			return (parentId: string) => {
				return state.sources.filter((source) => source.parentId === parentId);
			};
		},

		// Will say a folder is visible unless all of it's children are marked as not visible
		getFolderVisibility() {
			return (parentId: string, property: 'visible' | 'streamVisible' | 'recordingVisible' = 'visible') => {
				return this.getChildSources(parentId).reduce((result, source) => {
					return source[property] || result;
				}, false);
			};
		},

		sourceIsVisible() {
			return (source: Source, property: 'visible' | 'streamVisible' | 'recordingVisible' = 'visible') => {
				return source.sceneNodeType === 'folder' ? this.getFolderVisibility(source.id, property) : source[property];
			};
		},
	},

	/**
	 * ACTIONS
	 */
	actions: {
		async setVisibility(
			source: Source,
			toVisibility: boolean,
			property: 'visible' | 'streamVisible' | 'recordingVisible' = 'visible'
		) {
			const functionName = {
				visible: 'setVisibility',
				streamVisible: 'setStreamVisible',
				recordingVisible: 'setRecordingVisible',
			};

			if (source.sceneNodeType === 'folder') {
				const sourceIds = this.getChildSources(source.id).map((child) => child.id);
				await request('SelectionService', 'select', sourceIds);
				return request('SelectionService', functionName[property], toVisibility);
			} else {
				await request(source.resourceId, 'select');
				request(source.resourceId, functionName[property], toVisibility);
			}
		},
	},
});
