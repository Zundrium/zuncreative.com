import { BabylonScene } from "../utils/babylonjs/babylonScene";
import { Scene } from "@babylonjs/core/scene";
import type { ITextureSampler } from "../utils/babylonjs/textureSampler";
import { TextureSampler } from "../utils/babylonjs/textureSampler";
import { PointsCloudSystem } from "@babylonjs/core/Particles/pointsCloudSystem";
import { Vector3, Vector2 } from "@babylonjs/core/Maths/math.vector";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import type { CloudPoint } from "@babylonjs/core/Particles/cloudPoint";
import { SineWaveNoise } from "../utils/babylonjs/sineWaveNoise";
import { getScreenState } from "../utils/screenState";
import type { BasicCamera } from "../utils/babylonjs/basicCamera";
import { ShaderMaterial } from "@babylonjs/core/Materials/shaderMaterial";
import pointCloudVertexShader from "../../assets/shaders/pointCloud.vert?raw";
import pointCloudFragmentShader from "../../assets/shaders/pointCloud.frag?raw";
import { Engine } from "@babylonjs/core/Engines/engine";
import {
    SceneOptimizerOptions,
    SceneOptimizer,
    HardwareScalingOptimization,
    CustomOptimization,
} from "@babylonjs/core/Misc/sceneOptimizer";

export interface IBabylonGraphics {
    initialize(canvas: HTMLCanvasElement): Promise<void>;
    dispose(): void;
    update(index: number): void;
    resetSteps(): void;
}

export class HeroWave3D implements IBabylonGraphics {
    private babylonScene: BabylonScene | null = null;
    public onReady: () => void = () => { };
    private deltaTime: number = 0;
    private elapsedTime: number = 0;
    private pointCloudSystem: PointsCloudSystem | null = null;
    private shaderMaterial: ShaderMaterial | null = null;
    private matrixWidth = 4;
    private matrixDepth = 4;
    private mobileMatrixWidth = 2.5;
    private particleSize: number = 6;
    private mobileParticleSize: number = 6;
    private matrixParticleCount = 30000;
    private mobileMatrixParticleCount = 7500;
    private matrixHeight = 0.35;
    private textureSamplers: ITextureSampler[] = [];
    private textureSamplerIntensity: number = 0;
    private textureSamplerIndex: number = 0;
    private gridRows: number = 0;
    private gridColumns: number = 0;
    private flip: boolean = false;

    private zFogStartMin: number = 2.0; // Fog is fully transparent (alpha=0) at or beyond Z=2.0
    private zFogStartMax: number = 1.0; // Fog is fully opaque (alpha=1) at Z=1.0

    private zFogEndMin: number = -1.0; // Fog starts to fade out at Z=0.0
    private zFogEndMax: number = -2.0;

    private waveFrequency: number = 5.0;
    private waveIntensity: number = -0.15;
    private waveTimeSpeed: number = 3.0;

    public constructor() { }

    public updateGridDimensions(
        aspectRatio: number,
        particleCount: number,
    ): void {
        if (particleCount === 0 || aspectRatio <= 0) {
            this.gridColumns = 0;
            this.gridRows = 0;
            return;
        }
        this.gridColumns = Math.ceil(Math.sqrt(particleCount * aspectRatio));
        this.gridRows = Math.ceil(particleCount / this.gridColumns);
    }

    private getNormalizedParticleCoords(particleIndex: number): [number, number] {
        if (this.gridColumns === 0 || this.gridRows === 0) {
            return [0, 0];
        }
        const row = Math.floor(particleIndex / this.gridColumns);
        const col = particleIndex % this.gridColumns;
        const u = this.gridColumns > 1 ? col / (this.gridColumns - 1) : 0;
        const v = this.gridRows > 1 ? row / (this.gridRows - 1) : 0;
        return [u, v];
    }

    private calculateParticlePlanePositionToRef(
        u: number,
        v: number,
        noise: number,
        result: Vector3,
    ): void {
        result.x = u * this.matrixWidth - this.matrixWidth * 0.5;
        result.y = noise * this.matrixHeight;
        result.z = v * this.matrixDepth - this.matrixDepth * 0.5;
    }

    private calculateParticlePlaneYPositionToRef(
        noise: number,
        result: Vector3,
    ): void {
        result.y = noise * this.matrixHeight;
    }

    public update(index: number): void {
        if (index >= this.textureSamplers.length) {
            console.warn("Index out of bounds for noise generators");
            return;
        }
        this.textureSamplerIndex = index;
        this.updateTextureSamplerIntensity();
        this.updateCurrentColors();
    }

    public resetSteps(): void {
        this.textureSamplerIndex = 0;
        this.updateTextureSamplerIntensity();
        this.updateCurrentColors();
    }

    private lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }

    private async setupPointCloudMaterial(scene: Scene): Promise<void> {
        this.shaderMaterial = new ShaderMaterial(
            "pointCloudShader",
            scene,
            {
                vertexSource: pointCloudVertexShader,
                fragmentSource: pointCloudFragmentShader,
            },
            {
                attributes: ["position"],
                uniforms: [
                    "worldViewProjection",
                    "world",
                    "pointSize",
                    "topColor",
                    "bottomColor",
                    "minY",
                    "maxY",
                    "time",
                    "waveFrequency",
                    "waveIntensity",
                    // UPDATED: Replaced old fog uniforms with the new four-point set
                    "zFogStartMin",
                    "zFogStartMax",
                    "zFogEndMin",
                    "zFogEndMax",
                ],
                needAlphaBlending: true,
            },
        );

        const initialIntensity = this.textureSamplers[0]?.intensity || 0;
        const initialMaxY = initialIntensity * this.matrixHeight || 0.0001;

        this.shaderMaterial.pointsCloud = true;
        this.shaderMaterial.disableDepthWrite = true;
        this.shaderMaterial.backFaceCulling = true;
        this.shaderMaterial.alphaMode = Engine.ALPHA_SCREENMODE;
        this.shaderMaterial.setFloat("pointSize", this.particleSize);
        this.shaderMaterial.setFloat("minY", 0);
        this.shaderMaterial.setFloat("maxY", initialMaxY);

        // NEW: Set initial values for our new uniforms
        this.shaderMaterial.setFloat("waveFrequency", this.waveFrequency);
        this.shaderMaterial.setFloat("waveIntensity", this.waveIntensity);
        this.shaderMaterial.setFloat("zFogStartMin", this.zFogStartMin);
        this.shaderMaterial.setFloat("zFogStartMax", this.zFogStartMax);
        this.shaderMaterial.setFloat("zFogEndMin", this.zFogEndMin);
        this.shaderMaterial.setFloat("zFogEndMax", this.zFogEndMax);
    }

    private async createPointCloudSystem(scene: Scene): Promise<void> {
        this.updateGridDimensions(1, this.matrixParticleCount);
        this.pointCloudSystem = new PointsCloudSystem(
            "cloud",
            this.particleSize,
            scene,
        );

        this.pointCloudSystem.addPoints(
            this.matrixParticleCount,
            (particle: CloudPoint) => {
                const coords = this.getNormalizedParticleCoords(particle.idx);
                this.calculateParticlePlanePositionToRef(
                    coords[0],
                    coords[1],
                    0,
                    particle.position,
                );
            },
        );
        await this.pointCloudSystem.buildMeshAsync(this.shaderMaterial!);
        this.pointCloudSystem!.updateParticle = (particle: CloudPoint) => {
            return this.updateParticle(particle);
        };
    }

    private async recreatePointCloudSystem(scene: Scene) {
        this.pointCloudSystem?.dispose();
        await this.createPointCloudSystem(scene);
    }

    private getNoiseValue(x: number, y: number, elapsedTime: number): number {
        if (this.textureSamplerIndex % 1 > 0) {
            const index = Math.floor(this.textureSamplerIndex);
            const firstNoiseGenerator = this.textureSamplers[index];
            if (firstNoiseGenerator && index + 1 < this.textureSamplers.length) {
                const secondNoiseGenerator = this.textureSamplers[index + 1];
                const alpha = this.textureSamplerIndex - index;
                const firstValue = firstNoiseGenerator.getFloatAt(x, y, elapsedTime);
                const secondValue = secondNoiseGenerator.getFloatAt(x, y, elapsedTime);
                return this.lerp(firstValue, secondValue, alpha);
            } else if (firstNoiseGenerator) {
                return firstNoiseGenerator.getFloatAt(x, y, elapsedTime);
            }
            return 0;
        }
        return this.textureSamplers[this.textureSamplerIndex].getFloatAt(
            x,
            y,
            elapsedTime,
        );
    }

    private updateParticle(particle: CloudPoint): CloudPoint {
        const coords = this.getNormalizedParticleCoords(particle.idx);
        const noiseValue = this.getNoiseValue(
            coords[0],
            coords[1],
            this.elapsedTime,
        );
        this.calculateParticlePlaneYPositionToRef(
            noiseValue * this.textureSamplerIntensity,
            particle.position,
        );
        return particle;
    }

    private setupCamera(camera: BasicCamera): void {
        camera.position = new Vector3(0.43, 0.93, 3.6);
        const degreesToRadians = (degrees: number) => degrees * (Math.PI / 180);
        if (getScreenState() == "sm") {
            camera.position = new Vector3(0, 0.93, 2.77);
            camera.rotation = new Vector3(degreesToRadians(-27.0), 0, 0);
        } else {
            camera.rotation = new Vector3(
                degreesToRadians(-17.36),
                degreesToRadians(3.47),
                0,
            );
        }
    }

    private setuptextureSamplers(): void {
        this.textureSamplers[0] = new SineWaveNoise(
            1,
            new Color3(1, 0.5, 0),
            new Color3(0.5, 0, 1),
        );

        this.textureSamplers[1] = new TextureSampler(
            "/textures/hello.webp",
            0.4,
            new Vector2(0.05, 0.0),
            1,
            new Color3(0, 1, 0),
            new Color3(0, 0, 1),
        );
        this.textureSamplers[2] = new TextureSampler(
            "/textures/seamless_mountain1.webp",
            1,
            new Vector2(0.02, 0.02),
            1,
            new Color3(1, 1, 0),
            new Color3(1, 0, 0),
        );
        this.textureSamplers[3] = new TextureSampler(
            "/textures/wave.webp",
            0.4,
            new Vector2(0.05, -0.02),
            1,
            new Color3(0, 1, 1),
            new Color3(0, 0.5, 1),
        );
        this.textureSamplers[4] = new TextureSampler(
            "/textures/world_map_blurred.webp",
            0.2,
            new Vector2(0.04, 0.0),
            1,
            new Color3(0.1, 0.7, 0.2),
            new Color3(0, 0.2, 0.6),
        );
        this.textureSamplers[5] = new TextureSampler(
            "/textures/world_map_blurred.webp",
            0.6,
            new Vector2(0.04, 0.0),
            1,
            new Color3(1, 1, 0),
            new Color3(1, 0.5, 0),
        );
    }

    private updateTextureSamplerIntensity(): void {
        const index = Math.floor(this.textureSamplerIndex);
        if (index >= this.textureSamplers.length) return;

        const firstSampler = this.textureSamplers[index];
        if (!firstSampler) return;

        if (index + 1 < this.textureSamplers.length) {
            const secondSampler = this.textureSamplers[index + 1];
            const alpha = this.textureSamplerIndex % 1;
            this.textureSamplerIntensity = this.lerp(
                firstSampler.intensity,
                secondSampler.intensity,
                alpha,
            );
        } else {
            this.textureSamplerIntensity = firstSampler.intensity;
        }

        // --- NEW LOGIC ---
        // Update the shader uniform for the wave's current max height.
        if (this.shaderMaterial) {
            // Calculate the current maximum Y value for the wave.
            let currentMaxY = this.textureSamplerIntensity * this.matrixHeight;

            // Safeguard: prevent division by zero in the shader if min/max are equal.
            // If intensity is 0, the wave is flat, so we set a tiny max height.
            if (currentMaxY <= 0) {
                currentMaxY = 0.0001; // A small non-zero value
            }

            // Set the 'maxY' uniform in the vertex shader.
            this.shaderMaterial.setFloat("maxY", currentMaxY);
        }
    }

    private updateCurrentColors(): void {
        if (!this.shaderMaterial) return;
        const index = Math.floor(this.textureSamplerIndex);
        if (index >= this.textureSamplers.length) return;
        const firstSampler = this.textureSamplers[index];
        if (!firstSampler) return;
        const tempTopColor = new Color3();
        const tempBottomColor = new Color3();
        if (index + 1 < this.textureSamplers.length) {
            const secondSampler = this.textureSamplers[index + 1];
            const alpha = this.textureSamplerIndex % 1;
            Color3.LerpToRef(
                firstSampler.topColor,
                secondSampler.topColor,
                alpha,
                tempTopColor,
            );
            Color3.LerpToRef(
                firstSampler.bottomColor,
                secondSampler.bottomColor,
                alpha,
                tempBottomColor,
            );
        } else {
            tempTopColor.copyFrom(firstSampler.topColor);
            tempBottomColor.copyFrom(firstSampler.bottomColor);
        }
        this.shaderMaterial.setColor3("topColor", tempTopColor);
        this.shaderMaterial.setColor3("bottomColor", tempBottomColor);
    }

    public async initialize(renderCanvas: HTMLCanvasElement): Promise<void> {
        this.babylonScene = new BabylonScene(renderCanvas);
        this.babylonScene.mediaQueryFOVs = [0.8, 0.6, 0.5, 0.4, 0.4];
        await this.babylonScene.init();
        if (getScreenState() == "sm") {
            this.particleSize = this.mobileParticleSize;
            this.matrixParticleCount = this.mobileMatrixParticleCount;
            this.matrixWidth = this.mobileMatrixWidth;
        }
        await this.setupPointCloudMaterial(this.babylonScene.scene);
        await this.createPointCloudSystem(this.babylonScene.scene);

        this.setuptextureSamplers();
        this.setupCamera(this.babylonScene.camera);
        this.updateTextureSamplerIntensity();
        this.updateCurrentColors();
        this.babylonScene.onRender = (delta: number) => {
            this.deltaTime = delta / 1000;
            this.elapsedTime += this.deltaTime;

            // NEW: Update the time uniform for the sine wave animation
            if (this.shaderMaterial) {
                // We multiply by waveTimeSpeed to control the animation speed
                this.shaderMaterial.setFloat(
                    "time",
                    this.elapsedTime * this.waveTimeSpeed,
                );
            }

            this.flip = !this.flip;
            if (this.flip) {
                this.pointCloudSystem!.setParticles(
                    0,
                    Math.floor(this.matrixParticleCount / 2),
                    false,
                );
            } else {
                this.pointCloudSystem!.setParticles(
                    Math.floor(this.matrixParticleCount / 2),
                    this.matrixParticleCount,
                    true,
                );
            }
        };

        this.setupOptimizer(this.babylonScene.scene);

        this.onReady();
    }

    public setupOptimizer(scene: Scene): void {
        const options = new SceneOptimizerOptions();
        options.targetFrameRate = 24;
        //options.addOptimization(new HardwareScalingOptimization(0, 1));

        options.addCustomOptimization(
            (scene: Scene, optimizer: SceneOptimizer) => {
                if (this.matrixParticleCount <= 5000) return false;
                this.matrixParticleCount = Math.max(
                    this.matrixParticleCount - 15000,
                    5000,
                );
                this.recreatePointCloudSystem(scene);
                return true;
            },
            () => {
                return "Reducing particles...";
            },
            4,
        );

        const optimizer = new SceneOptimizer(scene, options);
        optimizer.start();
    }

    public dispose(): void {
        this.shaderMaterial?.dispose();
        this.babylonScene?.dispose();
        this.pointCloudSystem?.dispose();
    }
}
