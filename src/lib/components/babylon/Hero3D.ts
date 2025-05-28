import { BabylonScene } from "$lib/utils/babylonjs/babylonScene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { IBabylonGraphics } from "./utils";

export class Hero3D implements IBabylonGraphics {
    private babylonScene: BabylonScene | null = null;
    public onReady: () => void = () => { };

    public constructor() { }

    public async initialize(renderCanvas: HTMLCanvasElement) {
        this.babylonScene = new BabylonScene(renderCanvas);
        console.log("Hero3D: initializing");
        await this.babylonScene.init(true);
        //this.babylonScene!.setBackgroundColor("#3498db");

        console.log("Hero3D: loading");
        const [env, assetContainer] = await Promise.all([
            //babylonScene.loadHDR("/env/hdri.hdr", false),
            this.babylonScene!.loadENV("/env/hdri_1k.env", false),
            this.babylonScene!.loadGLTF("/geom/test_scene.glb", true),
        ]);

        const meshes = assetContainer.meshes.filter(
            (m) => m.name !== "__root__" && m.name !== "Text",
        );

        const container = assetContainer.transformNodes.find(
            (m) => m.name === "container",
        );

        this.babylonScene!.onRender = (deltaTime: number) => {
            meshes.forEach((m) =>
                m.rotate(Vector3.One(), 0.0001 * deltaTime),
            );
            container?.rotate(Vector3.Up(), 0.00001 * deltaTime);
        };

        this.babylonScene!.rotateSkybox(50);

        this.onReady();
    }

    public dispose() {
        this.babylonScene?.dispose();
    }
}