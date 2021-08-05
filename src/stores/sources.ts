import { defineStore } from 'pinia';
import { useWebsocket } from '@/hooks/useWebsocket';
import { useScenes } from '@/stores/scenes';
import { watch } from 'vue';
import { watchEffect } from 'vue';

const { request, onConnected, onDisconnected, subscribe } = useWebsocket();

interface Source {
	id: string;
	name: string;
	resourceId: string;
}

export const useSources = defineStore({
	id: 'sources',

	state: () => ({
		sources: [] as Source[],
		isInitialized: false,
	}),

	actions: {
		async initialize() {
			if (!this.isInitialized) {
				this.isInitialized = true;

				// const sources = await request('SourcesService', 'getSources');
				// console.error(
				// 	'GOT SOURCES',
				// 	sources.map((s: any) => ({ name: s.name, resourceId: s.resourceId }))
				// );

				const sceneStore = useScenes();

				watch(
					() => sceneStore.activeScene,
					async () => {
						console.log('change scene', sceneStore.activeScene);
						if (sceneStore.activeScene.resourceId) {
							this.sources = await request(sceneStore.activeScene.resourceId, 'getNodes');
							await request(this.sources[2].resourceId, 'select');
							await request(this.sources[2].resourceId, 'setRecordingVisible', false);
						}
					}
				);

				// onConnected(async () => {
				// 	this.scenes = await request('ScenesService', 'getScenes');
				// 	this.activeScene = await request('ScenesService', 'activeScene');

				// 	subscribe('ScenesService', 'sceneSwitched', (newScene: Scene) => {
				// 		this.activeScene = newScene;
				// 	});

				// 	subscribe('ScenesService', 'sceneAdded', (scene: Scene) => {
				// 		this.scenes.push(scene);
				// 	});

				// 	subscribe('ScenesService', 'sceneRemoved', (removedScene: Scene) => {
				// 		this.scenes.splice(
				// 			this.scenes.findIndex((scene) => scene.id == removedScene.id),
				// 			1
				// 		);
				// 	});
				// });

				// onDisconnected(() => {
				// 	this.scenes = [];
				// 	this.activeScene = { id: '', name: '', resourceId: '' };
				// });
			}
		},
	},
});
