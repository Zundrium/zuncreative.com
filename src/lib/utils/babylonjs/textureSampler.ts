import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Vector2 } from "@babylonjs/core/Maths/math.vector";

export interface ITextureSampler {
	getFloatAt(u: number, v: number, time: number): number;
	intensity: number;
}

export class TextureSampler implements ITextureSampler {
	private redChannel: Float32Array | null = null;
	private width: number = 0;
	private height: number = 0;
	private isReady: boolean = false;
	private texture: Texture;

	constructor(
		image_url: string,
		public intensity = 1,
		private speed: Vector2 = new Vector2(0.1, 0.05),
		private scale: number = 1,
	) {
		this.texture = new Texture(image_url);

		this.texture.onLoadObservable.add(() => {
			this.width = this.texture.getSize().width;
			this.height = this.texture.getSize().height;
			this.redChannel = new Float32Array(this.width * this.height);

			this.texture
				.readPixels(0, 0, null, true, false, 0, 0, this.width, this.height)
				?.then((buffer) => {
					if (!buffer) {
						return;
					}

					const pixelCount = this.width * this.height;
					const redChannelRef = this.redChannel!;
					if (buffer instanceof Uint8Array) {
						for (let i = 0; i < pixelCount; i++) {
							redChannelRef[i] = buffer[i * 4] / 255;
						}
					} else {
						const floatBuffer = buffer as Float32Array;
						for (let i = 0; i < pixelCount; i++) {
							redChannelRef[i] = floatBuffer[i * 4];
						}
					}

					this.isReady = true;
				})
				.catch((error) => {
					console.error("Error reading texture pixels:", error);
				});
		});
	}

	private positiveModulo(n: number, m: number): number {
		return ((n % m) + m) % m;
	}

	public getFloatAt(u: number, v: number, time: number = 0): number {
		if (!this.isReady || !this.redChannel) {
			return 0;
		}

		const width = this.width;
		const height = this.height;
		const redChannel = this.redChannel;
		const intensity = this.intensity;
		const speedX = this.speed.x;
		const speedY = this.speed.y;
		const scale = this.scale;

		let scaledU = u * scale;
		let scaledV = v * scale;

		let offsetU = scaledU + time * speedX;
		let offsetV = scaledV + time * speedY;

		offsetU = this.positiveModulo(offsetU, 1.0);
		offsetV = this.positiveModulo(offsetV, 1.0);

		const x = offsetU * width;
		const y = (1 - offsetV) * height;
		const x0 = Math.floor(x);
		const y0 = Math.floor(y);

		const sx = x - x0;
		const sy = y - y0;

		const x0_wrapped = this.positiveModulo(x0, width);
		const x1_wrapped = this.positiveModulo(x0 + 1, width);
		const y0_wrapped = this.positiveModulo(y0, height);
		const y1_wrapped = this.positiveModulo(y0 + 1, height);

		const v00 = redChannel[y0_wrapped * width + x0_wrapped];
		const v10 = redChannel[y0_wrapped * width + x1_wrapped];
		const v01 = redChannel[y1_wrapped * width + x0_wrapped];
		const v11 = redChannel[y1_wrapped * width + x1_wrapped];

		const top = v00 + (v10 - v00) * sx;
		const bottom = v01 + (v11 - v01) * sx;
		const value = top + (bottom - top) * sy;

		return value;
	}

	public dispose(): void {
		if (this.texture) {
			this.texture.dispose();
		}
		this.redChannel = null;
		this.isReady = false;
	}
}
