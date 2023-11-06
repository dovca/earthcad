<template>
	<main>
		<canvas ref="canvas" />
	</main>
</template>

<script setup lang="ts">
	import {
		AmbientLight, BufferGeometry,
		DirectionalLight, Float32BufferAttribute,
		Mesh,
		MeshPhongMaterial,
		PerspectiveCamera, Plane, Points, PointsMaterial, Raycaster,
		Scene,
		SphereGeometry, TextureLoader, Vector2, Vector3,
		WebGLRenderer
	} from 'three';
	import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
	import {useMouse} from '@vueuse/core';
	import {lineSphereIntersection} from '~/src/intersections';

	const canvas = ref<HTMLCanvasElement | null>(null);

	const mouse = useMouse({target: canvas});

	onMounted(() => {
		if (!canvas.value) return;

		const scene = new Scene();
		const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		const renderer = new WebGLRenderer({canvas: canvas.value});

		camera.position.z = 5;

		const clippingPlane = new Plane(new Vector3(0, 0, 1));

		const testureLoader = new TextureLoader();
		const earthTexture = testureLoader.load('/assets/cad/textures/2k_earth_daymap.jpg');

		const sphereGeometry = new SphereGeometry(1, 32, 32);
		const sphereMaterial = new MeshPhongMaterial({
			specular: 0x555555,
			shininess: 30,
			map: earthTexture,
			depthTest: false,
		});
		const ambientLight = new AmbientLight(0x404040);

		const earth = new Mesh(sphereGeometry, sphereMaterial);

		const sunlight = new DirectionalLight(0xffffff, 1);
		sunlight.position.set(1, 0.2, 0);

		const orbitControls = new OrbitControls(camera, canvas.value);

		scene.add(earth);
		scene.add(ambientLight);
		scene.add(sunlight);

		renderer.setSize(window.innerWidth, window.innerHeight);

		const pointer = new Vector2();

		watch([mouse.x, mouse.y], () => {
			pointer.x = (mouse.x.value / window.innerWidth) * 2 - 1;
			pointer.y = -(mouse.y.value / window.innerHeight) * 2 + 1;
		});

		renderer.localClippingEnabled = true;

		const pointsMaterial = new PointsMaterial({
			color: 0xff0000,
			size: 5,
			clippingPlanes: [clippingPlane],
			sizeAttenuation: false,
		});


		let mouseDownTimestamp = 0;

		canvas.value.addEventListener('mousedown', () => {
			mouseDownTimestamp = Date.now();
		});
		canvas.value.addEventListener('click', () => {
			if (mouseDownTimestamp + 200 < Date.now()) return;

			const raycaster = new Raycaster();
			raycaster.setFromCamera(pointer, camera);

			const [intersection] = lineSphereIntersection(
				raycaster.ray.origin,
				raycaster.ray.origin.clone().add(raycaster.ray.direction),
				earth.position,
				earth.geometry.parameters.radius,
			);

			if (!intersection) return;

			const vertices = [intersection.x, intersection.y, intersection.z];
			const geometry = new BufferGeometry();
			geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
			const points = new Points(geometry, pointsMaterial);
			scene.add(points);
		});

		function render() {
			orbitControls.update();

			const cameraDirection = new Vector3(0);
			camera.getWorldDirection(cameraDirection);
			clippingPlane.normal.copy(cameraDirection).negate();
			clippingPlane.constant = -1 + Math.atan(camera.position.length() - 1) / Math.PI * 2;

			renderer.render(scene, camera);
			requestAnimationFrame(render);
		}

		requestAnimationFrame(render);
	});
</script>
