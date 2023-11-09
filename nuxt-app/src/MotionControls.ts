import {Camera, Spherical, Vector3} from 'three';

const earthRotationAxis = new Vector3(0, 1, 0);
const origin = new Vector3(0, 0, 0);

export default class MotionControls {
	private camera: Camera;
	private canvas: HTMLCanvasElement;
	private isPointerDown = false;
	private pointerX = -1;
	private pointerY = -1;
	private spherical: Spherical;
	private scrollAmount = 0;
	private pointerDownHandler: (event: PointerEvent) => void;
	private pointerMoveHandler: (event: PointerEvent) => void;
	private pointerUpHandler: (event: PointerEvent) => void;
	private mouseWheelHandler: (event: WheelEvent) => void;

	constructor(camera: Camera, canvas: HTMLCanvasElement) {
		this.camera = camera;
		this.canvas = canvas;
		this.spherical = new Spherical().setFromVector3(this.camera.position);
		this.pointerDownHandler = this.onPointerDown.bind(this);
		this.pointerMoveHandler = this.onPointerMove.bind(this);
		this.pointerUpHandler = this.onPointerUp.bind(this);
		this.mouseWheelHandler = this.onMouseWheel.bind(this);
		this.canvas.addEventListener('pointerdown', this.pointerDownHandler);
		this.canvas.addEventListener('pointermove', this.pointerMoveHandler);
		this.canvas.addEventListener('pointerup', this.pointerUpHandler);
		this.canvas.addEventListener('wheel', this.mouseWheelHandler, {passive: false});
	}

	update() {
		this.camera.position.setFromSpherical(this.spherical);
		this.camera.lookAt(origin);
	}

	private onPointerDown(event: PointerEvent) {
		this.isPointerDown = true;
		this.pointerX = event.clientX;
		this.pointerY = event.clientY;
	}

	private onPointerMove(event: PointerEvent) {
		if (!this.isPointerDown) return;
		const {x, y} = event;
		const dx = x - this.pointerX;
		const dy = y - this.pointerY;
		const scale = 0.005 * Math.pow(2, -this.scrollAmount * 0.001);
		this.spherical.theta -= dx * scale;
		this.spherical.phi -= dy * scale;
		this.spherical.makeSafe();

		this.pointerX = x;
		this.pointerY = y;
	}

	private onPointerUp(event: PointerEvent) {
		this.isPointerDown = false;
		this.pointerX = -1;
		this.pointerY = -1;
	}

	private onMouseWheel(event: WheelEvent) {
		this.scrollAmount = Math.min(Math.max(0, this.scrollAmount - event.deltaY), 30000);
		this.spherical.radius = Math.min(Math.max(10001, 10001 + 20000 * Math.pow(2, -this.scrollAmount * 0.001)), 30000);
		event.preventDefault();
	}

	destroy() {
		this.canvas.removeEventListener('pointerdown', this.pointerDownHandler);
		this.canvas.removeEventListener('pointermove', this.pointerMoveHandler);
		this.canvas.removeEventListener('pointerup', this.pointerUpHandler);
		this.canvas.removeEventListener('wheel', this.mouseWheelHandler);
	}
}