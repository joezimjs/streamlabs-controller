import { defineStore } from 'pinia';
import { useWebsocket } from '../hooks/useWebsocket';

const { request, onConnected, subscribe } = useWebsocket();

interface SceneListResponse {
	currentScene: string;
	scenes: SceneListResponseScene[];
}

interface SceneListResponseScene {
	name: string;
}

const nullScene = { id: '', name: '', resourceId: '', nodes: [] };

export const useScenes = defineStore({
	id: 'scenes',

	__initialize: (store) => {
		async function getSceneList() {
			const sceneResponse: SceneListResponse = await request('GetSceneList');

			store.scenes = sceneResponse.scenes.map((scene) => scene.name);
			store.activeScene = sceneResponse.currentScene;
		}

		onConnected(getSceneList);

		subscribe('SwitchScenes', (newScene) => {
			if (newScene && 'scene-name' in newScene) {
				store.activeScene = newScene['scene-name'];
			}
		});

		subscribe('ScenesChanged', (data) => {
			if (data && 'scenes' in data) {
				store.scenes = data.scenes.map((scene) => scene.name);
			}
		});

		subscribe('ConnectionClosed', () => {
			store.scenes = [];
			store.activeScene = nullScene;
		});
	},

	state: () => ({
		scenes: [] as string[],
		activeScene: '',
		isInitialized: false,
	}),

	actions: {
		isActiveScene(scene: string) {
			return scene === this.activeScene;
		},
		selectScene(scene: string) {
			request('SetCurrentScene', { 'scene-name': scene });
		},
	},
});
