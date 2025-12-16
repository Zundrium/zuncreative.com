import { BabylonScene } from "../utils/babylonjs/babylonScene";
import { Scene } from "@babylonjs/core/scene";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Vector3, Vector2 } from "@babylonjs/core/Maths/math.vector";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { getScreenState } from "../utils/screenState";
import type { BasicCamera } from "../utils/babylonjs/basicCamera";
import { ShaderMaterial } from "@babylonjs/core/Materials/shaderMaterial";
import displacementVertexShader from "../../assets/shaders/displacement.vert?raw";
import displacementFragmentShader from "../../assets/shaders/displacement.frag?raw";
import { Engine } from "@babylonjs/core/Engines/engine";

export interface IBabylonGraphics {
    initialize(canvas: HTMLCanvasElement): Promise<void>;
    dispose(): void;
    update(index: number): void;
    resetSteps(): void;
}

/**
 * Configuration for a displacement texture or procedural noise effect
 */
interface DisplacementConfig {
    type: "texture" | "procedural";
    textureUrl?: string;
    intensity: number;
    speed: Vector2;
    textureScale: number;
    topColor: Color3;
    bottomColor: Color3;
    // Procedural sine wave parameters
    waveFrequencyX?: number;
    waveFrequencyZ?: number;
    waveSpeed?: number;
}

/**
 * GPU-based HeroWave3D using mesh displacement shaders.
 * This version offloads all displacement calculations to the GPU,
 * eliminating CPU-based particle updates for better performance.
 */
export class HeroWave3DGPU implements IBabylonGraphics {
    private babylonScene: BabylonScene | null = null;
    public onReady: () => void = () => { };
    private elapsedTime: number = 0;

    // Mesh and material
    private mesh: Mesh | null = null;
    private shaderMaterial: ShaderMaterial | null = null;

    // Grid configuration
    private matrixWidth = 4;
    private matrixDepth = 4;
    private mobileMatrixWidth = 2.5;
    private matrixHeight = 0.35;

    // Mesh subdivision (higher = more detail)
    private subdivisions = 200;
    private mobileSubdivisions = 100;

    // Displacement configurations (matches original textureSamplers)
    private displacementConfigs: DisplacementConfig[] = [];
    private currentConfigIndex: number = 0;
    private configIntensity: number = 0;

    // Fog parameters
    private zFogStartMin: number = 2.0;
    private zFogStartMax: number = 1.0;
    private zFogEndMin: number = -1.0;
    private zFogEndMax: number = -2.0;

    // Wave effect parameters
    private waveFrequency: number = 5.0;
    private waveIntensity: number = -0.15;
    private waveTimeSpeed: number = 3.0;

    // Texture cache
    private textureCache: Map<string, Texture> = new Map();

    public constructor() { }

    private lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }

    private lerpColor3(a: Color3, b: Color3, t: number): Color3 {
        return new Color3(
            this.lerp(a.r, b.r, t),
            this.lerp(a.g, b.g, t),
            this.lerp(a.b, b.b, t)
        );
    }

    /**
     * Initialize displacement configurations (matching original textureSamplers)
     */
    private setupDisplacementConfigs(): void {
        this.displacementConfigs = [
            // 0: Procedural sine wave noise
            {
                type: "procedural",
                intensity: 1,
                speed: new Vector2(0, 0),
                textureScale: 1,
                topColor: new Color3(1, 0.5, 0),
                bottomColor: new Color3(0.5, 0, 1),
                waveFrequencyX: 8,
                waveFrequencyZ: 15,
                waveSpeed: 0.3,
            },
            // 1: Hello texture
            {
                type: "texture",
                textureUrl: "/textures/hello.webp",
                intensity: 0.4,
                speed: new Vector2(0.05, 0.0),
                textureScale: 1,
                topColor: new Color3(0, 1, 0),
                bottomColor: new Color3(0, 0, 1),
            },
            // 2: Mountain texture
            {
                type: "texture",
                textureUrl: "/textures/seamless_mountain1.webp",
                intensity: 1,
                speed: new Vector2(0.02, 0.02),
                textureScale: 1,
                topColor: new Color3(1, 1, 0),
                bottomColor: new Color3(1, 0, 0),
            },
            // 3: Wave texture
            {
                type: "texture",
                textureUrl: "/textures/wave.webp",
                intensity: 0.4,
                speed: new Vector2(0.05, -0.02),
                textureScale: 1,
                topColor: new Color3(0, 1, 1),
                bottomColor: new Color3(0, 0.5, 1),
            },
            // 4: World map (first version)
            {
                type: "texture",
                textureUrl: "/textures/world_map_blurred.webp",
                intensity: 0.2,
                speed: new Vector2(0.04, 0.0),
                textureScale: 1,
                topColor: new Color3(0.1, 0.7, 0.2),
                bottomColor: new Color3(0, 0.2, 0.6),
            },
            // 5: World map (second version, different colors)
            {
                type: "texture",
                textureUrl: "/textures/world_map_blurred.webp",
                intensity: 0.6,
                speed: new Vector2(0.04, 0.0),
                textureScale: 1,
                topColor: new Color3(1, 1, 0),
                bottomColor: new Color3(1, 0.5, 0),
            },
        ];
    }

    /**
     * Get or create a cached texture
     */
    private getTexture(url: string, scene: Scene): Texture {
        if (this.textureCache.has(url)) {
            return this.textureCache.get(url)!;
        }
        const texture = new Texture(url, scene);
        texture.wrapU = Texture.WRAP_ADDRESSMODE;
        texture.wrapV = Texture.WRAP_ADDRESSMODE;
        this.textureCache.set(url, texture);
        return texture;
    }

    /**
     * Setup the displacement shader material
     */
    private async setupShaderMaterial(scene: Scene): Promise<void> {
        this.shaderMaterial = new ShaderMaterial(
            "displacementShader",
            scene,
            {
                vertexSource: displacementVertexShader,
                fragmentSource: displacementFragmentShader,
            },
            {
                attributes: ["position", "uv"],
                uniforms: [
                    "worldViewProjection",
                    "world",
                    "time",
                    // Displacement uniforms for first source
                    "displacementMap",
                    "displacementScale",
                    "displacementIntensity",
                    "displacementSpeed",
                    "displacementTextureScale",
                    // Displacement uniforms for second source (blending)
                    "displacementMap2",
                    "displacementIntensity2",
                    "displacementSpeed2",
                    "displacementTextureScale2",
                    "textureBlendFactor",
                    // Procedural noise uniforms
                    "useProceduralNoise",
                    "useProceduralNoise2",
                    "waveFrequencyX",
                    "waveFrequencyZ",
                    "waveSpeed",
                    // Color uniforms
                    "topColor",
                    "bottomColor",
                    "minY",
                    "maxY",
                    // Fragment shader uniforms
                    "waveFrequency",
                    "waveIntensity",
                    "zFogStartMin",
                    "zFogStartMax",
                    "zFogEndMin",
                    "zFogEndMax",
                ],
                samplers: ["displacementMap", "displacementMap2"],
                needAlphaBlending: true,
            }
        );

        // Set initial values
        this.shaderMaterial.backFaceCulling = false;
        this.shaderMaterial.disableDepthWrite = true;
        this.shaderMaterial.alphaMode = Engine.ALPHA_SCREENMODE;

        // Set fog parameters
        this.shaderMaterial.setFloat("waveFrequency", this.waveFrequency);
        this.shaderMaterial.setFloat("waveIntensity", this.waveIntensity);
        this.shaderMaterial.setFloat("zFogStartMin", this.zFogStartMin);
        this.shaderMaterial.setFloat("zFogStartMax", this.zFogStartMax);
        this.shaderMaterial.setFloat("zFogEndMin", this.zFogEndMin);
        this.shaderMaterial.setFloat("zFogEndMax", this.zFogEndMax);

        // Initial displacement settings
        this.shaderMaterial.setFloat("displacementScale", this.matrixHeight);
        this.shaderMaterial.setFloat("minY", 0);
        this.shaderMaterial.setFloat("maxY", this.matrixHeight);
        this.shaderMaterial.setFloat("time", 0);
        this.shaderMaterial.setFloat("textureBlendFactor", 0);

        // Create dummy 1x1 white textures as default for both displacement maps
        // This prevents shader errors when using procedural noise mode
        const dummyTexture = new Texture(null, scene);
        dummyTexture.updateURL("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==");
        this.shaderMaterial.setTexture("displacementMap", dummyTexture);

        const dummyTexture2 = new Texture(null, scene);
        dummyTexture2.updateURL("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==");
        this.shaderMaterial.setTexture("displacementMap2", dummyTexture2);

        // Apply initial configuration
        this.applyCurrentConfig();
    }

    /**
     * Apply the current displacement configuration to the shader
     */
    private applyCurrentConfig(): void {
        if (!this.shaderMaterial || !this.babylonScene) return;

        const index = Math.floor(this.currentConfigIndex);
        if (index >= this.displacementConfigs.length) return;

        const config = this.displacementConfigs[index];
        const alpha = this.currentConfigIndex % 1;

        // Get the next config for blending (or use current if at the end)
        const nextIndex = Math.min(index + 1, this.displacementConfigs.length - 1);
        const nextConfig = this.displacementConfigs[nextIndex];

        // Set blend factor (0 = first source only, 1 = second source only)
        this.shaderMaterial.setFloat("textureBlendFactor", alpha);

        // === First displacement source (current config) ===
        const useProceduralNoise1 = config.type === "procedural" ? 1.0 : 0.0;
        this.shaderMaterial.setFloat("useProceduralNoise", useProceduralNoise1);
        this.shaderMaterial.setFloat("displacementIntensity", config.intensity);
        this.shaderMaterial.setVector2("displacementSpeed", config.speed);
        this.shaderMaterial.setFloat("displacementTextureScale", config.textureScale);

        if (config.type === "texture" && config.textureUrl) {
            const texture = this.getTexture(config.textureUrl, this.babylonScene.scene);
            this.shaderMaterial.setTexture("displacementMap", texture);
        }

        // Procedural noise parameters (used by first source when procedural)
        this.shaderMaterial.setFloat("waveFrequencyX", config.waveFrequencyX ?? 8);
        this.shaderMaterial.setFloat("waveFrequencyZ", config.waveFrequencyZ ?? 15);
        this.shaderMaterial.setFloat("waveSpeed", config.waveSpeed ?? 0.3);

        // === Second displacement source (next config for blending) ===
        const useProceduralNoise2 = nextConfig.type === "procedural" ? 1.0 : 0.0;
        this.shaderMaterial.setFloat("useProceduralNoise2", useProceduralNoise2);
        this.shaderMaterial.setFloat("displacementIntensity2", nextConfig.intensity);
        this.shaderMaterial.setVector2("displacementSpeed2", nextConfig.speed);
        this.shaderMaterial.setFloat("displacementTextureScale2", nextConfig.textureScale);

        if (nextConfig.type === "texture" && nextConfig.textureUrl) {
            const texture2 = this.getTexture(nextConfig.textureUrl, this.babylonScene.scene);
            this.shaderMaterial.setTexture("displacementMap2", texture2);
        }

        // === Colors (blend between configs) ===
        const topColor = this.lerpColor3(config.topColor, nextConfig.topColor, alpha);
        const bottomColor = this.lerpColor3(config.bottomColor, nextConfig.bottomColor, alpha);
        this.shaderMaterial.setColor3("topColor", topColor);
        this.shaderMaterial.setColor3("bottomColor", bottomColor);

        // === Update max Y for color gradient ===
        const blendedIntensity = this.lerp(config.intensity, nextConfig.intensity, alpha);
        this.configIntensity = blendedIntensity;
        let currentMaxY = blendedIntensity * this.matrixHeight;
        if (currentMaxY <= 0) {
            currentMaxY = 0.0001;
        }
        this.shaderMaterial.setFloat("maxY", currentMaxY);
    }

    /**
     * Create the ground plane mesh with high subdivision for displacement
     */
    private createMesh(scene: Scene): void {
        this.mesh = MeshBuilder.CreateGround(
            "displacementGround",
            {
                width: this.matrixWidth,
                height: this.matrixDepth,
                subdivisions: this.subdivisions,
                updatable: false,
            },
            scene
        );

        // Rotate to match original coordinate system (mesh lies in XZ plane by default)
        // No rotation needed as Ground mesh is already in XZ plane

        if (this.shaderMaterial) {
            this.mesh.material = this.shaderMaterial;
        }
    }

    public update(index: number): void {
        if (index >= this.displacementConfigs.length) {
            console.warn("Index out of bounds for displacement configs");
            return;
        }
        this.currentConfigIndex = index;
        this.applyCurrentConfig();
    }

    public resetSteps(): void {
        this.currentConfigIndex = 0;
        this.applyCurrentConfig();
    }

    private setupCamera(camera: BasicCamera): void {
        camera.position = new Vector3(0.43, 0.93, 3.6);
        const degreesToRadians = (degrees: number) => degrees * (Math.PI / 180);
        if (getScreenState() == "sm") {
            camera.position = new Vector3(0, 0.93, 2.77);
            camera.rotation = new Vector3(degreesToRadians(-27.0), 0, 0);
        } else {
            camera.rotation = new Vector3(
                degreesToRadians(-17.36),
                degreesToRadians(3.47),
                0
            );
        }
    }

    public async initialize(renderCanvas: HTMLCanvasElement): Promise<void> {
        this.babylonScene = new BabylonScene(renderCanvas);
        this.babylonScene.mediaQueryFOVs = [0.8, 0.6, 0.5, 0.4, 0.4];
        await this.babylonScene.init();

        // Adjust for mobile
        if (getScreenState() == "sm") {
            this.matrixWidth = this.mobileMatrixWidth;
            this.subdivisions = this.mobileSubdivisions;
        }

        // Setup configurations
        this.setupDisplacementConfigs();

        // Setup shader and mesh
        await this.setupShaderMaterial(this.babylonScene.scene);
        this.createMesh(this.babylonScene.scene);

        // Setup camera
        this.setupCamera(this.babylonScene.camera);

        // Render loop
        this.babylonScene.onRender = (delta: number) => {
            const deltaTime = delta / 1000;
            this.elapsedTime += deltaTime;

            if (this.shaderMaterial) {
                // Update time uniform for animations
                this.shaderMaterial.setFloat("time", this.elapsedTime * this.waveTimeSpeed);
            }
        };

        this.onReady();
    }

    public dispose(): void {
        this.shaderMaterial?.dispose();
        this.mesh?.dispose();
        this.textureCache.forEach((texture) => texture.dispose());
        this.textureCache.clear();
        this.babylonScene?.dispose();
    }
}
