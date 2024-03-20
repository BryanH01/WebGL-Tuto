import * as THREE from 'three';

function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	// Camera
	const fov = 75;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 5;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 2;

	// Scene
	const scene = new THREE.Scene();

	
	// Render Targets
	const rtWidth = 512;
	const rtHeight = 512;
	const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight, {
		depthBuffer: false,
		stencilBuffer: false,
	});
	// Camera
	const rtFov = 75;
	const rtAspect = rtWidth / rtHeight;
	const rtNear = 0.1;
	const rtFar = 5;
	const rtCamera = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar);
	rtCamera.position.z = 2;
	// Scene
	const rtScene = new THREE.Scene();
	rtScene.background = new THREE.Color('red');

	// Cubes
	const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
	function makeInstance(geometry, color, x, y = 0) {
		const material = new THREE.MeshPhongMaterial({color});
	   
		const cube = new THREE.Mesh(geometry, material);
		rtScene.add(cube);
	   
		cube.position.x = x;
		cube.position.y = y;
	   
		return cube;
	}
	const rtCubes = [
		makeInstance(geometry, 0x44aa88,  0),
		makeInstance(geometry, 0x8844aa, -2),
		makeInstance(geometry, 0xaa8844,  2),
		makeInstance(geometry, 0xaa8844, 0 ,  2),
		makeInstance(geometry, 0x8844aa, 0 , -2),
	];
	// Light
	const rtColor = 0xFFFFFF;
	const rtIntensity = 3;
	const rtLight = new THREE.DirectionalLight(rtColor, rtIntensity);
	rtLight.position.set(-1, 2, 4);
	scene.add(rtLight);


	// Light
	const color = 0xFFFFFF;
	const intensity = 3;
	const light = new THREE.DirectionalLight(color, intensity);
	light.position.set(-1, 2, 4);
	rtScene.add(light);
	
	const material = new THREE.MeshPhongMaterial({
		map: renderTarget.texture,
	});
	const cube = new THREE.Mesh(geometry, material);
	scene.add(cube);

	// FUNCTIONS

	function resizeRendererToDisplaySize(renderer) {
		const canvas = renderer.domElement;
		const pixelRatio = window.devicePixelRatio;
		const width  = Math.floor( canvas.clientWidth  * pixelRatio );
		const height = Math.floor( canvas.clientHeight * pixelRatio );
		const needResize = canvas.width !== width || canvas.height !== height;
		if (needResize) {
		  renderer.setSize(width, height, false);
		}
		return needResize;
	}
	
	function render(time) {
		time *= 0.001;  // convert time to seconds
		if (resizeRendererToDisplaySize(renderer)) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}

		// rotate all the cubes in the render target scene
		rtCubes.forEach((cube, ndx) => {
			const speed = 1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;
		});

		// draw render target scene to render target
		renderer.setRenderTarget(renderTarget);
		renderer.render(rtScene, rtCamera);
		renderer.setRenderTarget(null);

		// rotate the cube in the scene
		cube.rotation.x = time;
		cube.rotation.y = time * 1.1;

		// render the scene to the canvas
		renderer.render(scene, camera);

		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);

}

main();
