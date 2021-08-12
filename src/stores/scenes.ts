import { defineStore } from 'pinia';
import { useWebsocket } from '../hooks/useWebsocket';

const { request, onConnected, onDisconnected, subscribe } = useWebsocket();

interface Scene {
	id: string;
	name: string;
	resourceId: string;
	nodes: object[];
}

const nullScene = { id: '', name: '', resourceId: '', nodes: [] };

export const useScenes = defineStore({
	id: 'scenes',

	__initialize: (store) => {
		onConnected(async () => {
			store.scenes = await request('ScenesService', 'getScenes');
			store.activeScene = await request('ScenesService', 'activeScene');

			subscribe('ScenesService', 'sceneSwitched', (newScene: Scene) => {
				store.activeScene = store.scenes.find((scene: Scene) => scene.id === newScene.id) || nullScene;
			});

			subscribe('ScenesService', 'sceneAdded', (scene: Scene) => {
				store.scenes.push(scene);
			});

			subscribe('ScenesService', 'sceneRemoved', (removedScene: Scene) => {
				store.scenes.splice(
					store.scenes.findIndex((scene: Scene) => scene.id == removedScene.id),
					1
				);
			});
		});

		onDisconnected(() => {
			store.scenes = [];
			store.activeScene = nullScene;
		});
	},

	state: () => ({
		scenes: [] as Scene[],
		activeScene: nullScene as Scene,
		isInitialized: false as boolean,
	}),

	actions: {
		isActiveScene(scene: Scene) {
			return scene.id === this.activeScene.id;
		},
		selectScene(scene: Scene) {
			request(scene.resourceId, 'makeActive');
		},
	},
});
