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
	display: inline-flex;
	padding: 0.75em 1em;
	margin: 0.5em;
	border: 1px solid rgba(255, 255, 255, 0.5);
	appearance: none;
	background-color: transparent;
	border-radius: 0.5em;
	color: inherit;
	cursor: pointer;
	font: inherit;
	font-size: 0.875rem;
	align-items: center;

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
