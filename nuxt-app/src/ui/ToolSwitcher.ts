import type Tool from '~/src/tools/Tool';
import ToolFactory from '~/src/tools/ToolFactory';
import type {SceneContext} from '~/src/types';

export default class ToolSwitcher {
	constructor(private context: SceneContext) {
	}

	setActiveTool(toolName: string): boolean {
		const tool = ToolFactory.getTool(toolName, this.context);

		if (tool) {
			this.activeTool?.destroy?.();
			this.activeTool = tool;

			return true;
		}

		return false;
	}

	private activeTool: Tool | null = null;
}
