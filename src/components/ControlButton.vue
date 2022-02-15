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
	display: inline-block;
	padding: 1em;
	margin: 0.5em;
	border: 1px solid #ddd;
	appearance: none;
	background-color: transparent;
	border-radius: 0.5em;
	color: inherit;
	cursor: pointer;

	&:active,
	&:hover,
	&:focus {
		outline: none;
		box-shadow: 0 0 10px 1px rebeccapurple;
	}

	&:disabled {
		color: #999;
		background: rgba(0, 0, 0, 0.3);
		border-color: currentColor;
	}
}

.active {
	background-color: rgba(255, 255, 255, 0.2);
}
</style>
