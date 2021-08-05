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
		initialize() {
			if (!this.isInitialized) {
				this.isInitialized = true;

				onConnected(async () => {
					this.scenes = await request('ScenesService', 'getScenes');
					this.activeScene = await request('ScenesService', 'activeScene');

					subscribe('ScenesService', 'sceneSwitched', (newScene: Scene) => {
						this.activeScene = this.scenes.find((scene) => scene.id === newScene.id) || nullScene;
					});

					subscribe('ScenesService', 'sceneAdded', (scene: Scene) => {
						this.scenes.push(scene);
					});

					subscribe('ScenesService', 'sceneRemoved', (removedScene: Scene) => {
						this.scenes.splice(
							this.scenes.findIndex((scene) => scene.id == removedScene.id),
							1
						);
					});
				});

				onDisconnected(() => {
					this.scenes = [];
					this.activeScene = nullScene;
				});
			}
		},
	},
});
