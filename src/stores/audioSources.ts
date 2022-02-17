import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useWebsocket } from '@/hooks/useWebsocket';

const { request, onConnected, subscribe } = useWebsocket();

interface AudioSource {
	name: string;
	type: string;
	typeId: string;
}

type AudioType = 'input' | 'output';

interface AppAudioSource extends AudioSource {
	typeId: 'audio_capture' | 'wasapi_input_capture' | 'wasapi_output_capture';
	muted?: boolean;
	volume?: number;
	audioType?: AudioType;
}

interface SourceMuteStateChangeEventPayload {
	sourceName: string;
	muted: boolean;
}

interface SourceVolumeStateChangeEventPayload {
	sourceName: string;
	volume: number;
	volumeDb: number;
}

const acceptableSourceTypes = ['audio_capture', 'wasapi_input_capture', 'wasapi_output_capture'];
const typeIdtoAudioTypeMap = {
	audio_capture: 'output' as AudioType,
	wasapi_input_capture: 'input' as AudioType,
	wasapi_output_capture: 'output' as AudioType,
};

export const useAudioSources = defineStore('audioSources', () => {
	const audioSources = ref<AppAudioSource[]>([]);

	onConnected(async () => {
		const response = await request('GetSourcesList');
		audioSources.value =
			response.sources.filter((source: AudioSource) => acceptableSourceTypes.includes(source.typeId)) || [];

		audioSources.value.forEach(async (source: AppAudioSource) => {
			const response = await request('GetVolume', { source: source.name, useDecibel: true });
			source.muted = response.muted || false;
			source.volume = response.volume || 0;
			source.audioType = typeIdtoAudioTypeMap[source.typeId];
		});
	});

	subscribe('SourceMuteStateChanged', (update) => {
		const sourceUpdate: SourceMuteStateChangeEventPayload = update as SourceMuteStateChangeEventPayload;
		const source = audioSources.value.find((source: AppAudioSource) => source.name === sourceUpdate.sourceName);

		if (source) {
			source.muted = sourceUpdate.muted;
		}
	});

	subscribe('SourceVolumeChanged', (update) => {
		const sourceUpdate: SourceVolumeStateChangeEventPayload = update as SourceVolumeStateChangeEventPayload;
		const source = audioSources.value.find((source: AppAudioSource) => source.name === sourceUpdate.sourceName);

		if (source) {
			source.volume = sourceUpdate.volumeDb;
		}
	});

	async function toggleMute(source: AppAudioSource) {
		return await request('SetMute', { source: source.name, mute: !source.muted });
	}

	function decreaseVolume(source: AppAudioSource) {
		const volume = (source.volume || 0) - 5;
		return setVolume(source, volume);
	}

	function increaseVolume(source: AppAudioSource) {
		const volume = (source.volume || -5) + 5;
		return setVolume(source, volume);
	}

	async function setVolume(source: AppAudioSource, volume: number) {
		volume = Math.min(0, Math.max(-100, volume));

		if (source.volume != volume) {
			return await request('SetVolume', { source: source.name, volume, useDecibel: true });
		}
	}

	return { audioSources, toggleMute, decreaseVolume, increaseVolume };
});
