import GeometryTool from '~/src/tools/GeometryTool';

export default class LineTool extends GeometryTool {
	onNewPoint(point) {
		console.log('LineTool', point);
	}
}
