import type { ITextureSampler } from "./textureSampler";

export class ProceduralNoise implements ITextureSampler {
	private seed: number;
	private scale: number;
	private speed: number;

	constructor(
		options: {
			seed?: number;
			scale?: number;
			persistence?: number;
			speed?: number;
		} = {},
		public intensity: number = 1,
	) {
		this.seed =
			options.seed !== undefined ? options.seed : Math.random() * 10000;
		this.scale = options.scale || 1;
		this.speed = options.speed || 0.1;
	}

	private random(x: number, y: number): number {
		const dot = Math.sin(x * 12.9898 + y * 78.233 + this.seed) * 43758.5453;
		return dot - Math.floor(dot);
	}

	private fade(t: number): number {
		return t * t * t * (t * (t * 6 - 15) + 10);
	}

	private lerp(a: number, b: number, t: number): number {
		return a + t * (b - a);
	}

	private valueNoise(x: number, y: number): number {
		const xi = Math.floor(x);
		const yi = Math.floor(y);

		const tx = x - xi;
		const ty = y - yi;

		const sx = this.fade(tx);
		const sy = this.fade(ty);

		const n00 = this.random(xi, yi);
		const n10 = this.random(xi + 1, yi);
		const n01 = this.random(xi, yi + 1);
		const n11 = this.random(xi + 1, yi + 1);

		const nx0 = this.lerp(n00, n10, sx);
		const nx1 = this.lerp(n01, n11, sx);
		return this.lerp(nx0, nx1, sy);
	}

	private seamlessNoise(
		x: number,
		y: number,
		width: number,
		height: number,
	): number {
		const nx = ((x % width) + width) % width;
		const ny = ((y % height) + height) % height;

		const wx = (nx / width) * Math.PI * 2;
		const wy = (ny / height) * Math.PI * 2;

		const xa = Math.sin(wx);
		const ya = Math.sin(wy);
		const xb = Math.cos(wx);
		const yb = Math.cos(wy);

		const noise1 = this.valueNoise(xa * 3, ya * 3);
		const noise2 = this.valueNoise(xb * 3, yb * 3);
		const noise3 = this.valueNoise(xa * 3 + yb * 5, ya * 3 - xb * 5);

		return (noise1 + noise2 + noise3) / 3;
	}

	public getFloatAt(x: number, y: number, time: number): number {
		// Animation
		const tx = x + time * this.speed;
		const ty = y + time * this.speed * 0.7;

		// Apply scale
		const scaledX = tx * this.scale;
		const scaledY = ty * this.scale;

		// Using fixed optimal values from your tests
		const domainSize = 1.0;

		// Simple single-octave noise (since octaves=1)
		return this.seamlessNoise(scaledX, scaledY, domainSize, domainSize);
	}

	public setSeed(seed: number): void {
		this.seed = seed;
	}
}
