import { BabylonScene } from "$lib/utils/babylonjs/babylonScene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { IBabylonGraphics } from "./utils";
import { Mesh } from "@babylonjs/core/Meshes/mesh";

export class Shape3D implements IBabylonGraphics {
    private babylonScene: BabylonScene | null = null;
    public onReady: () => void = () => { };
    private shape: Mesh | undefined;
    private morphTargets: any[] = [];
    private morphTargetTargetValues: number[] = [];

    public constructor() { }

    public async initialize(renderCanvas: HTMLCanvasElement) {
        this.babylonScene = new BabylonScene(renderCanvas);
        this.babylonScene.mediaQueryFOVs = [0.3, 1, 0.8, 0.7, 0.7];
        await this.babylonScene.init(true);
        this.babylonScene!.setBackgroundColor("transparent");

        const [env, assetContainer] = await Promise.all([
            this.babylonScene!.loadENV("/env/hdri_1k.env", false),
            this.babylonScene!.loadGLTF("/geom/shape_test.glb", true),
        ]);

        this.shape = assetContainer.meshes.find((m) => m.name === "shape") as Mesh;

        this.addMorphTarget(this.shape?.morphTargetManager?.getTarget(0));
        this.addMorphTarget(this.shape?.morphTargetManager?.getTarget(1));

        this.babylonScene!.onRender = (deltaTime: number) => {
            this.updateShapeKeys();
            this.shape?.rotate(Vector3.One(), 0.0001 * deltaTime);
        };

        this.babylonScene!.rotateSkybox(50);
        console.log("apply targetvalues");

        this.onReady();
    }

    addMorphTarget(morphTarget: any) {
        this.morphTargets.push(morphTarget);
        this.morphTargetTargetValues.push(0);
    }

    public lerp(start: number, end: number, t: number): number {
        return start + (end - start) * t;
    }

    public applyMorphTargetTargetValues() {
        for (let i = 0; i < this.morphTargets.length; i++) {
            this.morphTargets[i].influence = this.morphTargetTargetValues[i];
        }
    }

    public updateShapeKeys() {
        for (let i = 0; i < this.morphTargets.length; i++) {
            this.morphTargets[i].influence = this.lerp(
                this.morphTargets[i].influence,
                this.morphTargetTargetValues[i],
                0.02
            )
        }
    }

    public resetShapeKeyTargetValues() {
        console.log("reset");
        for (let i = 0; i < this.morphTargets.length; i++) {
            this.morphTargetTargetValues[i] = 0;
        }
    }

    public makeShapeKeyActive(index: number) {
        this.resetShapeKeyTargetValues();
        this.morphTargetTargetValues[index] = 1;
    }

    public dispose() {
        this.babylonScene?.dispose();
    }
}