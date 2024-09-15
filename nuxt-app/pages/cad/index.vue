<template>
	<main>
		<canvas ref="canvas" />
		<div v-if="mounted" class="fixed top-0 left-0">
			<CadToolbox :context="sceneContext" />
		</div>
	</main>
</template>

<script setup lang="ts">
	import {
		AmbientLight,
		DirectionalLight,
		Mesh,
		MeshPhongMaterial,
		PerspectiveCamera,
		Plane,
		Scene,
		SphereGeometry,
		TextureLoader,
		Vector3,
		WebGLRenderer
	} from 'three';
	import MotionControls from '~/src/MotionControls';
	import type {SceneContext} from '~/src/types';
	import {useMounted} from '@vueuse/core';

	const canvas = ref<HTMLCanvasElement | null>(null);
	const sceneContext = ref<SceneContext | null>(null);
	const mounted = useMounted();

	onMounted(() => {
		if (!canvas.value) return;

		const context = setupScene();
		sceneContext.value = context;

		requestAnimationFrame(context.render);
	});

	function setupScene(): SceneContext {
		const scene = new Scene();
		const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50000);
		const renderer = new WebGLRenderer({canvas: canvas.value});

		camera.position.z = 25000;

		const clippingPlane = new Plane(new Vector3(0, 0, 1));

		const textureLoader = new TextureLoader();
		const earthTexture = textureLoader.load('/assets/cad/textures/2k_earth_daymap.jpg');

		const sphereGeometry = new SphereGeometry(10000, 64, 64);
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

		const orbitControls = new MotionControls(camera, canvas.value);

		scene.add(earth);
		scene.add(ambientLight);
		scene.add(sunlight);

		renderer.setSize(window.innerWidth, window.innerHeight);

		renderer.localClippingEnabled = true;

		const render = () => {
			orbitControls.update();
			const cameraDirection = new Vector3(0);
			camera.getWorldDirection(cameraDirection);
			clippingPlane.normal.copy(cameraDirection).negate().normalize();
			const r = earth.geometry.parameters.radius;

			clippingPlane.constant = -r * r / camera.position.length();

			renderer.render(scene, camera);
			requestAnimationFrame(render);
		};

		return {
			canvas,
			scene,
			camera,
			renderer,
			earth,
			orbitControls,
			clippingPlane,
			render,
		};
	}
</script>
