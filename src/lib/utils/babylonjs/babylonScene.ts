import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import type { TargetCamera } from "@babylonjs/core/Cameras/targetCamera";
import { Color4, Matrix } from "@babylonjs/core/Maths/math";
import { DefaultRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Rendering/depthRendererSceneComponent";
import "@babylonjs/core/Rendering/depthRenderer";
import { CubeTexture } from "@babylonjs/core/Materials/Textures/cubeTexture";
import "@babylonjs/loaders/glTF/2.0";
import type { AssetContainer } from "@babylonjs/core/assetContainer";
import { getScreenState } from "../screenState";
import { BackgroundMaterial } from "@babylonjs/core/Materials/Background";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { LoadAssetContainerAsync } from "@babylonjs/core/Loading/sceneLoader";
import { HDRCubeTexture } from "@babylonjs/core/Materials/Textures/hdrCubeTexture";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";

export interface InitOptions {
	direct?: boolean;
	arcRotateCamera?: boolean;
}

export class BabylonScene {
	private renderCanvas: HTMLCanvasElement;
	public engine!: Engine;
	public scene!: Scene;
	public camera!: TargetCamera;
	public onRender: (deltaTime: number) => void = () => {};
	private onReady: () => void = () => {};
	private observer: IntersectionObserver | null = null;
	private isIntersecting: boolean = true; // Initially assume it's in view
	private initializing: boolean = false;
	private pipeline: DefaultRenderingPipeline | null = null;
	private skyDome: Mesh | null = null;
	private useArcRotateCamera: boolean = false;
	public mediaQueryFOVs: number[] = [1, 0.85, 0.6, 0.5, 0.4];

	private cubeTextures: CubeTexture[] = [];

	constructor(renderCanvas: HTMLCanvasElement) {
		this.renderCanvas = renderCanvas;
	}

	public inspect() {
		// 	this.scene!.debugLayer.show({
		// 		embedMode: true,
		// 	});
	}

	private createRenderPipeline(
		scene: Scene,
		camera: TargetCamera,
	): DefaultRenderingPipeline {
		const pipeline = new DefaultRenderingPipeline("default", false, scene, [
			camera,
		]);

		//pipeline.depthOfFieldEnabled = true;
		//pipeline.depthOfField.focusDistance = 10 * 1000;
		//pipeline.depthOfField.fStop = 1.5;
		//pipeline.depthOfField.focalLength = 150;
		//pipeline.depthOfFieldBlurLevel = DepthOfFieldEffectBlurLevel.Medium;
		pipeline.fxaaEnabled = true;
		//pipeline.bloomEnabled = true;
		//pipeline.bloomThreshold = 0.3;
		//pipeline.bloomWeight = 0.5;
		//pipeline.bloomScale = 0.5;
		pipeline.samples = 2;
		pipeline.imageProcessingEnabled = true;
		pipeline.imageProcessing.toneMappingEnabled = true;
		pipeline.imageProcessing.toneMappingType = 1;
		//pipeline.imageProcessing.vignetteEnabled = true;
		//pipeline.imageProcessing.vignetteWeight = 0.5;
		//pipeline.imageProcessing.vignetteCameraFov = 4;

		this.pipeline = pipeline;
		return pipeline;
	}

	public setBackgroundColor(hexColor: string) {
		this.scene.clearColor = Color4.FromHexString(hexColor);
	}

	public setBackgroundOpacity(opacity: number) {
		this.scene.clearColor.a = opacity;
	}

	public init(options?: InitOptions): Promise<void> {
		return new Promise<void>((resolve) => {
			this.useArcRotateCamera = options?.arcRotateCamera || false;

			this.setupIntersectionObserver();
			if (options && options.direct) {
				this.delayedInit();
				resolve();
			} else {
				this.initializing = true;
				this.onReady = () => {
					resolve();
				};
			}
		});
	}

	private delayedInit(): void {
		this.initializing = false;
		this.engine = new Engine(this.renderCanvas);
		this.scene = new Scene(this.engine);
		this.scene.useRightHandedSystem = true;
		this.scene.clearColor = new Color4(0, 0, 0, 1);

		if (this.useArcRotateCamera) {
			this.camera = new ArcRotateCamera(
				"camera1",
				Math.PI / 2,
				Math.PI / 2.5,
				20,
				new Vector3(0, 0, 0),
			);
		} else {
			this.camera = new FreeCamera(
				"camera1",
				new Vector3(0, 5, -10),
				this.scene,
			);
		}
		this.camera.minZ = 0.1;
		this.camera.maxZ = 1000;
		this.camera.setTarget(Vector3.Zero());
		this.applyCorrectFOV();

		//camera.attachControl(renderCanvas, true);
		//this.createRenderPipeline(this.scene, this.camera);
		this.initializeRenderLoop();

		window.addEventListener("resize", () => {
			this.applyCorrectFOV();
			this.engine!.resize();
		});

		this.onReady();
	}

	private applyCorrectFOV() {
		switch (getScreenState()) {
			case "sm":
				this.camera.fov = this.mediaQueryFOVs[0];
				break;
			case "md":
				this.camera.fov = this.mediaQueryFOVs[1];
				break;
			case "lg":
				this.camera.fov = this.mediaQueryFOVs[2];
				break;
			case "xl":
				this.camera.fov = this.mediaQueryFOVs[3];
				break;
			case "2xl":
				this.camera.fov = this.mediaQueryFOVs[4];
				break;
		}
	}

	private initializeRenderLoop(): void {
		if (!this.scene) return;

		this.engine!.runRenderLoop(() => {
			if (this.isIntersecting) {
				this.scene.render();

				const deltaTime = this.engine!.getDeltaTime();
				this.onRender(deltaTime);
			}
		});
	}

	public async loadGLTF(
		fileName: string,
		addAllToScene: boolean = false,
	): Promise<AssetContainer> {
		// Use the resource manager to get the model
		const assetContainer = await LoadAssetContainerAsync(fileName, this.scene);

		if (addAllToScene) {
			assetContainer.addAllToScene();
		}

		// if the glTF has a camera, use that camera instead
		if (assetContainer.cameras.length > 0) {
			this.camera = assetContainer.cameras[0] as TargetCamera;
			this.scene.activeCamera = this.camera;
			this.pipeline?.addCamera(this.camera);
			this.camera.minZ = 0.1;
			this.camera.maxZ = 1000;
			this.applyCorrectFOV();
		}

		return assetContainer;
	}

	public getCubeTexture(fileName: string): Promise<CubeTexture> {
		return new Promise<CubeTexture>((resolve) => {
			const cubeTexture = new CubeTexture(fileName, this.engine!);
			cubeTexture.onLoadObservable.add(() => {
				resolve(cubeTexture);
			});
		});
	}

	public getHDRCubeTexture(fileName: string): Promise<HDRCubeTexture> {
		return new Promise<HDRCubeTexture>((resolve) => {
			const cubeTexture = new HDRCubeTexture(
				fileName,
				this.engine!,
				128,
				false,
				true,
				false,
				true,
			);
			cubeTexture.onLoadObservable.add(() => {
				resolve(cubeTexture);
			});
		});
	}

	public async loadHDR(
		fileName: string,
		useAsSkybox: boolean = false,
	): Promise<HDRCubeTexture> {
		// Use the resource manager to get the environment texture
		const cubeTexture = await this.getHDRCubeTexture(fileName);

		this.scene.environmentTexture = cubeTexture;
		this.scene.environmentIntensity = 1;

		if (useAsSkybox) {
			const skydome = this.createSkyDome(this.scene);
			(skydome.material! as BackgroundMaterial).reflectionTexture = cubeTexture;
		}

		return cubeTexture;
	}

	public async loadENV(fileName: string, useAsSkybox: boolean = false) {
		// Use the resource manager to get the environment texture
		const cubeTexture = await this.getCubeTexture(fileName);

		this.scene.environmentTexture = cubeTexture;
		this.scene.environmentIntensity = 1;

		if (useAsSkybox) {
			const skydome = this.createSkyDome(this.scene);
			(skydome.material! as BackgroundMaterial).reflectionTexture = cubeTexture;
		}
	}

	private createSkyDome(scene: Scene) {
		const size = 1000;
		const skydome = CreateBox(
			"noexport_sky",
			{ size, sideOrientation: Mesh.BACKSIDE },
			scene,
		);

		const sky = new BackgroundMaterial("skyMaterial", scene);
		//sky.enableGroundProjection = true;
		//skydome.position.y = (size / 2) - 0.1;
		//skydome.receiveShadows = true;
		//sky.projectedGroundRadius = 200;
		//sky.projectedGroundHeight = 3;
		//sky.reflectionBlur = 0.13;
		skydome.material = sky;

		return skydome;
	}

	private getSkyDome(scene: Scene): Mesh {
		if (!this.skyDome) {
			this.skyDome = this.createSkyDome(scene);
		}
		return this.skyDome;
	}

	private toRadians(degrees: number): number {
		return degrees * (Math.PI / 180);
	}

	public rotateSkybox(rotation: number): void {
		const envTexture = this.scene.environmentTexture as CubeTexture;
		if (envTexture && envTexture.setReflectionTextureMatrix) {
			envTexture.setReflectionTextureMatrix(
				Matrix.RotationY(this.toRadians(rotation)),
			);
		}
	}

	private setupIntersectionObserver(): void {
		this.observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					this.isIntersecting = entry.isIntersecting;
					if (this.initializing && this.isIntersecting) {
						this.delayedInit();
					}
				});
			},
			{
				root: null, // Observe viewport
				rootMargin: "0px",
				threshold: 0, // Fire event as soon as any part is visible
			},
		);

		this.observer.observe(this.renderCanvas);
	}

	public dispose(): void {
		this.observer?.disconnect();
		this.scene?.dispose();
		this.engine?.dispose();
	}
}
