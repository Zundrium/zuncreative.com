
#ifdef GL_ES
precision highp float;
#endif

// Varyings
varying vec3 vColor;
varying vec3 vWorldPos;
varying float vDisplacement;
varying vec2 vUV;

// Fog uniforms
uniform float time;
uniform float waveFrequency;
uniform float waveIntensity;
uniform float zFogStartMin;
uniform float zFogStartMax;
uniform float zFogEndMin;
uniform float zFogEndMax;

// Dot pattern uniforms
uniform float dotGridSize;  // Number of dots across the mesh
uniform float dotRadius;    // Radius of each dot (0 to 0.5)

void main(void) {
    // Create a grid of dots using UV coordinates
    // Scale UVs to create a grid pattern
    vec2 scaledUV = vUV * dotGridSize;
    
    // Get position within each grid cell (0 to 1)
    vec2 cellPos = fract(scaledUV);
    
    // Calculate distance from center of the cell (center is at 0.5, 0.5)
    vec2 centeredPos = cellPos - vec2(0.5);
    float distFromCenter = length(centeredPos);
    
    // Discard pixels outside the dot radius
    if (distFromCenter > dotRadius) {
        discard;
    }

    // Add wave color effect
    vec3 colorWithWave = vColor + vec3((sin((vWorldPos.x + vWorldPos.z) * waveFrequency + time) * 0.5 + 0.5) * waveIntensity);

    // Front fog (near camera) - fade to black
    float frontFog = (zFogStartMax - vWorldPos.z) / (zFogStartMax - zFogStartMin);
    frontFog = clamp(frontFog, 0.0, 1.0);

    // Back fog (far from camera) - fade to black
    float backFog = (zFogEndMin - vWorldPos.z) / (zFogEndMin - zFogEndMax);
    backFog = clamp(backFog, 0.0, 1.0);

    // Combine fog factors and apply as color fade (not alpha)
    float totalFogFactor = max(frontFog, backFog);
    vec3 finalColor = colorWithWave * (1.0 - totalFogFactor);

    gl_FragColor = vec4(finalColor, 1.0);
}
