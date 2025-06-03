import { BabylonScene } from "$lib/utils/babylonjs/babylonScene";
import { Scene } from "@babylonjs/core/scene";
import type { IBabylonGraphics } from "./utils";
import { PointsCloudSystem } from "@babylonjs/core/Particles/pointsCloudSystem";
import { Vector3, Vector2 } from "@babylonjs/core/Maths/math.vector";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { TargetCamera } from "@babylonjs/core/Cameras";
import { DefaultRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline";
import { CloudPoint } from "@babylonjs/core/Particles";
import { DepthOfFieldEffectBlurLevel } from "@babylonjs/core/PostProcesses/depthOfFieldEffect";

import {
	TextureSampler,
	type ITextureSampler,
} from "$lib/utils/babylonjs/textureSampler";
import { SineWaveNoise } from "$lib/utils/babylonjs/sineWaveNoise";

export class HeroWave3D implements IBabylonGraphics {
	private babylonScene: BabylonScene | null = null;
	public onReady: () => void = () => {};

	private deltaTime: number = 0;
	private elapsedTime: number = 0;

	private pointCloudSystem: PointsCloudSystem | null = null;

	private matrixSize = 4;
	private matrixParticleCount = 50000;
	private matrixHeight = 0.35;
	private textureSamplers: ITextureSampler[] = [];
	private textureSamplerIntensity: number = 0;
	private textureSamplerIndex: number = 0;
	private topColor: Color3 = new Color3(1, 0.5, 0);
	private bottomColor: Color3 = new Color3(0.5, 0, 1);
	private particleSize: number = 4;
	private renderPipeline: DefaultRenderingPipeline | null = null;

	public constructor() {}

	private getNormalizedParticleCoords(particleIndex: number): [number, number] {
		const columns = Math.ceil(Math.sqrt(this.matrixParticleCount));
		const rows = Math.ceil(this.matrixParticleCount / columns);

		const row = Math.floor(particleIndex / columns);
		const col = particleIndex % columns;

		return [
			columns > 1 ? col / (columns - 1) : 0,
			rows > 1 ? row / (rows - 1) : 0,
		];
	}

	private calculateParticlePlanePositionToRef(
		u: number,
		v: number,
		noise: number,
		result: Vector3,
	): void {
		result.x = u * this.matrixSize - this.matrixSize * 0.5;
		result.y = noise * this.matrixHeight;
		result.z = v * this.matrixSize - this.matrixSize * 0.5;
	}

	public update(index: number): void {
		if (index >= this.textureSamplers.length) {
			console.warn("Index out of bounds for noise generators");
			return;
		}
		this.textureSamplerIndex = index;
		this.updateTextureSamplerIntensity();
		//this.animateTextureSamplerIndex(index);
	}

	public resetSteps(): void {
		this.textureSamplerIndex = 0;
	}

	private lerp(a: number, b: number, t: number): number {
		return a + (b - a) * t;
	}

	private updateParticleColor(particle: CloudPoint, noiseValue: number): void {
		particle.color!.r = this.lerp(
			this.bottomColor.r,
			this.topColor.r,
			noiseValue,
		);
		particle.color!.g = this.lerp(
			this.bottomColor.g,
			this.topColor.g,
			noiseValue,
		);
		particle.color!.b = this.lerp(
			this.bottomColor.b,
			this.topColor.b,
			noiseValue,
		);
	}

	private createRenderPipeline(
		scene: Scene,
		camera: TargetCamera,
	): DefaultRenderingPipeline {
		const pipeline = new DefaultRenderingPipeline("default", false, scene, [
			camera,
		]);
		pipeline.samples = 1;
		pipeline.depthOfFieldEnabled = true;
		pipeline.depthOfField.focusDistance = 2.25 * 1000;
		pipeline.depthOfField.fStop = 1.4;
		pipeline.depthOfField.focalLength = 100;
		pipeline.depthOfFieldBlurLevel = DepthOfFieldEffectBlurLevel.Medium;
		pipeline.bloomEnabled = true;
		pipeline.bloomWeight = 1;
		pipeline.bloomKernel = 5;
		pipeline.bloomThreshold = 0;
		pipeline.imageProcessingEnabled = true;
		pipeline.imageProcessing.toneMappingEnabled = true;
		pipeline.imageProcessing.toneMappingType = 1;
		return pipeline;
	}

	private createPointsCloud(scene: Scene): PointsCloudSystem {
		const pointCloudSystem = new PointsCloudSystem(
			"cloud",
			this.particleSize,
			scene,
		);

		pointCloudSystem.addPoints(
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

		pointCloudSystem.buildMeshAsync();

		return pointCloudSystem;
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
		this.updateParticlePosition(
			coords[0],
			coords[1],
			noiseValue * this.textureSamplerIntensity,
			particle,
		);
		this.updateParticleColor(particle, noiseValue);
		return particle;
	}

	private updateParticlePosition(
		u: number,
		v: number,
		noiseValue: number,
		particle: CloudPoint,
	): void {
		this.calculateParticlePlanePositionToRef(
			u,
			v,
			noiseValue,
			particle.position,
		);
	}

	private setupCamera(camera: TargetCamera): void {
		camera.position = new Vector3(0.4, 1, 3.14);
		camera.setTarget(new Vector3(0, 0, 0.7));
	}

	private setuptextureSamplers(): void {
		this.textureSamplers[0] = new SineWaveNoise();

		this.textureSamplers[1] = new TextureSampler(
			"/textures/hello.png",
			0.3,
			new Vector2(0.05, 0.0),
			2,
		);

		this.textureSamplers[2] = new TextureSampler(
			"/textures/seamless_mountain1.png",
			1,
			new Vector2(0.04, 0.04),
			1,
		);

		this.textureSamplers[3] = new TextureSampler(
			"/textures/wave.png",
			0.3,
			new Vector2(0.1, -0.05),
			1.75,
		);

		this.textureSamplers[4] = new TextureSampler(
			"/textures/world_map_blurred.png",
			0.2,
			new Vector2(0.04, 0.0),
			1,
		);
		this.textureSamplers[5] = new TextureSampler(
			"/textures/world_map_blurred.png",
			0.5,
			new Vector2(0.04, 0.0),
			1,
		);
	}

	private updateTextureSamplerIntensity(): void {
		const index = Math.floor(this.textureSamplerIndex);
		if (index > this.textureSamplers.length - 1) {
			return;
		}

		const firstTextureSamplerIntensity = this.textureSamplers[index].intensity;

		if (index + 1 <= this.textureSamplers.length - 1) {
			const secondTextureSamplerIntensity =
				this.textureSamplers[Math.ceil(this.textureSamplerIndex)].intensity;

			this.textureSamplerIntensity = this.lerp(
				firstTextureSamplerIntensity,
				secondTextureSamplerIntensity,
				this.textureSamplerIndex % 1,
			);
		}
	}

	public async initialize(renderCanvas: HTMLCanvasElement): Promise<void> {
		this.babylonScene = new BabylonScene(renderCanvas);
		this.babylonScene.mediaQueryFOVs = [0.4, 0.4, 0.4, 0.4, 0.4];
		await this.babylonScene.init();

		this.pointCloudSystem = this.createPointsCloud(this.babylonScene.scene);

		this.pointCloudSystem.updateParticle = (particle: CloudPoint) => {
			return this.updateParticle(particle);
		};

		this.renderPipeline = this.createRenderPipeline(
			this.babylonScene.scene,
			this.babylonScene.camera,
		);
		this.setuptextureSamplers();
		this.setupCamera(this.babylonScene.camera);

		this.updateTextureSamplerIntensity();

		this.babylonScene.onRender = (delta: number) => {
			this.deltaTime = delta / 1000;
			this.elapsedTime += this.deltaTime;

			if (this.pointCloudSystem) {
				this.pointCloudSystem.setParticles();
			}
		};

		this.onReady();
	}

	public dispose(): void {
		this.babylonScene?.dispose();
		this.pointCloudSystem?.dispose();
	}
}
