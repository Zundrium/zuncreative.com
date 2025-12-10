import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";
import { getScreenState } from "../screenState";
import { BasicCamera } from "./basicCamera";

export interface InitOptions {
    direct?: boolean;
    arcRotateCamera?: boolean;
}

export class BabylonScene {
    private renderCanvas: HTMLCanvasElement;
    public engine!: Engine;
    public scene!: Scene;
    public camera!: BasicCamera;
    public onRender: (deltaTime: number) => void = () => { };
    private onReady: () => void = () => { };
    private observer: IntersectionObserver | null = null;
    private isIntersecting: boolean = true; // Initially assume it's in view
    private initializing: boolean = false;
    public mediaQueryFOVs: number[] = [1, 0.85, 0.6, 0.5, 0.4];

    constructor(renderCanvas: HTMLCanvasElement) {
        this.renderCanvas = renderCanvas;
    }

    public init(options?: InitOptions): Promise<void> {
        return new Promise<void>((resolve) => {
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

    private increaseResolution(): void {
        this.engine.setHardwareScalingLevel(0.75);
    }

    private delayedInit(): void {
        this.initializing = false;
        this.engine = new Engine(this.renderCanvas);

        //this.engine = new Engine(this.renderCanvas, true, {
        //	disableWebGL2Support: true,
        //});

        this.scene = new Scene(this.engine);
        this.scene.useRightHandedSystem = true;
        this.scene.clearColor = new Color4(0, 0, 0, 0);

        this.camera = new BasicCamera("camera1", new Vector3(0, 0, 0), this.scene);
        this.camera.minZ = 0.1;
        this.camera.maxZ = 1000;
        this.applyCorrectFOV();

        if (getScreenState() == "sm" || getScreenState() == "md") {
            this.increaseResolution();
        }

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
