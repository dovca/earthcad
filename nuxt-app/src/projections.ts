export function screenToClip(x: number, y: number) {
	return {
		x: x / window.innerWidth * 2 - 1,
		y: -(y / window.innerHeight) * 2 + 1,
	};
}
