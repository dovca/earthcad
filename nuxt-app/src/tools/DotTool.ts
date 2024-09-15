import {BufferGeometry, Float32BufferAttribute, Points, PointsMaterial} from 'three';
import GeometryTool from '~/src/tools/GeometryTool';
import type {SceneContext} from '~/src/types';

export default class DotTool extends GeometryTool {
	constructor(context: SceneContext) {
		super(context);

		this.pointsMaterial = new PointsMaterial({
			color: 0xff0000,
			size: 5,
			clippingPlanes: [context.clippingPlane],
			sizeAttenuation: false,
		});
	}

	onNewPoint(point: Point): void {
		const vertices = [point.x, point.y, point.z];
		const geometry = new BufferGeometry();
		geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
		const points = new Points(geometry, this.pointsMaterial);
		this.context.scene.add(points);
	}

	destroy(): void {
		super.destroy();
		this.pointsMaterial.dispose();
	}
}
