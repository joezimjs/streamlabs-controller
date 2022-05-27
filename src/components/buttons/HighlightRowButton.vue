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
	color: #fff;
	cursor: pointer;
	margin-bottom: 0.25rem;

	&:hover,
	&:focus-visible {
		outline: none;
		background: rgb(255, 153, 34);
		background: linear-gradient(
			135deg,
			rgba(255, 153, 34, 0.45) 0%,
			rgba(254, 107, 98, 0.45) 30%,
			rgba(210, 91, 140, 0.45) 60%,
			rgba(140, 93, 140, 0.45) 85%,
			rgba(75, 88, 130, 0.45) 100%
		);
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
	background: rgb(255, 153, 34);
	background: linear-gradient(
		135deg,
		rgba(255, 153, 34, 0.65) 0%,
		rgba(254, 107, 98, 0.65) 30%,
		rgba(210, 91, 140, 0.65) 60%,
		rgba(140, 93, 140, 0.65) 85%,
		rgba(75, 88, 130, 0.65) 100%
	);

	&:hover,
	&:focus-visible {
		background: rgb(255, 153, 34);
		background: linear-gradient(
			135deg,
			rgba(255, 153, 34, 1) 0%,
			rgba(254, 107, 98, 1) 30%,
			rgba(210, 91, 140, 1) 60%,
			rgba(140, 93, 140, 1) 85%,
			rgba(75, 88, 130, 1) 100%
		);
	}
}
</style>
