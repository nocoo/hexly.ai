import { Box3, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { describe, expect, test } from "vitest";
import { createHeroObject } from "../../src/components/hero-three-objects";
import {
	heroObjectKinds,
	heroObjectPalette,
	heroObjectPose,
	shouldAnimateHero,
} from "../../src/model/hero-object";

describe("procedural header objects", () => {
	test.each(heroObjectKinds)(
		"builds a complete texture-free %s object using site colors",
		(kind) => {
			const object = createHeroObject(kind);
			const meshes: Mesh[] = [];
			object.traverse((node) => {
				if (node instanceof Mesh) meshes.push(node);
			});
			expect(meshes.length).toBeGreaterThan(5);
			const bounds = new Box3().setFromObject(object);
			const size = bounds.getSize(new Vector3());
			expect(
				[size.x, size.y, size.z].every(
					(value) => Number.isFinite(value) && value > 0 && value < 5,
				),
			).toBe(true);
			const materials = new Set<MeshStandardMaterial>();
			for (const mesh of meshes) {
				expect(mesh.geometry.getAttribute("position").count).toBeGreaterThan(0);
				expect(mesh.castShadow).toBe(true);
				const material = mesh.material as MeshStandardMaterial;
				expect(material).toBeInstanceOf(MeshStandardMaterial);
				expect(Object.values(heroObjectPalette)).toContain(
					`#${material.color.getHexString()}`,
				);
				expect(material.map).toBeNull();
				materials.add(material);
				mesh.geometry.dispose();
			}
			for (const material of materials) material.dispose();
		},
	);

	test.each(heroObjectKinds)(
		"keeps %s motion small and settles when motion is disabled",
		(kind) => {
			const base = heroObjectPose(kind, 0, false);
			for (const seconds of [0, 1, 10, 30, 60, 300]) {
				const pose = heroObjectPose(kind, seconds, true);
				expect(Math.abs(pose.x - base.x)).toBeLessThanOrEqual(0.025);
				expect(Math.abs(pose.y - base.y)).toBeLessThanOrEqual(0.045);
				expect(Math.abs(pose.z - base.z)).toBeLessThanOrEqual(0.012);
				expect(Math.abs(pose.lift)).toBeLessThanOrEqual(0.025);
				expect(heroObjectPose(kind, seconds, false)).toEqual(base);
			}
			for (const time of [-1, Number.NaN, Number.POSITIVE_INFINITY])
				expect(heroObjectPose(kind, time, true)).toEqual(base);
		},
	);

	test("animates only visible WebGL scenes without a motion restriction", () => {
		for (const intersecting of [false, true])
			for (const active of [false, true])
				for (const reduced of [false, true])
					for (const renderer of ["webgl", "svg"] as const)
						expect(
							shouldAnimateHero(intersecting, active, reduced, renderer),
						).toBe(intersecting && active && !reduced && renderer === "webgl");
	});
});
