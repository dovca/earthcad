<template>
	<div class="grid grid-cols-1 gap-1">
		<CadUiToolButton name="dot" :active-tool="activeTool" @set-tool="setActiveTool" />
		<CadUiToolButton name="line" :active-tool="activeTool" @set-tool="setActiveTool" />
	</div>
</template>

<script setup lang="ts">
	import ToolSwitcher from '~/src/ui/ToolSwitcher';
	import type {SceneContext} from '~/src/types';

	type Props = {
		context: SceneContext;
	};

	const props = defineProps<Props>();

	let toolSwitcher: ToolSwitcher | null = null;
	const activeTool = ref<string | null>(null);

	onMounted(() => {
		toolSwitcher = new ToolSwitcher(props.context);
	});

	function setActiveTool(toolId: string): void {
		const success = toolSwitcher?.setActiveTool(toolId);

		if (success) {
			activeTool.value = toolId;
		}
	}
</script>
