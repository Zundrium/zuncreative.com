
precision highp float;

// Attributes
attribute vec3 position;

// Uniforms
uniform mat4 world; // REQUIRED: The model-to-world transformation matrix
uniform mat4 worldViewProjection;
uniform float pointSize;
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float minY;
uniform float maxY;

// Varyings (passed to fragment shader)
varying vec3 vColor;
varying vec3 vWorldPos; // REQUIRED: This declares the variable to be passed

void main(void) {
    // REQUIRED: This calculates the world position and assigns it to the varying.
    // This is the line that was missing from your setup.
    vWorldPos = (world * vec4(position, 1.0)).xyz;

    // Standard position calculation for the screen
    gl_Position = worldViewProjection * vec4(position, 1.0);

    // Set the size of the point
    gl_PointSize = pointSize;

    // Color calculation (this part is correct)
    float t = (position.y - minY) / (maxY - minY);
    t = clamp(t, 0.0, 1.0);
    vColor = mix(bottomColor, topColor, t);
}

