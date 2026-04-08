import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Vector2 } from "@babylonjs/core/Maths/math.vector";
import { Color3 } from "@babylonjs/core/Maths/math.color";

export interface ITextureSampler {
    getFloatAt(u: number, v: number, time: number): number;
    intensity: number;
    bottomColor: Color3;
    topColor: Color3;
}

export class TextureSampler implements ITextureSampler {
    private redChannel: Float32Array | null = null;
    private width = 0;
    private height = 0;
    private isReady = false;
    private texture: Texture;

    // Pre-calculate frequently used values
    private readonly speedX: number;
    private readonly speedY: number;
    private readonly scale: number;
    constructor(
        image_url: string,
        public intensity = 1,
        speed: Vector2 = new Vector2(0.1, 0.05),
        scale = 1,
        public topColor: Color3 = new Color3(1, 1, 1),
        public bottomColor: Color3 = new Color3(0, 0, 0)
    ) {
        this.texture = new Texture(image_url);
        this.speedX = speed.x;
        this.speedY = speed.y;
        this.scale = scale;

        this.texture.onLoadObservable.add(() => {
            const size = this.texture.getSize();
            this.width = size.width;
            this.height = size.height;
            const pixelCount = this.width * this.height;
            this.redChannel = new Float32Array(pixelCount);

            this.texture
                .readPixels(0, 0, null, true, false, 0, 0, this.width, this.height)
                ?.then((buffer) => {
                    if (!buffer || !this.redChannel) return;

                    const redChannelRef = this.redChannel;

                    if (buffer instanceof Uint8Array) {
                        // Unrolled loop for better performance
                        let bufferIdx = 0;
                        for (let i = 0; i < pixelCount; i++, bufferIdx += 4) {
                            redChannelRef[i] = buffer[bufferIdx] * 0.003921568627451; // 1/255
                        }
                    } else {
                        const floatBuffer = buffer as Float32Array;
                        let bufferIdx = 0;
                        for (let i = 0; i < pixelCount; i++, bufferIdx += 4) {
                            redChannelRef[i] = floatBuffer[bufferIdx];
                        }
                    }

                    this.isReady = true;
                })
                .catch((error) => {
                    console.error("Error reading texture pixels:", error);
                });
        });
    }

    // Inlined and optimized modulo function
    private static positiveModulo(n: number, m: number): number {
        const result = n % m;
        return result < 0 ? result + m : result;
    }

    public getFloatAt(u: number, v: number, time = 0): number {
        if (!this.isReady || !this.redChannel) return 0;

        const { width, height, redChannel, speedX, speedY, scale } = this;

        // Calculate animated UV coordinates
        const scaledU = u * scale;
        const scaledV = v * scale;

        const offsetU = TextureSampler.positiveModulo(scaledU + time * speedX, 1.0);
        const offsetV = TextureSampler.positiveModulo(scaledV + time * speedY, 1.0);

        // Convert to pixel coordinates
        const x = offsetU * width;
        const y = (1.0 - offsetV) * height;

        // Floor once and reuse
        const x0 = Math.floor(x);
        const y0 = Math.floor(y);

        // Interpolation factors
        const sx = x - x0;
        const sy = y - y0;

        // Wrap coordinates (optimized modulo for positive integers)
        const x0_wrapped = x0 >= width ? x0 - width : x0;
        const x1_wrapped = x0 + 1 >= width ? x0 + 1 - width : x0 + 1;
        const y0_wrapped = y0 >= height ? y0 - height : y0;
        const y1_wrapped = y0 + 1 >= height ? y0 + 1 - height : y0 + 1;

        // Calculate array indices once
        const y0_offset = y0_wrapped * width;
        const y1_offset = y1_wrapped * width;

        // Sample texture values
        const v00 = redChannel[y0_offset + x0_wrapped];
        const v10 = redChannel[y0_offset + x1_wrapped];
        const v01 = redChannel[y1_offset + x0_wrapped];
        const v11 = redChannel[y1_offset + x1_wrapped];

        // Bilinear interpolation (optimized)
        const top = v00 + (v10 - v00) * sx;
        const bottom = v01 + (v11 - v01) * sx;

        return top + (bottom - top) * sy;
    }

    public dispose(): void {
        this.texture?.dispose();
        this.redChannel = null;
        this.isReady = false;
    }
}
