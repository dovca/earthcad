export function mapRange(value: number, low1: number, high1: number, low2: number, high2: number): number {
	return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

export function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t;
}

export const DOUBLEPI = Math.PI * 2;

export const HALFPI = Math.PI / 2;
