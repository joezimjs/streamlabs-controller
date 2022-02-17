<script setup lang="ts">
import AppButton from './buttons/AppButton.vue';
import { useHotKeys, KEY } from '@/hooks/useHotKeys';

const { triggerHotKey } = useHotKeys();
</script>

<template>
	<div :class="$style.cameraGrid">
		<AppButton is-active @click="triggerHotKey(KEY.Ctrl, KEY.Alt, 'NUM7')">&nbsp;</AppButton>
		<AppButton is-active @click="triggerHotKey(KEY.Ctrl, KEY.Alt, 'NUM9')">&nbsp;</AppButton>
		<AppButton is-active @click="triggerHotKey(KEY.Ctrl, KEY.Alt, 'NUM1')">&nbsp;</AppButton>
		<AppButton is-active @click="triggerHotKey(KEY.Ctrl, KEY.Alt, 'NUM3')">&nbsp;</AppButton>
	</div>
</template>

<style lang="scss" module>
.cameraGrid {
	display: grid;
	gap: 0.5rem;
	grid-template-columns: 1fr 1fr;
}
</style>
