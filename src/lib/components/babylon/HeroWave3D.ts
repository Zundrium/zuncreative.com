import { BabylonScene } from "$lib/utils/babylonjs/babylonScene";
import { Scene } from "@babylonjs/core/scene";
import type { IBabylonGraphics } from "./utils";
import { PointsCloudSystem } from "@babylonjs/core/Particles/pointsCloudSystem";
import {
	Vector3,
	Vector2,
	Quaternion,
} from "@babylonjs/core/Maths/math.vector";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import type { CloudPoint } from "@babylonjs/core/Particles/cloudPoint";
import {
	TextureSampler,
	type ITextureSampler,
} from "$lib/utils/babylonjs/textureSampler";
import { SineWaveNoise } from "$lib/utils/babylonjs/sineWaveNoise";
import { getScreenState } from "$lib/utils/screenState";
import type { BasicCamera } from "$lib/utils/babylonjs/basicCamera";

export class HeroWave3D implements IBabylonGraphics {
	private babylonScene: BabylonScene | null = null;
	public onReady: () => void = () => {};

	private deltaTime: number = 0;
	private elapsedTime: number = 0;

	private pointCloudSystem: PointsCloudSystem | null = null;

	private matrixWidth = 4;
	private matrixDepth = 4;
	private mobileMatrixWidth = 2.5;

	private particleSize: number = 4;
	private mobileParticleSize: number = 4;
	private matrixParticleCount = 30000;
	private mobileMatrixParticleCount = 7500;

	private matrixHeight = 0.35;
	private textureSamplers: ITextureSampler[] = [];
	private textureSamplerIntensity: number = 0;
	private textureSamplerIndex: number = 0;
	
    // --- REMOVED OLD PROPERTIES ---
	// private topColor: Color3 = new Color3(1, 0.5, 0);
	// private bottomColor: Color3 = new Color3(0.5, 0, 1);

    // --- NEW PROPERTIES ---
    private currentTopColor: Color3 = new Color3();
    private currentBottomColor: Color3 = new Color3();
    // --------------------

	private gridRows: number = 0;
	private gridColumns: number = 0;
	private flip: boolean = false;

	public constructor() {}

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

	public update(index: number): void {
		if (index >= this.textureSamplers.length) {
			console.warn("Index out of bounds for noise generators");
			return;
		}
		this.textureSamplerIndex = index;
		this.updateTextureSamplerIntensity();
        this.updateCurrentColors(); // <-- NEW: Update colors when index changes
	}

	public resetSteps(): void {
		this.textureSamplerIndex = 0;
        this.updateTextureSamplerIntensity(); // <-- NEW: Also update on reset
        this.updateCurrentColors(); // <-- NEW: Also update on reset
	}

	private lerp(a: number, b: number, t: number): number {
		return a + (b - a) * t;
	}

	private updateParticleColor(particle: CloudPoint, noiseValue: number): void {
        // --- UPDATED to use current colors ---
		Color3.LerpToRef(
            this.currentBottomColor,
            this.currentTopColor,
            noiseValue,
            particle.color!
        );
        // ------------------------------------
	}

	private async createPointsCloud(scene: Scene): Promise<PointsCloudSystem> {
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

		await pointCloudSystem.buildMeshAsync();

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

	private setupCamera(camera: BasicCamera): void {
		camera.position = new Vector3(0.43, 0.93, 2.77);
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
    // Stage 1: Sine Wave (Orange -> Purple)
    // A fiery, energetic welcome.
    this.textureSamplers[0] = new SineWaveNoise(
        1, // You had 1, but based on other values, 0.35 might be better. Adjust if needed.
        new Color3(1, 0.5, 0),    // Saturated Orange
        new Color3(0.5, 0, 1)     // Saturated Purple
    );

    // Stage 2: "Hello" (Green -> Blue)
    // A bright, digital, "electric" theme.
    this.textureSamplers[1] = new TextureSampler(
        "/textures/hello.webp", 0.3, new Vector2(0.05, 0.0), 1.5,
        new Color3(0, 1, 0),      // Electric Green (Top)
        new Color3(0, 0, 1)       // Deep Blue (Bottom)
    );

    // Stage 3: Mountains (Light Brown -> Dark Brown)
    // An earthy, rich, and grounded theme. Brown is less saturated by nature,
    // so we'll use rich, distinct tones.
    this.textureSamplers[2] = new TextureSampler(
        "/textures/seamless_mountain1.webp", 0.7, new Vector2(0.02, 0.02), 1,
        new Color3(1, 0.5, 0),    // Saturated Orange
        new Color3(1, 0, 0)  // Red
    );

    // Stage 4: Wave (White -> Cyan)
    // A clean, crisp, and refreshing water theme.
    this.textureSamplers[3] = new TextureSampler(
        "/textures/wave.webp", 0.4, new Vector2(0.05, -0.02), 1,
        new Color3(1, 1, 1),      // Pure White (Top)
        new Color3(0, 1, 1)       // Saturated Cyan (Bottom)
    );

    // Stage 5: World Map (Green -> Blue)
    // A classic "Earth" theme representing land and sea.
    this.textureSamplers[4] = new TextureSampler(
        "/textures/world_map_blurred.webp", 0.2, new Vector2(0.04, 0.0), 1,
        new Color3(0.1, 0.7, 0.2),  // Lush Land Green (Top)
        new Color3(0, 0.2, 0.6)     // Deep Ocean Blue (Bottom)
    );

    // Stage 6: Final World Map (Yellow -> Orange)
    // A warm, "sunset" or "heat map" theme.
    this.textureSamplers[5] = new TextureSampler(
        "/textures/world_map_blurred.webp", 0.6, new Vector2(0.04, 0.0), 1,
        new Color3(1, 1, 0),      // Bright Saturated Yellow (Top)
        new Color3(1, 0.5, 0)     // Fiery Orange (Bottom)
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
	}

    // --- NEW METHOD ---
    private updateCurrentColors(): void {
        const index = Math.floor(this.textureSamplerIndex);
        if (index >= this.textureSamplers.length) return;

        const firstSampler = this.textureSamplers[index];
        if (!firstSampler) return;
        
        // Check if we are between two samplers
        if (index + 1 < this.textureSamplers.length) {
            const secondSampler = this.textureSamplers[index + 1];
            const alpha = this.textureSamplerIndex % 1; // The interpolation factor

            // Interpolate between the top colors
            Color3.LerpToRef(firstSampler.topColor, secondSampler.topColor, alpha, this.currentTopColor);
            // Interpolate between the bottom colors
            Color3.LerpToRef(firstSampler.bottomColor, secondSampler.bottomColor, alpha, this.currentBottomColor);
        } else {
            // Not interpolating, just use the current sampler's colors
            this.currentTopColor.copyFrom(firstSampler.topColor);
            this.currentBottomColor.copyFrom(firstSampler.bottomColor);
        }
    }
    // -------------------

	public async initialize(renderCanvas: HTMLCanvasElement): Promise<void> {
		this.babylonScene = new BabylonScene(renderCanvas);
		this.babylonScene.mediaQueryFOVs = [0.8, 0.6, 0.5, 0.4, 0.4];

		await this.babylonScene.init();
		if (getScreenState() == "sm") {
			this.particleSize = this.mobileParticleSize;
			this.matrixParticleCount = this.mobileMatrixParticleCount;
			this.matrixWidth = this.mobileMatrixWidth;
		}
		this.updateGridDimensions(1, this.matrixParticleCount);

		this.pointCloudSystem = await this.createPointsCloud(
			this.babylonScene.scene,
		);
		this.pointCloudSystem.updateParticle = (particle: CloudPoint) => {
			return this.updateParticle(particle);
		};

		this.setuptextureSamplers();
		this.setupCamera(this.babylonScene.camera);

		this.updateTextureSamplerIntensity();
        this.updateCurrentColors(); // <-- NEW: Initialize colors at start

		this.babylonScene.onRender = (delta: number) => {
			this.deltaTime = delta / 1000;
			this.elapsedTime += this.deltaTime;

			this.flip = !this.flip;
			if (this.flip) {
				this.pointCloudSystem!.setParticles(
					0,
					this.matrixParticleCount / 2,
					false,
				);
			} else {
				this.pointCloudSystem!.setParticles(
					this.matrixParticleCount / 2,
					this.matrixParticleCount - 1,
					true,
				);
			}
		};

		this.onReady();
	}

	public dispose(): void {
		this.babylonScene?.dispose();
		this.pointCloudSystem?.dispose();
	}
}
