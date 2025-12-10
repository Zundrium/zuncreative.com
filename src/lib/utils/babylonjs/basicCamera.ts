import { Camera } from "@babylonjs/core/Cameras/camera";
import { Matrix, Vector3, Quaternion } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";

export class BasicCamera extends Camera {
    /**
     * The definitive rotation of the camera as a quaternion.
     * This is the SOURCE OF TRUTH for camera orientation.
     */
    public rotationQuaternion = new Quaternion();

    // Private backing field for the .rotation getter/setter
    private _rotation = new Vector3(0, 0, 0);

    // Private members for performance optimization
    private _viewMatrix = new Matrix();
    private _tempWorldMatrix = new Matrix();

    constructor(name: string, position: Vector3, scene: Scene) {
        super(name, position, scene);
        // Ensure the initial quaternion matches the initial rotation vector
        this.rotation = this._rotation;
    }

    /**
     * A convenience property for getting and setting rotation using Euler angles (in radians).
     * Note: When getting the value, it is calculated from the `rotationQuaternion`.
     * Note: When setting the value, it will overwrite the `rotationQuaternion`.
     * For animations, it's more performant to manipulate the `rotationQuaternion` directly.
     */
    public get rotation(): Vector3 {
        this.rotationQuaternion.toEulerAnglesToRef(this._rotation);
        return this._rotation;
    }

    public set rotation(newRotation: Vector3) {
        this._rotation.copyFrom(newRotation);
        Quaternion.FromEulerVectorToRef(this._rotation, this.rotationQuaternion);
    }

    public getClassName(): string {
        return "BasicCamera";
    }

    /**
     * This is the method that the engine calls to get the camera's view matrix.
     * We override it to implement our custom rotation logic.
     * @returns The camera's view matrix.
     * @internal
     */
    public _getViewMatrix(): Matrix {
        // Create the camera's world matrix from its position and rotationQuaternion.
        // This is now more efficient as no conversion happens here.
        Matrix.ComposeToRef(
            Vector3.OneReadOnly, // Scale
            this.rotationQuaternion, // Rotation (already a quaternion)
            this.position, // Translation
            this._tempWorldMatrix,
        );

        // Invert the world matrix to get the view matrix.
        this._tempWorldMatrix.invertToRef(this._viewMatrix);

        return this._viewMatrix;
    }
}
