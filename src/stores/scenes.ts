import { ref } from 'vue';
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

export const useScenes = defineStore('scenes', () => {
	const scenes = ref<string[]>([]);
	const activeScene = ref<string>('');

	async function getSceneList() {
		const sceneResponse: SceneListResponse = await request('GetSceneList');

		scenes.value = sceneResponse.scenes.map((scene) => scene.name);
		activeScene.value = sceneResponse.currentScene;
	}

	onConnected(() => getSceneList());

	subscribe('SwitchScenes', (newScene) => {
		if (newScene && 'scene-name' in newScene) {
			activeScene.value = newScene['scene-name'];
		}
	});

	subscribe('ScenesChanged', (data) => {
		if (data && 'scenes' in data) {
			scenes.value = data.scenes.map((scene) => scene.name);
		}
	});

	subscribe('ConnectionClosed', () => {
		scenes.value = [];
		activeScene.value = '';
	});

	function isActiveScene(scene: string) {
		return scene === activeScene.value;
	}

	function selectScene(scene: string) {
		request('SetCurrentScene', { 'scene-name': scene });
	}

	return { scenes, activeScene, isActiveScene, selectScene };
});
