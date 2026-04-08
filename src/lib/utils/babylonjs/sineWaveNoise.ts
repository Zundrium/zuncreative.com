import type { ITextureSampler } from "./textureSampler";
import { Color3 } from "@babylonjs/core/Maths/math.color";

export class SineWaveNoise implements ITextureSampler {
    private waveFrequencyX: number;
    private waveFrequencyZ: number;
    private waveSpeed: number;

    constructor(
        public intensity: number = 1,
        public topColor: Color3,
        public bottomColor: Color3,
    ) {
        this.waveFrequencyX = 8;
        this.waveFrequencyZ = 15;
        this.waveSpeed = 0.3;
    }

    public getFloatAt(x: number, y: number, time: number): number {
        const angledCos = Math.cos(time * 0.2);
        const angledSin = Math.sin(time * 0.2);

        const waveX =
            (1 +
                Math.sin(
                    (x * angledCos - y * angledSin) * this.waveFrequencyX +
                    time * this.waveSpeed,
                )) /
            2;
        const waveZ =
            (1 +
                Math.sin(
                    (x * angledSin + y * angledCos) * this.waveFrequencyZ +
                    time * this.waveSpeed,
                )) /
            2;
        return (waveX + waveZ) / 2;
    }
}
