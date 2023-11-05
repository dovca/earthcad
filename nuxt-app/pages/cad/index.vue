<template>
	<main>
		<canvas ref="canvas" />
	</main>
</template>

<script setup lang="ts">
	import {
		AmbientLight,
		DirectionalLight,
		Mesh,
		MeshPhongMaterial,
		PerspectiveCamera,
		Scene,
		SphereGeometry, TextureLoader,
		WebGLRenderer
	} from 'three';
	import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

	const canvas = ref<HTMLCanvasElement | null>(null);

	onMounted(() => {
		if (!canvas.value) return;

		const scene = new Scene();
		const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		const renderer = new WebGLRenderer({canvas: canvas.value});

		camera.position.z = 5;

		const testureLoader = new TextureLoader();
		const earthTexture = testureLoader.load('/assets/cad/textures/2k_earth_daymap.jpg');

		const sphereGeometry = new SphereGeometry(1, 32, 32);
		const sphereMaterial = new MeshPhongMaterial({specular: 0x555555, shininess: 30, map: earthTexture});
		const ambientLight = new AmbientLight(0x404040);

		const earth = new Mesh(sphereGeometry, sphereMaterial);

		const sunlight = new DirectionalLight(0xffffff, 1);
		sunlight.position.set(1, 0.2, 0);

		const orbitControls = new OrbitControls(camera, canvas.value);

		scene.add(earth);
		scene.add(ambientLight);
		scene.add(sunlight);

		renderer.setSize(window.innerWidth, window.innerHeight);

		function render() {
			orbitControls.update();
			renderer.render(scene, camera);
			requestAnimationFrame(render);
		}

		requestAnimationFrame(render);
	});
</script>
