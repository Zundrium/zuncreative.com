import { BabylonScene } from "$lib/utils/babylonjs/babylonScene";
import type { IBabylonGraphics } from "./utils";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";
import { TargetCamera } from "@babylonjs/core/Cameras/targetCamera";
import { DefaultRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline";
import { DepthOfFieldEffectBlurLevel } from "@babylonjs/core/PostProcesses/depthOfFieldEffect";
import { HDRCubeTexture } from "@babylonjs/core/Materials/Textures/hdrCubeTexture";
import type { AssetContainer } from "@babylonjs/core/assetContainer";
import {
	PointColor,
	PointsCloudSystem,
} from "@babylonjs/core/Particles/pointsCloudSystem";
import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { Mesh } from "@babylonjs/core/Meshes/mesh";

export class Sunset3D implements IBabylonGraphics {
	private babylonScene: BabylonScene | null = null;
	private pipeline: DefaultRenderingPipeline | null = null;
	private pcs: PointsCloudSystem | null = null;
	private originalPositions: Vector3[] = [];
	public onReady: () => void = () => {};

	public constructor() {}

	// Initializes the Babylon scene and sets up the rendering pipeline
	public async initialize(renderCanvas: HTMLCanvasElement) {
		this.babylonScene = new BabylonScene(renderCanvas);
		console.log("Sunset: initializing");

		await this.babylonScene.init({ arcRotateCamera: true });
		this.babylonScene!.scene.clearColor.set(0.2, 0.2, 0.2, 1); // Set clear color to dark grey

		const camera = this.setupCamera(
			this.babylonScene!.camera as ArcRotateCamera,
		);

		const assets = await this.loadAssets();
		// Initialize PCS and store original positions before setting up render loop
		await this.convertMeshesToPointCloud(
			this.babylonScene.scene,
			assets[1].meshes,
		);
		// Setup pipeline and render loop which will use the PCS
		this.setupPipelineAndRenderLoop(camera);
		this.onReady();
	}

	private async convertMeshesToPointCloud(
		scene: Scene,
		meshes: AbstractMesh[],
	) {
		const surfacePointsPerMesh: any = {
			Forest001_clover_spring_0: 70000,
			"Forest001_clover_spring_0.001": 10000,
			"Forest002_Material #25_0": 5000,
			ground_close_07_ground_close_07_0: 10000,
			"R1_Material #25_0": 0,
			"R2_Material #25_0": 0,
			"R3_Material #25_0": 0,
			"R4_Material #25_0": 0,
			soil_soil_0: 3000,
		};

		const pcsInstance = new PointsCloudSystem("pcs", 5, scene);
		for (const mesh of meshes) {
			if (mesh.getTotalVertices() > 0 && surfacePointsPerMesh[mesh.name] > 0) {
				mesh.isVisible = false; // Hide the original mesh
				mesh.material!.alpha = 0.5;
				mesh.material!.transparencyMode = 2; // Enable transparency

				pcsInstance.addSurfacePoints(
					mesh as Mesh,
					surfacePointsPerMesh[mesh.name],
					PointColor.Color,
				);
			}
		}
		await pcsInstance.buildMeshAsync();

		// Store the PCS instance and original particle positions
		this.pcs = pcsInstance;
		if (this.pcs.particles) {
			this.originalPositions = this.pcs.particles.map((p) =>
				p.position.clone(),
			);
		}
		// pcsInstance.setParticles(); // Initial set, buildMeshAsync should handle the first population.
	}

	// Loads environment and 3D assets
	private async loadAssets() {
		return await Promise.all([this.loadEnvironment(), this.loadSceneAssets()]);
	}

	// Loads the HDR environment
	private async loadEnvironment(): Promise<HDRCubeTexture> {
		return await this.babylonScene!.loadHDR("/env/env_128.hdr", false);
	}

	// Loads the GLTF scene assets
	private async loadSceneAssets(): Promise<AssetContainer> {
		return await this.babylonScene!.loadGLTF("/geom/clover_scene.glb", true);
	}

	// Sets up the rendering pipeline and render loop
	private setupPipelineAndRenderLoop(camera: ArcRotateCamera) {
		this.createRenderPipeline(this.babylonScene!.scene, camera);
		this.setupRenderLoop(camera);
	}

	// Configures the render loop for animations and particle movement
	private setupRenderLoop(camera: ArcRotateCamera) {
		let _elapsedTime = 0;
		const movementAmount = 0.008; // Max random offset per axis per frame (adjust for subtlety)
		const springStiffness = 0.01; // How strongly particles return to original position (0-1, adjust for shape retention)

		this.babylonScene!.onRender = (deltaTime: number) => {
			_elapsedTime += deltaTime;
			if (camera && typeof camera.alpha === "number") {
				camera.alpha -= 0.00001 * deltaTime; // Slowly rotates the camera
			}

			if (
				this.pcs &&
				this.pcs.particles &&
				this.originalPositions.length === this.pcs.particles.length
			) {
				for (let i = 0; i < this.pcs.particles.length; i++) {
					const particle = this.pcs.particles[i];
					const originalPos = this.originalPositions[i];

					// Random displacement vector for this frame
					const randomDisplacement = new Vector3(
						(Math.random() - 0.5) * 2 * movementAmount, // Range: -movementAmount to +movementAmount
						(Math.random() - 0.5) * 2 * movementAmount,
						(Math.random() - 0.5) * 2 * movementAmount,
					);

					// Apply random jitter to current particle position
					const jitteredPosition = particle.position.add(randomDisplacement);

					// Calculate the vector pulling the particle back to its original position (spring force)
					const springForceDirection = originalPos.subtract(jitteredPosition);

					// Apply a scaled version of this spring force to the jittered position
					particle.position = jitteredPosition.add(
						springForceDirection.scale(springStiffness),
					);
				}
				this.pcs.setParticles(); // Update the PCS mesh with new particle positions
			}
		};
	}

	// Creates and configures the rendering pipeline
	private createRenderPipeline(
		scene: Scene,
		camera: TargetCamera,
	): DefaultRenderingPipeline {
		const pipeline = new DefaultRenderingPipeline("default", false, scene, [
			camera,
		]);

		this.configureDepthOfField(pipeline);
		this.configureImageProcessing(pipeline);
		this.configureChromaticAberration(pipeline);

		this.pipeline = pipeline;
		return pipeline;
	}

	// Configures depth of field settings
	private configureDepthOfField(pipeline: DefaultRenderingPipeline) {
		pipeline.depthOfFieldEnabled = true;
		pipeline.depthOfField.focusDistance = 10 * 1000;
		pipeline.depthOfField.fStop = 2.0;
		pipeline.depthOfField.focalLength = 600;
		pipeline.depthOfFieldBlurLevel = DepthOfFieldEffectBlurLevel.Medium;
	}

	// Configures image processing settings
	private configureImageProcessing(pipeline: DefaultRenderingPipeline) {
		pipeline.fxaaEnabled = true;
		pipeline.imageProcessingEnabled = true;
		pipeline.imageProcessing.toneMappingEnabled = true;
		pipeline.imageProcessing.toneMappingType = 1;
		pipeline.imageProcessing.vignetteEnabled = true;
		pipeline.imageProcessing.vignetteWeight = 0.3;
		pipeline.imageProcessing.vignetteCameraFov = 4;
	}

	// Configures chromatic aberration settings
	private configureChromaticAberration(pipeline: DefaultRenderingPipeline) {
		pipeline.chromaticAberrationEnabled = true;
		pipeline.chromaticAberration.aberrationAmount = 0.1;
	}

	// Sets up the camera with default settings
	private setupCamera(camera: ArcRotateCamera) {
		//camera.position = new Vector3(0, 5, 18);
		//camera.target = new Vector3(0, 0, 0);
		return camera;
	}

	// Disposes of the Babylon scene
	public dispose() {
		this.babylonScene?.dispose();
		// Clear arrays and nullify objects if necessary for more thorough cleanup
		this.originalPositions = [];
		this.pcs = null;
		this.pipeline = null;
	}
}
