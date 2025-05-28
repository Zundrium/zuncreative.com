export interface IBabylonGraphics {
    initialize: (renderCanvas: HTMLCanvasElement) => Promise<void>;
    onReady: () => void;
    dispose: () => void;
}