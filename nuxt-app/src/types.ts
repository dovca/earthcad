import type {Mesh, PerspectiveCamera, Renderer, Scene, SphereGeometry, OrbitControls, Plane} from 'three';

export type SceneContext = {
	canvas: HTMLCanvasElement;
	scene: Scene,
	camera: PerspectiveCamera,
	renderer: Renderer,
	earth: Mesh<SphereGeometry>,
	orbitControls: OrbitControls,
	clippingPlane: Plane,
	render: () => void,
};
