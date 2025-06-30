
// File: src/lib/assets/shaders/pointCloud.frag

precision highp float;

// Varyings
varying vec3 vColor;
varying vec3 vWorldPos;

// Uniforms
uniform float time;
uniform float waveFrequency;
uniform float waveIntensity;
uniform float zFogStartMin; // Front edge, transparent (e.g., 2.0)
uniform float zFogStartMax; // Front fog ends, opaque (e.g., 1.0)
uniform float zFogEndMin;   // Back fog starts, opaque (e.g., 0.0)
uniform float zFogEndMax;   // Back edge, transparent (e.g., -2.0)

void main(void) {
    // --- 1. Sine Wave Color Effect ---
    vec3 colorWithWave = vColor + vec3((sin((vWorldPos.x + vWorldPos.z) * waveFrequency + time) * 0.5 + 0.5) * waveIntensity);

    // --- 2. Dual-Ended Linear Fog (Robust Method) ---

    // Calculate the front fog factor.
    // This goes from 0.0 (at the opaque edge) to 1.0 (at the transparent edge).
    float frontFog = (zFogStartMax - vWorldPos.z) / (zFogStartMax - zFogStartMin);
    frontFog = clamp(frontFog, 0.0, 1.0);

    // Calculate the back fog factor.
    // This goes from 0.0 (at the opaque edge) to 1.0 (at the transparent edge).
    float backFog = (zFogEndMin - vWorldPos.z) / (zFogEndMin - zFogEndMax);
    backFog = clamp(backFog, 0.0, 1.0);

    // The total fog is the maximum of the two fog factors.
    // In the clear middle zone, both factors will be 0.
    float totalFogFactor = max(frontFog, backFog);

    // The final alpha is 1.0 minus the total fog.
    float alpha = 1.0 - totalFogFactor;

    // --- Final Color ---
    gl_FragColor = vec4(colorWithWave, alpha);
}

