import {
	ACESFilmicToneMapping,
	AmbientLight,
	Box3,
	type BufferGeometry,
	Color,
	DataTexture,
	DirectionalLight,
	LinearFilter,
	type Material,
	Mesh,
	MeshBasicMaterial,
	OrthographicCamera,
	PCFShadowMap,
	PlaneGeometry,
	RGBAFormat,
	Scene,
	SRGBColorSpace,
	Vector3,
	WebGLRenderer,
} from "three";
import { SVGRenderer } from "three/addons/renderers/SVGRenderer.js";
import {
	type HeroObjectKind,
	heroObjectPalette,
	heroObjectPose,
} from "../model/hero-object";
import { createHeroObject } from "./hero-three-objects";

export function createHeroRenderer(host: HTMLElement, kind: HeroObjectKind) {
	const scene = new Scene();
	const object = createHeroObject(kind);
	const origin = object.position.clone();
	const pose = (seconds: number, moving: boolean) => {
		const state = heroObjectPose(kind, seconds, moving);
		object.rotation.set(state.x, state.y, state.z);
		object.position.set(origin.x, origin.y + state.lift, origin.z);
	};
	pose(0, false);
	scene.add(object);
	const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
	const ambient = new AmbientLight(
		new Color(heroObjectPalette.ivory).multiplyScalar(0.4),
		1,
	);
	const key = new DirectionalLight(heroObjectPalette.ivory, 2.8);
	key.position.set(-3, 5, 7);
	key.castShadow = true;
	key.shadow.mapSize.set(512, 512);
	key.shadow.camera.left = -4;
	key.shadow.camera.right = 4;
	key.shadow.camera.top = 4;
	key.shadow.camera.bottom = -4;
	key.shadow.normalBias = 0.03;
	const fill = new DirectionalLight(heroObjectPalette.paper, 1.1);
	fill.position.set(4, 2, -3);
	scene.add(ambient, key, fill);
	const shadowPixels = new Uint8Array(64 * 64 * 4);
	const shadowColor = new Color(heroObjectPalette.ink).getHex();
	for (let y = 0; y < 64; y++) {
		for (let x = 0; x < 64; x++) {
			const radius = Math.hypot((x - 31.5) / 31.5, (y - 31.5) / 31.5);
			const at = (y * 64 + x) * 4;
			shadowPixels[at] = (shadowColor >> 16) & 255;
			shadowPixels[at + 1] = (shadowColor >> 8) & 255;
			shadowPixels[at + 2] = shadowColor & 255;
			shadowPixels[at + 3] = Math.round(
				Math.max(0, 1 - radius * radius) ** 3 * 45,
			);
		}
	}
	const shadowTexture = new DataTexture(shadowPixels, 64, 64, RGBAFormat);
	shadowTexture.colorSpace = SRGBColorSpace;
	shadowTexture.minFilter = LinearFilter;
	shadowTexture.magFilter = LinearFilter;
	shadowTexture.needsUpdate = true;
	const objectBounds = new Box3().setFromObject(object);
	const objectSize = objectBounds.getSize(new Vector3());
	const floor = new Mesh(
		new PlaneGeometry(
			Math.min(3, objectSize.x * 1.1),
			Math.min(2, Math.max(1, objectSize.z)),
		),
		new MeshBasicMaterial({
			map: shadowTexture,
			transparent: true,
			depthWrite: false,
			toneMapped: false,
		}),
	);
	floor.rotation.x = -Math.PI / 2;
	floor.position.y = objectBounds.min.y - 0.12;
	scene.add(floor);

	let webgl: WebGLRenderer | null = null;
	let renderer: WebGLRenderer | SVGRenderer;
	let mode: "webgl" | "svg" = "webgl";
	let playing = false;
	let elapsed = 0;
	let previous = 0;
	let lastDraw = 0;
	let width = 1;
	let height = 1;
	let disposed = false;

	const makeStatic = () => {
		mode = "svg";
		floor.visible = false;
		key.intensity = 0.85;
		fill.intensity = 0.25;
		const svg = new SVGRenderer();
		svg.setQuality("high");
		svg.setPrecision(3);
		return svg;
	};
	const canvas = document.createElement("canvas");
	try {
		const context = canvas.getContext("webgl2", {
			alpha: true,
			antialias: true,
			powerPreference: "low-power",
		});
		if (context) {
			webgl = new WebGLRenderer({
				canvas,
				context,
				alpha: true,
				antialias: true,
			});
			webgl.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
			webgl.outputColorSpace = SRGBColorSpace;
			webgl.toneMapping = ACESFilmicToneMapping;
			webgl.toneMappingExposure = 1.08;
			webgl.setClearColor(0x000000, 0);
			webgl.shadowMap.enabled = true;
			webgl.shadowMap.type = PCFShadowMap;
		}
	} catch {
		webgl?.dispose();
		webgl = null;
	}
	renderer = webgl ?? makeStatic();
	const mount = () => {
		renderer.domElement.setAttribute("aria-hidden", "true");
		host.replaceChildren(renderer.domElement);
		host.dataset.renderer = mode;
	};
	mount();
	const render = () => {
		if (disposed) return;
		renderer.render(scene, camera);
		if (mode === "svg") renderer.domElement.style.background = "transparent";
	};
	const resize = (nextWidth: number, nextHeight: number) => {
		if (disposed || nextWidth <= 0 || nextHeight <= 0) return;
		width = nextWidth;
		height = nextHeight;
		const bounds = new Box3().setFromObject(object);
		const center = bounds.getCenter(new Vector3());
		camera.position.copy(center).add(new Vector3(3.2, 2.5, 8));
		camera.lookAt(center);
		const aspect = width / height;
		camera.left = -aspect;
		camera.right = aspect;
		camera.top = 1;
		camera.bottom = -1;
		camera.updateProjectionMatrix();
		camera.updateMatrixWorld();
		let extent = 0;
		for (const x of [bounds.min.x, bounds.max.x])
			for (const y of [bounds.min.y, bounds.max.y])
				for (const z of [bounds.min.z, bounds.max.z]) {
					const point = new Vector3(x, y, z).project(camera);
					extent = Math.max(extent, Math.abs(point.x), Math.abs(point.y));
				}
		const halfHeight = extent * 1.25;
		camera.left = -halfHeight * aspect;
		camera.right = halfHeight * aspect;
		camera.top = halfHeight;
		camera.bottom = -halfHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(width, height);
		render();
	};
	const animate = (time: number) => {
		if (!playing || disposed) return;
		if (previous) elapsed += Math.min((time - previous) / 1000, 0.05);
		previous = time;
		if (time - lastDraw < 1000 / 30) return;
		lastDraw = time;
		pose(elapsed, true);
		render();
	};
	const setMotion = (moving: boolean, settle = false) => {
		if (disposed) return;
		const next = moving && mode === "webgl";
		if (playing !== next) {
			playing = next;
			previous = 0;
			webgl?.setAnimationLoop(next ? animate : null);
		}
		if (settle) {
			elapsed = 0;
			pose(0, false);
			render();
		}
	};
	return {
		get mode() {
			return mode;
		},
		canvas,
		resize,
		setMotion,
		showStatic() {
			setMotion(false);
			webgl?.dispose();
			webgl = null;
			renderer = makeStatic();
			pose(0, false);
			mount();
			resize(width, height);
		},
		dispose() {
			if (disposed) return;
			setMotion(false);
			disposed = true;
			const geometries = new Set<BufferGeometry>();
			const materials = new Set<Material>();
			scene.traverse((node) => {
				if (!(node instanceof Mesh)) return;
				geometries.add(node.geometry);
				for (const material of Array.isArray(node.material)
					? node.material
					: [node.material])
					materials.add(material);
			});
			for (const geometry of geometries) geometry.dispose();
			for (const material of materials) material.dispose();
			shadowTexture.dispose();
			key.shadow.map?.dispose();
			webgl?.dispose();
			webgl?.forceContextLoss();
			host.replaceChildren();
		},
	};
}

export type HeroRenderer = ReturnType<typeof createHeroRenderer>;
