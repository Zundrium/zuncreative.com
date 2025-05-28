import { TextureSampler, type ITextureSampler } from "./textureSampler";
import { Vector2 } from "@babylonjs/core/Maths/math.vector";
import { Color3 } from "@babylonjs/core/Maths/math.color";

export class DoubleLayeredTextureSampler implements ITextureSampler {
	private baseLayer: TextureSampler;
	private objectLayer: TextureSampler;

	public intensity: number;

	constructor(
		baseImageUrl: string,
		baseIntensity: number,
		baseSpeed: Vector2,
		baseScale: number,
		objectImageUrl: string,
		objectIntensity: number,
		objectSpeed: Vector2,
		objectScale: number,
	) {
		this.baseLayer = new TextureSampler(
			baseImageUrl,
			baseIntensity,
			baseSpeed,
			baseScale,
		);
		this.objectLayer = new TextureSampler(
			objectImageUrl,
			objectIntensity,
			objectSpeed,
			objectScale,
		);
		this.intensity = 1;
	}

	public getFloatAt(u: number, v: number, time: number = 0): number {
		const baseHeight =
			this.baseLayer.getFloatAt(u, v, time) * this.baseLayer.intensity;
		const objectHeight = this.objectLayer.getFloatAt(u, v, time);
		return Math.max(baseHeight, objectHeight);
		//return objectHeight;
	}

	public getObjectMask(u: number, v: number, time: number = 0): number {
		return this.objectLayer.getFloatAt(u, v, time);
	}

	public isObjectAt(
		u: number,
		v: number,
		time: number = 0,
		threshold: number = 0.1,
	): boolean {
		return this.getObjectMask(u, v, time) > threshold;
	}

	public dispose(): void {
		this.baseLayer.dispose();
		this.objectLayer.dispose();
	}
}
