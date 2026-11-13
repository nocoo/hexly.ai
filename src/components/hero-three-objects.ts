import {
	Box3,
	BoxGeometry,
	type BufferGeometry,
	CylinderGeometry,
	ExtrudeGeometry,
	Group,
	Mesh,
	MeshStandardMaterial,
	Shape,
	SphereGeometry,
	TorusGeometry,
	Vector3,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { type HeroObjectKind, heroObjectPalette } from "../model/hero-object";

export function createHeroObject(kind: HeroObjectKind) {
	const group = new Group();
	group.name = `hero-${kind}`;
	const materials = Object.fromEntries(
		Object.entries(heroObjectPalette).map(([name, color]) => [
			name,
			new MeshStandardMaterial({ color, roughness: 0.72, metalness: 0.02 }),
		]),
	) as Record<keyof typeof heroObjectPalette, MeshStandardMaterial>;

	const part = (
		geometry: BufferGeometry,
		material: MeshStandardMaterial,
		x = 0,
		y = 0,
		z = 0,
		parent = group,
	) => {
		const mesh = new Mesh(geometry, material);
		mesh.position.set(x, y, z);
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		parent.add(mesh);
		return mesh;
	};
	const slab = (width: number, height: number, depth: number) => {
		const shape = new Shape();
		const x = -width / 2;
		const y = -height / 2;
		const r = Math.min(width, height) * 0.12;
		shape.moveTo(x + r, y);
		shape.lineTo(x + width - r, y);
		shape.quadraticCurveTo(x + width, y, x + width, y + r);
		shape.lineTo(x + width, y + height - r);
		shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
		shape.lineTo(x + r, y + height);
		shape.quadraticCurveTo(x, y + height, x, y + height - r);
		shape.lineTo(x, y + r);
		shape.quadraticCurveTo(x, y, x + r, y);
		const geometry = new ExtrudeGeometry(shape, {
			depth,
			steps: 1,
			curveSegments: 6,
			bevelEnabled: true,
			bevelThickness: 0.035,
			bevelSize: 0.035,
			bevelSegments: 3,
		});
		geometry.translate(0, 0, -depth / 2);
		return geometry;
	};
	const disc = (
		radius: number,
		depth: number,
		material: MeshStandardMaterial,
		x: number,
		y: number,
		z: number,
	) => {
		const mesh = part(
			new CylinderGeometry(radius, radius, depth, 48),
			material,
			x,
			y,
			z,
		);
		mesh.rotation.x = Math.PI / 2;
		return mesh;
	};

	if (kind === "projects") {
		part(new CylinderGeometry(0.52, 0.64, 0.16, 48), materials.ink, 0, -1.48);
		part(new CylinderGeometry(0.08, 0.14, 0.48, 24), materials.moss, 0, -1.2);
		const first = part(
			new TorusGeometry(1.12, 0.065, 10, 64),
			materials.moss,
			0,
			0.1,
		);
		first.rotation.x = 0.25;
		const second = part(
			new TorusGeometry(0.98, 0.055, 10, 64),
			materials.ivory,
			0,
			0.1,
		);
		second.rotation.set(0.15, Math.PI / 2, 0.2);
		const third = part(
			new TorusGeometry(0.84, 0.05, 10, 64),
			materials.line,
			0,
			0.1,
		);
		third.rotation.set(Math.PI / 2, 0, -0.3);
		part(new CylinderGeometry(0.035, 0.035, 2.45, 16), materials.ink, 0, 0.1);
		part(new SphereGeometry(0.27, 24, 16), materials.accent, 0, 0.1);
		part(new SphereGeometry(0.1, 16, 12), materials.ivory, 0.75, 0.1, 0.35);
	} else if (kind === "templates") {
		part(slab(2.6, 1.7, 0.24), materials.moss, 0, -0.15);
		part(slab(2.25, 1.32, 0.045), materials.ivory, 0, -0.16, 0.18);
		for (let index = 0; index < 3; index++) {
			part(
				new RoundedBoxGeometry(1.3 - index * 0.18, 0.065, 0.04, 2, 0.02),
				materials.moss,
				-0.22,
				0.12 - index * 0.25,
				0.24,
			);
		}
		disc(0.13, 0.05, materials.accent, 0.75, -0.4, 0.25);
		const clapper = new Group();
		clapper.position.set(-1.28, 0.86, 0);
		clapper.rotation.z = 0.12;
		group.add(clapper);
		part(slab(2.6, 0.3, 0.26), materials.ivory, 1.28, 0, 0, clapper);
		for (let index = 0; index < 7; index++) {
			const stripe = part(
				new BoxGeometry(0.18, 0.24, 0.025),
				materials.moss,
				0.25 + index * 0.35,
				0,
				0.17,
				clapper,
			);
			stripe.rotation.z = -0.4;
		}
		disc(0.09, 0.08, materials.accent, -1.22, 0.86, 0.2);
	} else if (kind === "brand") {
		for (const [index, color] of [
			materials.moss,
			materials.line,
			materials.accent,
		].entries()) {
			const swatch = new Group();
			swatch.rotation.z = (index - 1) * -0.36;
			swatch.position.set(-0.5, -1.02, index * 0.18);
			group.add(swatch);
			part(slab(1.18, 2.25, 0.1), materials.ivory, 0, 1, 0, swatch);
			part(slab(0.94, 1.45, 0.035), color, 0, 1.24, 0.1, swatch);
			part(
				new RoundedBoxGeometry(0.48, 0.055, 0.035, 2, 0.02),
				materials.moss,
				-0.12,
				0.36,
				0.1,
				swatch,
			);
		}
		disc(0.13, 0.12, materials.ink, -0.5, -0.98, 0.45);
		disc(0.055, 0.03, materials.paper, -0.5, -0.98, 0.53);
	} else {
		disc(1.2, 0.42, materials.moss, 0, 0, 0);
		disc(1.06, 0.08, materials.ivory, 0, 0, 0.26);
		part(new TorusGeometry(1.07, 0.055, 10, 64), materials.paper, 0, 0, 0.34);
		for (let index = 0; index < 13; index++) {
			const angle = -2.05 + index * (4.1 / 12);
			const tick = part(
				new RoundedBoxGeometry(
					0.035,
					index % 3 === 0 ? 0.16 : 0.09,
					0.025,
					1,
					0.01,
				),
				materials.moss,
				Math.sin(angle) * 0.85,
				Math.cos(angle) * 0.85,
				0.32,
			);
			tick.rotation.z = -angle;
		}
		const needle = part(
			new RoundedBoxGeometry(0.055, 0.9, 0.04, 2, 0.02),
			materials.accent,
			0.2,
			0.2,
			0.37,
		);
		needle.rotation.z = -0.78;
		disc(0.12, 0.1, materials.accent, 0, 0, 0.4);
		part(slab(1.25, 0.18, 0.6), materials.ink, 0, -1.28, -0.05);
	}

	const bounds = new Box3().setFromObject(group);
	group.position.sub(bounds.getCenter(new Vector3()));
	return group;
}
