import { Scalar } from "@babylonjs/core/Maths/math.scalar";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { SolidParticleSystem } from "@babylonjs/core/Particles/solidParticleSystem";
import { SolidParticle } from "@babylonjs/core/Particles/solidParticle";
import { Scene } from "@babylonjs/core/scene";
import { BabylonScene } from "$lib/utils/babylonjs/babylonScene";
import type { IBabylonGraphics } from "./utils";

export class Example3D implements IBabylonGraphics {
	private babylonScene: BabylonScene | null = null;
	private particleSystem: SolidParticleSystem | null = null;
	public onReady: () => void = () => {};

	public constructor() {}

	private createParticleSystem(mesh: Mesh, scene: Scene) {
		const particleSystem = new SolidParticleSystem("SPS", scene);
		particleSystem.addShape(mesh, 500);
		const range = 64;
		particleSystem.initParticles = () => {
			for (let p = 0; p < particleSystem.nbParticles; p++) {
				const particle = particleSystem.particles[p];
				particle.position.x = Scalar.RandomRange(-range, range);
				particle.position.y = Scalar.RandomRange(-range, range);
				particle.position.z = Scalar.RandomRange(2, range * 1.2);
				particle.rotation.set(
					Scalar.RandomRange(-Math.PI * 2, Math.PI * 2),
					Scalar.RandomRange(-Math.PI * 2, Math.PI * 2),
					Scalar.RandomRange(-Math.PI * 2, Math.PI * 2),
				);
			}
		};
		particleSystem.vars.timeDelta = 0;
		particleSystem.vars.range = range;

		particleSystem.vars.moveSpeed = 0.0003;
		particleSystem.vars.rotationSpeed = 0.00007;
		particleSystem.updateParticle = (particle: SolidParticle) => {
			particle.position.y +=
				particleSystem.vars.moveSpeed * particleSystem.vars.timeDelta;
			if (particle.position.y > particleSystem.vars.range) {
				particle.position.y = -particleSystem.vars.range;
			}
			particle.rotation.x +=
				particleSystem.vars.rotationSpeed * particleSystem.vars.timeDelta;
			particle.rotation.y +=
				particleSystem.vars.rotationSpeed * particleSystem.vars.timeDelta;
			particle.rotation.z +=
				2 * particleSystem.vars.rotationSpeed * particleSystem.vars.timeDelta;
			return particle;
		};

		const particleSystemMesh = particleSystem.buildMesh();
		particleSystemMesh.material = mesh.material;
		particleSystem.initParticles();
		particleSystem.setParticles();

		particleSystem.computeParticleColor = false;
		particleSystem.computeParticleTexture = false;

		return particleSystem;
	}

	public async initialize(renderCanvas: HTMLCanvasElement) {
		this.babylonScene = new BabylonScene(renderCanvas);
		console.log("Example3D: initializing");
		await this.babylonScene.init();
		this.babylonScene.setBackgroundColor("transparent");

		console.log("Example3D: loading");
		const [env, assetContainer] = await Promise.all([
			this.babylonScene!.loadENV("/env/hdri_1k.env", false),
			this.babylonScene!.loadGLTF("/geom/zun_cube.glb"),
		]);

		const cubeMesh = assetContainer.meshes[1] as Mesh;

		this.particleSystem = this.createParticleSystem(
			cubeMesh,
			this.babylonScene!.scene,
		);

		let _elapsedTime = 0;
		this.babylonScene!.onRender = (deltaTime: number) => {
			_elapsedTime += deltaTime;
			this.particleSystem!.vars.timeDelta = deltaTime;
			this.particleSystem!.setParticles();
		};

		console.log("Example3D: loaded");
		this.onReady();
	}

	public dispose() {
		this.babylonScene?.dispose();
	}
}

