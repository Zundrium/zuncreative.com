import { BabylonScene } from "$lib/utils/babylonjs/babylonScene";
import { Scene } from "@babylonjs/core/scene";
import type { IBabylonGraphics } from "./utils";
import { PointsCloudSystem } from "@babylonjs/core/Particles/pointsCloudSystem";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { Color4 } from "@babylonjs/core/Maths/math";
import { HemisphericLight } from "@babylonjs/core/Lights";
import { TargetCamera } from "@babylonjs/core/Cameras";
import { DefaultRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline";
import { Plane } from "@babylonjs/core/Maths/math.plane";
import { CloudPoint } from "@babylonjs/core/Particles";
import { Queue } from "$lib/utils/queue";
import { DepthOfFieldEffectBlurLevel } from "@babylonjs/core/PostProcesses/depthOfFieldEffect";

export class ExampleDotWave implements IBabylonGraphics {
	private babylonScene: BabylonScene | null = null;
	public onReady: () => void = () => {};
	private baseColors: Color4[] = [];
	private clickPoints: Queue<Vector3> = new Queue<Vector3>();

	private clickLifeTime: number = 5000;
	// Base wave parameters
	private waveFrequencyX = 3; // Controls how many waves appear across X
	private waveFrequencyZ = 2; // Controls how many waves appear across Z
	private waveAmplitude = 0.25; // Height of the wave
	private waveSpeed = 0.2; // How fast the wave moves
	private maxClickDistance: number = 5;

	public constructor() {}

	private calculateParticlePositionAndColor(
		sizeX: number,
		sizeZ: number,
		totalParticles: number,
		particleIndex: number,
	) {
		// Calculate grid dimensions (assuming a square-like arrangement)
		const columns = Math.ceil(Math.sqrt(totalParticles));

		// Calculate row and column for this particle
		const row = Math.floor(particleIndex / columns);
		const col = particleIndex % columns;

		// Calculate the actual position
		const x = (col / (columns - 1)) * sizeX;
		const z = (row / (Math.ceil(totalParticles / columns) - 1)) * sizeZ;

		// Calculate normalized position (0 to 1) for color gradient
		// Only using X for left-to-right gradient
		const normalizedX = x / sizeX;

		// Define the three colors
		const colors = [
			{ r: 46, g: 204, b: 113 }, // Green
			{ r: 52, g: 152, b: 219 }, // Blue
			{ r: 142, g: 68, b: 173 }, // Purple
		];

		// For three colors, we split the gradient into two segments
		let r, g, b;

		if (normalizedX < 0.5) {
			// First half: interpolate between green and blue
			const t = normalizedX * 2; // Rescale 0-0.5 to 0-1
			r = Math.round(colors[0].r * (1 - t) + colors[1].r * t);
			g = Math.round(colors[0].g * (1 - t) + colors[1].g * t);
			b = Math.round(colors[0].b * (1 - t) + colors[1].b * t);
		} else {
			// Second half: interpolate between blue and purple
			const t = (normalizedX - 0.5) * 2; // Rescale 0.5-1 to 0-1
			r = Math.round(colors[1].r * (1 - t) + colors[2].r * t);
			g = Math.round(colors[1].g * (1 - t) + colors[2].g * t);
			b = Math.round(colors[1].b * (1 - t) + colors[2].b * t);
		}

		return {
			x,
			z,
			color: new Color4(r / 255, g / 255, b / 255, 1),
		};
	}

	private createRenderPipeline(
		scene: Scene,
		camera: TargetCamera,
	): DefaultRenderingPipeline {
		const pipeline = new DefaultRenderingPipeline("default", false, scene, [
			camera,
		]);

		pipeline.fxaaEnabled = true;
		pipeline.bloomEnabled = true;
		pipeline.bloomThreshold = 0.3;
		pipeline.bloomWeight = 0.5;
		pipeline.bloomScale = 0.5;
		pipeline.samples = 2;
		//pipeline.imageProcessing.vignetteEnabled = true;
		//pipeline.imageProcessing.vignetteWeight = 0.5;
		//pipeline.imageProcessing.vignetteCameraFov = 4;

		// depth of field
		pipeline.depthOfFieldEnabled = true;
		pipeline.depthOfField.focusDistance = 2.25 * 1000;
		pipeline.depthOfField.fStop = 1.5;
		pipeline.depthOfField.focalLength = 200;
		pipeline.depthOfFieldBlurLevel = DepthOfFieldEffectBlurLevel.Medium;

		return pipeline;
	}

	private createPointsCloud(scene: Scene) {
		console.log("ExampleDotWave: creating points");
		const pointCloudSystem = new PointsCloudSystem("cloud", 4, scene);

		const planeSizeX = 4;
		const planeSizeZ = 4;

		// Add points with initial positions
		pointCloudSystem.addPoints(10000, (particle: any, i: any, s: any) => {
			const { x, z, color } = this.calculateParticlePositionAndColor(
				planeSizeX,
				planeSizeZ,
				10000,
				i,
			);
			particle.position = new Vector3(
				x - planeSizeX / 2,
				0,
				z - planeSizeZ / 2,
			);
			particle.color = color;
			this.baseColors.push(color);
		});

		// Build the mesh
		pointCloudSystem.buildMeshAsync();

		return pointCloudSystem;
	}

	private calculateDistance(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
	): number {
		const a = x1 - x2;
		const b = y1 - y2;
		return Math.sqrt(a * a + b * b);
	}

	private customWave(x: number): number {
		const start = 0.5;
		const end = 0.6;
		// normalized position in [0…1] over [start…end]
		const t = (x - start) / (end - start);

		// half‐sine bump (0 at t=0, 1 at t=0.5, 0 at t=1):
		const wave = Math.sin(Math.PI * t);

		// Heaviside windows: H(t) = (sign(t)+1)/2
		// so H(x-start) is 1 once x>start, 0 if x<start;
		//     H(end-x) is 1 once x<end,   0 if x>end
		const h1 = (Math.sign(t) + 1) * 0.5;
		const h2 = (Math.sign(1 - t) + 1) * 0.5;

		return wave * h1 * h2;
	}

	private updateParticle(
		particle: CloudPoint,
		deltaTime: number,
		elapsedTime: number,
		clickPoints: Vector3[],
	) {
		// Calculate the base y position using a sine wave
		const waveX = Math.sin(
			particle.position.x * this.waveFrequencyX + elapsedTime * this.waveSpeed,
		);
		const waveZ = Math.sin(
			particle.position.z * this.waveFrequencyZ + elapsedTime * this.waveSpeed,
		);
		let yPosition = (this.waveAmplitude * (waveX + waveZ)) / 2;

		// Add click points
		const baseColor = this.baseColors[particle.idx];
		for (let i = 0; i < clickPoints.length; i++) {
			const clickPoint = clickPoints[i];

			const distance = this.calculateDistance(
				particle.position.x,
				particle.position.z,
				clickPoint.x,
				clickPoint.z,
			);

			if (distance < this.maxClickDistance) {
				const normalizedDistance = distance / this.maxClickDistance;

				const time = clickPoint.y * 2 - 0.6;

				const x = this.customWave(normalizedDistance - time);

				//particle.color!.r = Math.min(baseColor.r + x, 1);
				//particle.color!.g = Math.min(baseColor.g + x, 1);
				//particle.color!.b = Math.min(baseColor.b + x, 1);

				yPosition += x * 0.2 * (1 - normalizedDistance);
			}
		}

		// Update y position
		particle.position.y = yPosition;

		// Return the updated particle
		return particle;
	}

	private createLight(scene: Scene) {
		const light = new HemisphericLight("light", new Vector3(0, 0, 0), scene);
	}

	private setupCamera(camera: TargetCamera) {
		camera.position = new Vector3(0, 1, 3);
		camera.target = new Vector3(0, 0, 0.7);
	}

	private setupMouseInteraction(scene: Scene, canvas: HTMLCanvasElement) {
		// Create an invisible plane for ray casting
		const plane = Plane.FromPositionAndNormal(
			new Vector3(0, 0, 0),
			new Vector3(0, 1, 0),
		);

		// Add click event listener
		canvas.addEventListener("click", (evt) => {
			// Get mouse position in normalized device coordinates
			const pickInfo = scene.pick(evt.clientX, evt.clientY);

			// Create ray from camera through mouse position
			const ray = scene.createPickingRay(evt.clientX, evt.clientY, null, null);

			// Find where ray intersects with XZ plane (y=0)
			const distance = ray.intersectsPlane(plane);

			if (distance) {
				const hitPoint = ray.origin.add(ray.direction.scale(distance));
				this.addClickPoint(hitPoint);

				setTimeout(() => {
					this.removeClickPoint();
				}, this.clickLifeTime);
			}
		});
	}

	private addClickPoint(point: Vector3) {
		this.clickPoints.enqueue(point);
	}

	private removeClickPoint() {
		this.clickPoints.dequeue();
	}

	public async initialize(renderCanvas: HTMLCanvasElement) {
		this.babylonScene = new BabylonScene(renderCanvas);
		this.babylonScene.mediaQueryFOVs = [0.4, 0.4, 0.4, 0.4, 0.4];
		console.log("ExampleDotWave: initializing");
		await this.babylonScene.init();
		this.createLight(this.babylonScene!.scene);
		const pointCloudSystem = this.createPointsCloud(this.babylonScene!.scene);

		let deltaTime = 0;
		let elapsedTime = 0;

		pointCloudSystem.updateParticle = (particle: CloudPoint) => {
			this.updateParticle(
				particle,
				deltaTime,
				elapsedTime,
				this.clickPoints.storage,
			);
			return particle;
		};

		this.setupCamera(this.babylonScene!.camera);
		this.createRenderPipeline(
			this.babylonScene!.scene,
			this.babylonScene!.camera,
		);
		this.setupMouseInteraction(this.babylonScene!.scene, renderCanvas);

		this.babylonScene!.onRender = (delta: number) => {
			deltaTime = delta / 1000; // Convert to seconds
			elapsedTime += deltaTime;

			// Update click points
			for (let i = 0; i < this.clickPoints.size(); i++) {
				const point = this.clickPoints.storage[i];
				point.y += delta / this.clickLifeTime;
			}

			// Update particles each frame
			if (pointCloudSystem) {
				pointCloudSystem.setParticles();
			}
		};

		console.log("ExampleDotWave: loaded");
		this.onReady();
	}

	public dispose() {
		this.babylonScene?.dispose();
	}
}

