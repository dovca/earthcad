import type Tool from '~/src/tools/Tool';
import type {SceneContext} from '~/src/types';

export default class ToolFactory {
	static tools: Map<string, Tool> = new Map();

	static registerTool(name: string, tool: Tool): void {
		ToolFactory.tools.set(name, tool);
	}

	static getTool<T extends Tool>(name: string, context: SceneContext): T | null {
		const tool = ToolFactory.tools.get(name);

		return tool ? new tool(context) : null;
	}
}
