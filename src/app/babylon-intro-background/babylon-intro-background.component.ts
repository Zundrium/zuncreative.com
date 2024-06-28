import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { Color4 } from '@babylonjs/core/Maths/math';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { TargetCamera } from '@babylonjs/core/Cameras/targetCamera';
import { Vector3 } from '@babylonjs/core/Maths/math';
import { SolidParticleSystem } from '@babylonjs/core/Particles/solidParticleSystem';
import { Scalar } from '@babylonjs/core/Maths/math.scalar';
import { DefaultRenderingPipeline } from '@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline';
import { SolidParticle } from '@babylonjs/core/Particles/solidParticle';
import '@babylonjs/core/Rendering/depthRendererSceneComponent';
import '@babylonjs/core/Rendering/depthRenderer';
import { DepthOfFieldEffectBlurLevel } from '@babylonjs/core/PostProcesses/depthOfFieldEffect';
import { HDRCubeTexture } from '@babylonjs/core/Materials/Textures/hdrCubeTexture';
import '@babylonjs/core/Helpers/sceneHelpers';
import { AssetContainer } from '@babylonjs/core/assetContainer';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import "@babylonjs/loaders/glTF/2.0/glTFLoader";
import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial';
import * as TWEEN from '@tweenjs/tween.js';
import { HardwareScalingOptimization, SceneOptimizer, SceneOptimizerOptions } from '@babylonjs/core/Misc/sceneOptimizer';
import { SlideContainerEventService } from '../slide-container-event.service';

@Component({
  selector: 'app-babylon-intro-background',
  template: '<canvas #canvas></canvas>',
  styleUrls: ['./babylon-intro-background.component.scss']
})
export class BabylonIntroBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas!: ElementRef;
  private _engine!: Engine;
  private _scene!: Scene;
  private _camera!: TargetCamera;
  private _particleSystem!: SolidParticleSystem;
  private _elapsedTime: number = 0;
  private _framerate: number = 24;
  private _frameTimeMs: number = 1000 / this._framerate;
  private _defaultPipeline!: DefaultRenderingPipeline;
  private visible: boolean = false;
  private _introTween!: any;

  constructor(private element: ElementRef, private slideContainerEventService: SlideContainerEventService) {
    this.slideContainerEventService.onAnimationComplete.subscribe(() => {
      this.checkVisibility();
    })
  }

  checkVisibility() {
    const inView = this.isElementInViewport();
    if (!this.visible && inView) {
      this.visible = true;
    } else if (this.visible && !inView) {
      this.visible = false;
    }
  }

  // source: https://stackoverflow.com/questions/123999/how-can-i-tell-if-a-dom-element-is-visible-in-the-current-viewport
  isElementInViewport() {
    const rect = this.element.nativeElement.getBoundingClientRect();
    if (rect.width == 0 || rect.height == 0) return false;
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + 1 && /* or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) + 1 /* or $(window).width() */
    );
  }

  ngAfterViewInit(): void {
    this.checkVisibility();
    this._engine = this.createEngine(this.canvas.nativeElement);
    this._scene = this.createScene(this._engine);
    this.optimizeScene(this._scene);
    this._camera = this.createCamera(this._scene);

    Promise.all([
      this.loadHDR(this._scene, 'decor_shop_512.hdr'),
      this.loadMesh("zun_cube.glb", this._scene)
    ]).then((promises) => {
      this._particleSystem = this.createParticleSystem(promises[1], this._scene);
      this.animateIntro();
    })
    this._defaultPipeline = this.createRenderPipeline(this._scene, this._camera);

    this.render();
    this.setupResize();
    //this._scene.debugLayer.show();
  }

  ngOnDestroy(): void {
    this._particleSystem.dispose();
    this._engine.dispose();
    if(this._introTween){
      this._introTween.stop();
    }
  }

  setupResize() {
    window.addEventListener('resize', () => {
      this._engine.resize();
    });
  }

  loadMesh(name: string, scene: Scene): Promise<Mesh> {
    return new Promise((success) => {
      SceneLoader.LoadAssetContainer('assets/geom/', name, scene, (assetContainer: AssetContainer) => {
        const cubeMesh = <Mesh>assetContainer.meshes[0].getChildren()[0];
        const material = <PBRMaterial>cubeMesh.material;
        material.sheen.isEnabled = true;
        material.sheen.intensity = 0.5;
        material.anisotropy.isEnabled = true;
        material.anisotropy.intensity = 0.9;
        material.clearCoat.isEnabled = true;
        material.clearCoat.roughness = 0.5;
        material.clearCoat.intensity = 0.6;
        material.clearCoat.indexOfRefraction = 2;
        success(cubeMesh);
      });
    });
  }

  createRenderPipeline(scene: Scene, camera: TargetCamera): DefaultRenderingPipeline {
    const pipeline = new DefaultRenderingPipeline('default', false, scene, [camera]);
    pipeline.depthOfFieldEnabled = true;
    pipeline.depthOfField.focusDistance = 7 * 1000;
    pipeline.depthOfField.fStop = 1.5;
    pipeline.depthOfField.focalLength = 150;
    pipeline.depthOfFieldBlurLevel = DepthOfFieldEffectBlurLevel.High;
    pipeline.fxaaEnabled = true;
    pipeline.samples = 2;
    pipeline.imageProcessingEnabled = true;
    pipeline.imageProcessing.toneMappingEnabled = true;
    pipeline.imageProcessing.toneMappingType = 0;
    pipeline.imageProcessing.vignetteEnabled = true;
    pipeline.imageProcessing.vignetteWeight = 6;
    pipeline.imageProcessing.vignetteCameraFov = 4;
    pipeline.imageProcessing.vignetteCentreY = 1.5;
    return pipeline;
  }

  loadHDR(scene: Scene, name: string, size: number = 128): Promise<void> {
    return new Promise((success) => {
      const environmentTexture = new HDRCubeTexture(`assets/img/hdr/${name}`, scene, size, true, true, false, true);
      scene.environmentTexture = environmentTexture;
      scene.environmentIntensity = 4;
      this.createSkybox(scene);
      success();
    });
  }

  createSkybox(scene: Scene) {
    const skybox = scene.createDefaultSkybox(this._scene.environmentTexture!, false, 1000, 0.3, false);
    return skybox;
  }

  animateIntro() {
    const newValue = { y: this._defaultPipeline.imageProcessing.vignetteWeight }
    this._introTween = new TWEEN.Tween(newValue)
      .to({ y: 0 }, 2000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        this._defaultPipeline.imageProcessing.vignetteWeight = newValue.y;
      })
      .start();
  }

  optimizeScene(scene: Scene) {

    const options = new SceneOptimizerOptions();
    options.addOptimization(new HardwareScalingOptimization(0, 2));

    const optimizer = SceneOptimizer.OptimizeAsync(scene, options,
      () => {
      }, () => {
        console.log("fps not reached");
      });

    optimizer.targetFrameRate = 24;
  }

  createParticleSystem(mesh: Mesh, scene: Scene) {
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
          Scalar.RandomRange(-Math.PI * 2, Math.PI * 2)
        )
      }
    };
    particleSystem.vars.timeDelta = 0;
    particleSystem.vars.range = range;

    particleSystem.vars.moveSpeed = 0.0003;
    particleSystem.vars.rotationSpeed = 0.00007;
    particleSystem.updateParticle = (particle: SolidParticle) => {
      particle.position.y += particleSystem.vars.moveSpeed * particleSystem.vars.timeDelta;
      if (particle.position.y > particleSystem.vars.range) {
        particle.position.y = -particleSystem.vars.range;
      }
      particle.rotation.x += particleSystem.vars.rotationSpeed * particleSystem.vars.timeDelta;
      particle.rotation.y += particleSystem.vars.rotationSpeed * particleSystem.vars.timeDelta;
      particle.rotation.z += 2 * particleSystem.vars.rotationSpeed * particleSystem.vars.timeDelta;
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

  render(): void {
    this._engine.runRenderLoop(() => {
      if (!this.visible) return;
      this._elapsedTime += this._engine.getDeltaTime();
      if (this._elapsedTime > this._frameTimeMs) {
        if (this._particleSystem) {
          this._particleSystem.vars.timeDelta = this._elapsedTime;
          this._particleSystem.setParticles();
        }
        this._scene.render();
        this._elapsedTime = 0;
      }
    });
  }

  createCamera(scene: Scene): TargetCamera {
    const camera = new TargetCamera('camera1', new Vector3(0, 0, -10), scene);
    camera.minZ = 1;
    camera.fov = 1.3;
    camera.maxZ = 200;
    return camera;
  }

  createEngine(canvas: HTMLCanvasElement): Engine {
    const engine = new Engine(canvas, true);
    return engine;
  }

  createScene(engine: Engine): Scene {
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 1);
    scene.useRightHandedSystem = true;
    return scene;
  }

}
