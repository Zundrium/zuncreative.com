
#ifdef GL_ES
precision highp float;
#endif

// Attributes, Uniforms, and Varyings remain the same...
attribute vec3 position;

uniform mat4 world;
uniform mat4 worldViewProjection;
uniform float pointSize;
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float minY;
uniform float maxY;


varying vec3 vColor;
varying vec3 vWorldPos;

void main(void) {
    vWorldPos = (world * vec4(position, 1.0)).xyz;
    gl_Position = worldViewProjection * vec4(position, 1.0);
    gl_PointSize = pointSize;
    float t = (position.y - minY) / (maxY - minY);
    t = clamp(t, 0.0, 1.0);
    vColor = mix(bottomColor, topColor, t);
}
