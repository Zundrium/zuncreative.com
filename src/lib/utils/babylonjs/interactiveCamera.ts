import { Observer } from "@babylonjs/core/Misc/observable";
import { type Nullable } from "@babylonjs/core/types";
import { Scene } from "@babylonjs/core/scene";
import { Matrix, Quaternion, Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Tools } from "@babylonjs/core/Misc/tools";
import { BasicCamera } from "./basicCamera";

/**
 * An extension of BasicCamera that provides subtle, interpolated mouse-based
 * rotation and translation offsets for an immersive parallax effect.
 * This interactivity is disabled on mobile/touch devices.
 */
export class InteractiveCamera extends BasicCamera {
	// --- Public Configuration ---
	/** The maximum rotation in degrees the MOUSE can apply. Default: 5 */
	public maxMouseRotationDegrees = 2;
	/** The maximum translation offset the MOUSE can apply. Default: 0.01 */
	public maxMouseTranslationOffset = 0.2;
	/** The smoothing factor for camera movement (lower is smoother). Default: 0.05 */
	public interpolationFactor = 0.05;

	// --- Private State ---
	private _basePosition = new Vector3();
	private _baseRotationQuaternion = new Quaternion();
	private _renderObserver: Nullable<Observer<Scene>> = null;

	constructor(name: string, position: Vector3, scene: Scene) {
		super(name, position, scene);
	}

	/**
	 * Updates the camera's "base" state to its current position and rotation.
	 * Call this after you manually move the camera.
	 */
	public setBaseState(): void {
		this._basePosition.copyFrom(this.position);
		this._baseRotationQuaternion.copyFrom(this.rotationQuaternion);
	}

	/**
	 * Attaches mouse controls to the camera.
	 * This method will do nothing on mobile/touch devices.
	 */
	public attachControl(): void {
		// --- NEW: Check for mobile and disable interactivity ---
		// navigator.maxTouchPoints > 0 is a reliable way to detect touch support.
		const isMobile = navigator.maxTouchPoints > 0;
		if (isMobile) {
			return; // Do not attach any controls on mobile/touch devices
		}

		// Prevent multiple attachments
		if (this._renderObserver) {
			return;
		}
		this.setBaseState();

		const scene = this.getScene();

		// Main update loop for mouse interactivity
		this._renderObserver = scene.onBeforeRenderObservable.add(() => {
			const mouseOffsets = this._calculateMouseOffsets();
			const offsetPosition = mouseOffsets.position;
			const offsetRotation = mouseOffsets.rotation;

			// Calculate the final target state by applying the offset to the base state
			const targetPosition = this._basePosition.add(offsetPosition);
			const targetRotation =
				this._baseRotationQuaternion.multiply(offsetRotation);

			// Interpolate smoothly towards the target
			Vector3.LerpToRef(
				this.position,
				targetPosition,
				this.interpolationFactor,
				this.position,
			);
			Quaternion.SlerpToRef(
				this.rotationQuaternion,
				targetRotation,
				this.interpolationFactor,
				this.rotationQuaternion,
			);
		});
	}

	/**
	 * Detaches the controls from the camera.
	 */
	public detachControl(): void {
		if (this._renderObserver) {
			this.getScene().onBeforeRenderObservable.remove(this._renderObserver);
			this._renderObserver = null;
		}
	}

	/**
	 * Calculates clamped offsets from mouse position.
	 * This logic is inverted for a "pushing the world" feel.
	 */
	private _calculateMouseOffsets() {
		const scene = this.getScene();
		const canvas = scene.getEngine().getRenderingCanvas();
		if (!canvas) {
			return { position: Vector3.Zero(), rotation: Quaternion.Identity() };
		}

		const normalizedX = (scene.pointerX / canvas.width - 0.5) * 2;
		const normalizedY = (scene.pointerY / canvas.height - 0.5) * 2;

		// Inverted Rotation Offset
		const yawRad = normalizedX * Tools.ToRadians(this.maxMouseRotationDegrees);
		const pitchRad =
			normalizedY * Tools.ToRadians(this.maxMouseRotationDegrees);
		const rotation = Quaternion.FromEulerAngles(pitchRad, yawRad, 0);

		// Translation Offset
		const baseRotationMatrix = new Matrix();
		this._baseRotationQuaternion.toRotationMatrix(baseRotationMatrix);
		const worldRight = Vector3.TransformNormal(
			Vector3.Right(),
			baseRotationMatrix,
		);
		const worldUp = Vector3.TransformNormal(Vector3.Up(), baseRotationMatrix);

		const transX = normalizedX * this.maxMouseTranslationOffset;
		const transY = -normalizedY * this.maxMouseTranslationOffset; // Keep Y-translation inverted for natural feel
		const position = worldRight.scale(transX).add(worldUp.scale(transY));

		return { position, rotation };
	}
}
