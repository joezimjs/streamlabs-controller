import { defineStore } from 'pinia';
import { useWebsocket } from '@/hooks/useWebsocket';

const { request, onConnected, subscribe } = useWebsocket();

interface AudioSource {
	sourceId: string;
	name: string;
	audioMixers: number;
	forceMono: boolean;
	syncOffset: number;
	muted: boolean;
	mixerHidden: boolean;
	resourceId: string;
}

export const useAudioSources = defineStore({
	id: 'audioSources',

	/**
	 * INITIALIZE STORE
	 */
	__initialize(store) {
		onConnected(async () => {
			store.audioSources = await request('AudioService', 'getSources');
		});

		subscribe('SourcesService', 'sourceUpdated', (updatedSource: AudioSource) => {
			store.audioSources.find((source: AudioSource) => source.sourceId === updatedSource.sourceId).muted =
				updatedSource.muted;
		});
	},

	/**
	 * STATE
	 */
	state: () => ({
		audioSources: [] as AudioSource[],
	}),

	/**
	 * GETTERS
	 */
	getters: {
		getAudioType() {
			return (aSource: AudioSource): 'input' | 'output' => {
				return aSource.sourceId.includes('output') ? 'output' : 'input';
			};
		},
	},

	/**
	 * ACTIONS
	 */
	actions: {
		async setMuted(aSource: AudioSource, isMuted: boolean = true) {
			await request(aSource.resourceId, 'setMuted', isMuted);
			// aSource.muted = isMuted;
		},
	},
});
