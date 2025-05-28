import { BabylonScene } from "$lib/utils/babylonjs/babylonScene";
import type { IBabylonGraphics } from "./utils";

export class ExampleEmptyScene implements IBabylonGraphics {
    private babylonScene: BabylonScene | null = null;
    public onReady: () => void = () => { };

    public constructor() { }

    public async initialize(renderCanvas: HTMLCanvasElement) {
        this.babylonScene = new BabylonScene(renderCanvas);
        console.log("ExampleDotWave: initializing");
        await this.babylonScene.init();

        let _elapsedTime = 0;
        this.babylonScene!.onRender = (deltaTime: number) => {
            _elapsedTime += deltaTime;
        };

        console.log("ExampleDotWave: loaded");
        this.onReady();
    }

    public dispose() {
        this.babylonScene?.dispose();
    }
}