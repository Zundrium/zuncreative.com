import type { ITextureSampler } from "./textureSampler";

export class SineWaveNoise implements ITextureSampler {
	private waveFrequencyX: number;
	private waveFrequencyZ: number;
	private waveSpeed: number;
	private angledCos: number;
	private angledSin: number;

	constructor(public intensity: number = 1) {
		this.waveFrequencyX = 8;
		this.waveFrequencyZ = 15;
		this.waveSpeed = 0.3;

		this.angledCos = Math.cos(25);
		this.angledSin = Math.sin(25);
	}

	public getFloatAt(x: number, y: number, time: number): number {
		const waveX =
			(1 +
				Math.sin(
					(x * this.angledCos - y * this.angledSin) * this.waveFrequencyX +
						time * this.waveSpeed,
				)) /
			2;
		const waveZ =
			(1 +
				Math.sin(
					(x * this.angledSin + y * this.angledCos) * this.waveFrequencyZ +
						time * this.waveSpeed,
				)) /
			2;
		return (waveX + waveZ) / 2;
	}
}
