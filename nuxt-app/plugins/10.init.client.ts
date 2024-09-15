import ToolFactory from '~/src/tools/ToolFactory';
import DotTool from '~/src/tools/DotTool';
import LineTool from '~/src/tools/LineTool';

export default defineNuxtPlugin(() => {
	ToolFactory.registerTool('dot', DotTool);
	ToolFactory.registerTool('line', LineTool);
});
