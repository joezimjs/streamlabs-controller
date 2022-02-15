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
	audioType?: AudioType;
}

interface SourceMuteStateChangeEventPayload {
	sourceName: string;
	muted: boolean;
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
			source.muted = (await request('GetMute', { source: source.name })).muted || false;
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

	async function toggleMute(source: AppAudioSource) {
		await request('SetMute', { source: source.name, mute: !source.muted });
	}

	return { audioSources, toggleMute };
});
