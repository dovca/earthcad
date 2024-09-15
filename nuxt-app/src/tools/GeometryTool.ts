import {Raycaster, Vector2} from 'three';
import {screenToClip} from '~/src/projections';
import {lineSphereIntersection} from '~/src/intersections';
import Tool from '~/src/tools/Tool';
import type {SceneContext} from '~/src/types';

export default class GeometryTool extends Tool {
	constructor(context: SceneContext) {
		super(context);

		this.raycaster = new Raycaster();

		context.canvas.addEventListener('mousedown', this.mouseDownListener);
		context.canvas.addEventListener('click', this.clickListener);
	}

	destroy() {
		this.context.canvas.removeEventListener('mousedown', this.mouseDownListener);
		this.context.canvas.removeEventListener('click', this.clickListener);
	}

	abstract onNewPoint(point: Point): void;

	protected raycaster = new Raycaster();
	private mouseDownTimestamp = 0;
	private readonly mouseDownListener = GeometryTool.onMouseDown.bind(this);
	private readonly clickListener = GeometryTool.onClick.bind(this);

	private static onMouseDown(): void {
		this.mouseDownTimestamp = Date.now();
	}

	private static onClick(event: MouseEvent): void {
		if (this.mouseDownTimestamp + 200 < Date.now()) return;

		const {x, y} = screenToClip(event.clientX, event.clientY);
		const pointer = new Vector2(x, y);
		this.raycaster.setFromCamera(pointer, this.context.camera);

		const [intersection] = lineSphereIntersection(
			this.raycaster.ray.origin,
			this.raycaster.ray.origin.clone().add(this.raycaster.ray.direction),
			this.context.earth.position,
			this.context.earth.geometry.parameters.radius,
		);

		if (!intersection) return;

		this.onNewPoint(intersection);
	}
}
