import {Vector3} from 'three';

// http://www.codeproject.com/Articles/19799/Simple-Ray-Tracing-in-C-Part-II-Triangles-Intersec
export function lineSphereIntersection(
	linePoint0: Vector3,
	linePoint1: Vector3,
	circleCenter: Vector3,
	circleRadius: number,
): Vector3[] {
	const {x: cx, y: cy, z: cz} = circleCenter;
	const {x: px, y: py, z: pz} = linePoint0;

	const vx = linePoint1.x - px;
	const vy = linePoint1.y - py;
	const vz = linePoint1.z - pz;

	const A = vx * vx + vy * vy + vz * vz;
	const B = 2.0 * (px * vx + py * vy + pz * vz - vx * cx - vy * cy - vz * cz);
	const C = px * px - 2 * px * cx + cx * cx + py * py - 2 * py * cy + cy * cy +
		pz * pz - 2 * pz * cz + cz * cz - circleRadius * circleRadius;

	// discriminant
	const D = B * B - 4 * A * C;

	if (D < 0) return [];

	const t1 = (-B - Math.sqrt(D)) / (2.0 * A);

	const solution1 = new Vector3(
		linePoint0.x * (1 - t1) + t1 * linePoint1.x,
		linePoint0.y * (1 - t1) + t1 * linePoint1.y,
		linePoint0.z * (1 - t1) + t1 * linePoint1.z,
	);

	if (D == 0) return [solution1];

	const t2 = (-B + Math.sqrt(D)) / (2.0 * A);
	const solution2 = new Vector3(
		linePoint0.x * (1 - t2) + t2 * linePoint1.x,
		linePoint0.y * (1 - t2) + t2 * linePoint1.y,
		linePoint0.z * (1 - t2) + t2 * linePoint1.z,
	);

	// prefer a solution that's on the line segment itself

	if (Math.abs(t1 - 0.5) < Math.abs(t2 - 0.5)) return [solution1, solution2];

	return [solution2, solution1];
}
