import type { ITextureSampler } from "./textureSampler";

export class CheckerboardNoise implements ITextureSampler {
	private scale: number;
	private timeScale: number;
	private blurAmount: number;

	constructor(
		options: {
			scale?: number;
			timeScale?: number;
			blurAmount?: number;
		} = {},
		public intensity: number = 1,
	) {
		this.scale = options.scale || 5;
		this.timeScale = options.timeScale || 0.1;
		this.blurAmount =
			options.blurAmount !== undefined ? options.blurAmount : 0.3;
	}

	public getFloatAt(x: number, y: number, time: number): number {
		// Move the pattern over time
		const tx = x + time * this.timeScale;
		const ty = y; // No vertical movement

		// Apply scale
		const scaledX = tx * this.scale;
		const scaledY = ty * this.scale;

		// If no blur, use the original checkerboard
		if (this.blurAmount <= 0) {
			const cellX = Math.floor(scaledX);
			const cellY = Math.floor(scaledY);
			return (cellX + cellY) % 2 === 0 ? 1 : 0;
		}

		// For blurred version, use a more direct approach with sin functions
		// This creates a natural blur at the edges
		const sinX = Math.sin(Math.PI * scaledX);
		const sinY = Math.sin(Math.PI * scaledY);

		// Sharpen the sine waves based on blur amount (less blur = sharper)
		// When blurAmount is small, this creates steep transitions
		const sharpness = 1 / Math.max(0.01, this.blurAmount);

		const signX = Math.tanh(sinX * sharpness);
		const signY = Math.tanh(sinY * sharpness);

		// Combine X and Y patterns to create checkerboard
		// Using multiplication creates the checkerboard pattern
		const pattern = signX * signY;

		// Convert from -1..1 to 0..1
		return (pattern + 1) * 0.5;
	}
}
