import type { ITextureSampler } from "./textureSampler";

export class SineWaveNoise implements ITextureSampler {
	private waveFrequencyX: number;
	private waveFrequencyZ: number;
	private waveSpeed: number;
	private rotationAngle: number;

	constructor(
		options: {
			waveFrequencyX?: number;
			waveFrequencyZ?: number;
			waveAmplitude?: number;
			waveSpeed?: number;
			rotationAngle?: number;
		} = {},
		public intensity: number = 1,
	) {
		this.waveFrequencyX = options.waveFrequencyX || 8;
		this.waveFrequencyZ = options.waveFrequencyZ || 15;
		this.waveSpeed = options.waveSpeed || 0.3;
		this.rotationAngle = options.rotationAngle || 25;
	}

	public getFloatAt(x: number, y: number, time: number): number {
		const cos = Math.cos(this.rotationAngle);
		const sin = Math.sin(this.rotationAngle);
		const rotX = x * cos - y * sin;
		const rotY = x * sin + y * cos;
		const waveX =
			(1 + Math.sin(rotX * this.waveFrequencyX + time * this.waveSpeed)) / 2;
		const waveZ =
			(1 + Math.sin(rotY * this.waveFrequencyZ + time * this.waveSpeed)) / 2;
		return (waveX + waveZ) / 2;
	}
}
