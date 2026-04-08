
#ifdef GL_ES
precision highp float;
#endif

// Attributes
attribute vec3 position;
attribute vec2 uv;

// Uniforms
uniform mat4 world;
uniform mat4 worldViewProjection;
uniform float time;
uniform float timeSpeedMultiplier;
uniform float scrollOffset;

// Displacement uniforms
uniform sampler2D displacementMap;
uniform sampler2D displacementMap2;
uniform float displacementScale;
uniform float displacementIntensity;
uniform float displacementIntensity2;
uniform vec2 displacementSpeed;
uniform vec2 displacementSpeed2;
uniform float displacementTextureScale;
uniform float displacementTextureScale2;
uniform float textureBlendFactor; // 0.0 = first texture, 1.0 = second texture

// Sine wave noise uniforms (for procedural displacement)
uniform float useProceduralNoise;
uniform float useProceduralNoise2;
uniform float waveFrequencyX;
uniform float waveFrequencyZ;
uniform float waveSpeed;


varying vec3 vWorldPos;
varying float vDisplacement;
varying vec2 vUV;

// Simple pseudo-random function for GPU
float rand(vec2 co){
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(void) {
    vec3 displacedPosition = position;
    
    // Pass UV to fragment shader for dot pattern
    // Also apply scroll offset to the dot pattern so the dots move with the wave
    vUV = uv;
    vUV.y += scrollOffset;
    
    // Create scroll-offset UVs for usage in displacement calculations
    vec2 offsetUV = uv;
    offsetUV.y -= scrollOffset;

    // Calculate displacement from first source
    float displacement1 = 0.0;
    if (useProceduralNoise > 0.5) {
        // Procedural sine wave noise (matching SineWaveNoise.ts logic)
        float animTime = time * timeSpeedMultiplier;
        float angledCos = cos(animTime * 0.2);
        float angledSin = sin(animTime * 0.2);
        
        float waveX = (1.0 + sin((offsetUV.x * angledCos - offsetUV.y * angledSin) * waveFrequencyX + animTime * waveSpeed)) / 2.0;
        float waveZ = (1.0 + sin((offsetUV.x * angledSin + offsetUV.y * angledCos) * waveFrequencyZ + animTime * waveSpeed)) / 2.0;
        displacement1 = (waveX + waveZ) / 2.0;
    } else {
        // Texture-based displacement with time-based scrolling
        vec2 animatedUV = vec2(uv.x, 1.0 - uv.y) * displacementTextureScale;
        animatedUV.y += scrollOffset; // Apply scroll offset to displacement texture
        animatedUV += (time * timeSpeedMultiplier) * displacementSpeed;
        animatedUV = fract(animatedUV); // Wrap UVs
        
        displacement1 = texture2D(displacementMap, animatedUV).r;
    }
    displacement1 *= displacementIntensity;

    // Calculate displacement from second source
    float displacement2 = 0.0;
    if (useProceduralNoise2 > 0.5) {
        // Procedural sine wave noise for second source
        float animTime2 = time * timeSpeedMultiplier;
        float angledCos = cos(animTime2 * 0.2);
        float angledSin = sin(animTime2 * 0.2);
        
        float waveX = (1.0 + sin((offsetUV.x * angledCos - offsetUV.y * angledSin) * waveFrequencyX + animTime2 * waveSpeed)) / 2.0;
        float waveZ = (1.0 + sin((offsetUV.x * angledSin + offsetUV.y * angledCos) * waveFrequencyZ + animTime2 * waveSpeed)) / 2.0;
        displacement2 = (waveX + waveZ) / 2.0;
    } else {
        // Texture-based displacement for second source
        vec2 animatedUV2 = vec2(uv.x, 1.0 - uv.y) * displacementTextureScale2;
        animatedUV2.y += scrollOffset; // Apply scroll offset
        animatedUV2 += (time * timeSpeedMultiplier) * displacementSpeed2;
        animatedUV2 = fract(animatedUV2);
        
        displacement2 = texture2D(displacementMap2, animatedUV2).r;
    }
    displacement2 *= displacementIntensity2;

    // Blend between the two displacement sources
    float displacement = mix(displacement1, displacement2, textureBlendFactor);

    // Apply displacement to Y axis
    displacement *= displacementScale;
    displacedPosition.y = displacement;
    vDisplacement = displacement;

    // Calculate world position for fog
    vWorldPos = (world * vec4(displacedPosition, 1.0)).xyz;
    
    // Transform position
    gl_Position = worldViewProjection * vec4(displacedPosition, 1.0);
}
