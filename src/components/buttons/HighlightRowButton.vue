<template>
	<button :class="[$style.controlButton, isActive ? $style.active : '']">
		<slot></slot>
	</button>
</template>

<script setup lang="ts">
defineProps({
	isActive: { type: Boolean, default: false },
});
</script>

<style lang="scss" module>
.controlButton {
	display: flex;
	width: 100%;
	gap: 0.5em;
	font: inherit;
	padding: 1em;
	border: 0;
	appearance: none;
	background-color: transparent;
	color: inherit;
	cursor: pointer;
	margin-bottom: 0.25rem;

	&:hover,
	&:focus-visible {
		outline: none;
		background-color: rgba(255, 255, 255, 0.1);
	}

	&:disabled {
		color: rgba(255, 255, 255, 0.3);
		border-color: rgba(255, 255, 255, 0.3);
		background: transparent;

		&:hover,
		&:focus-visible {
			background-color: transparent;
		}
	}
}

.active {
	background-color: rgba(255, 255, 255, 0.25);

	&:hover,
	&:focus-visible {
		background-color: rgba(255, 255, 255, 0.4);
	}
}
</style>
