<template>
	<button
		class="p-2 rounded-md"
		:class="activeTool === name ? 'bg-yellow-200' : 'bg-white'"
		type="button"
		@click="emit('set-tool', name)"
	>
		<slot>
			{{ name }}
		</slot>
	</button>
</template>

<script setup lang="ts">
	type Props = {
		name: string;
		activeTool: string | null;
	};

	type Emits = {
		'set-tool': (name: string) => void;
	};

	defineProps<Props>();
	const emit = defineEmits<Emits>();
</script>
