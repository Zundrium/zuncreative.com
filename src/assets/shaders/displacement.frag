
#ifdef GL_ES
precision highp float;
#endif

// Varyings
// Varyings
varying vec3 vWorldPos;
varying float vDisplacement;
varying vec2 vUV;

// Color uniforms
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float minY;
uniform float maxY;
uniform float saturation; // Factor > 1.0 increases vividness

vec3 adjustSaturation(vec3 color, float adjustment) {
    const vec3 luminanceW = vec3(0.2126, 0.7152, 0.0722);
    float luminance = dot(color, luminanceW);
    vec3 greyScale = vec3(luminance);
    return mix(greyScale, color, adjustment);
}

// Fog uniforms
uniform float time;
uniform float waveFrequency;
uniform float waveIntensity;
uniform float zFogStartMin;
uniform float zFogStartMax;
uniform float zFogEndMin;
uniform float zFogEndMax;
uniform vec3 fogColor;

uniform float revealProgress; // 0.0 = fully hidden by fog, 1.0 = fully revealed

// Rime uniforms
uniform vec3 cameraPosition;
uniform float rimPower;
uniform float rimIntensity;

// Grid uniforms
uniform sampler2D gridTexture;
uniform float gridResolution;
uniform float dotSize;

void main(void) {

    // Calculate color based on height with smooth transition
    float currentMaxY = maxY;
    if (currentMaxY <= 0.0) currentMaxY = 0.0001;
    
    float t = (vDisplacement - minY) / (currentMaxY - minY);
    t = clamp(t, 0.0, 1.0);
    // Use smoothstep for non-linear interpolation
    t = smoothstep(0.0, 1.0, t);
    
    vec3 baseColor = mix(bottomColor, topColor, t);
    
    // Boost saturation
    baseColor = adjustSaturation(baseColor, saturation);

    // Add wave color effect
    vec3 colorWithWave = baseColor + vec3((sin((vWorldPos.x + vWorldPos.z) * waveFrequency + time) * 0.5 + 0.5) * waveIntensity);

    // Calculate Face Normal using derivatives (flat shading relative to displacement)
    // This gives us the normal of the displaced surface geometry
    vec3 dx = dFdx(vWorldPos);
    vec3 dy = dFdy(vWorldPos);
    vec3 normal = normalize(cross(dx, dy));
    // If backfacing, flip normal? Usually for terrain, normals point up/out.
    // Ensure normal points somewhat up
    if (normal.y < 0.0) normal = -normal;

    // Calculate View Direction
    vec3 viewDir = normalize(cameraPosition - vWorldPos);

    // Fresnel Rim Effect
    // 1.0 - dot(N, V) gives 0 at center, 1 at grazing angles
    float fresnel = 1.0 - max(dot(normal, viewDir), 0.0);
    fresnel = pow(fresnel, rimPower);
    vec3 rimColor = vec3(1.0) * fresnel * rimIntensity; // White rim

    // Add rim to base color
    vec3 finalColorWithRim = colorWithWave + rimColor;

    // Front fog (near camera) - fade to black
    float frontFog = (zFogStartMax - vWorldPos.z) / (zFogStartMax - zFogStartMin);
    frontFog = clamp(frontFog, 0.0, 1.0);

    // Back fog (far from camera) - fade to black
    float backFog = (zFogEndMin - vWorldPos.z) / (zFogEndMin - zFogEndMax);
    backFog = clamp(backFog, 0.0, 1.0);

    // Combine fog factors and apply as color fade (not alpha)
    float totalFogFactor = max(frontFog, backFog);
    
    // Reveal effect: Spatial reveal from camera position
    // Calculate distance from camera to vertex
    float dist = distance(vWorldPos, cameraPosition);
    
    // Max distance to reveal (cover the whole grid)
    float maxRevealDist = 20.0;
    
    // Current radius of the clear zone
    float revealRadius = revealProgress * maxRevealDist;
    
    // Calculate reveal fog factor
    // 0.0 inside the radius (revealed), 1.0 outside (fogged)
    // Use smooth transition at the edge
    float revealFog = smoothstep(revealRadius - 2.0, revealRadius, dist);
    
    // Combine with distance fog - keep the strongest fog
    float effectiveFog = max(totalFogFactor, revealFog);
    
    vec3 finalColor = mix(finalColorWithRim, fogColor, effectiveFog);

    // Apply repeating grid texture
    // Create tiled UVs based on subdivision count (gridResolution)
    // Add 0.5 offset to align texture center with vertices
    vec2 gridUV = vUV * gridResolution + 0.5;
    
    // Scale UVs for dot size control
    // To scale the dot while keeping it centered, we need to operate on the fractional part
    vec2 cellUV = fract(gridUV);
    vec2 centeredUV = cellUV - 0.5;
    float scaleFactor = 1.0 / max(dotSize, 0.001);
    vec2 scaledUV = centeredUV * scaleFactor + 0.5;
    
    // Check if we are outside the scaled texture area
    if (scaledUV.x < 0.0 || scaledUV.x > 1.0 || scaledUV.y < 0.0 || scaledUV.y > 1.0) {
        discard;
    }
    
    // Fix for "derivates fract artifacts" (lines between grid cells)
    // The fract() operation causes a discontinuity in UVs which leads to incorrect derivative calculations
    // and mipmap selection (selecting the lowest detail level), resulting in artifacts at grid edges.
    // Instead of using textureGrad (which requires GLSL 3.0 or extensions), we use a negative bias
    // to force the shader to use the highest detail mipmap level (LOD 0).
    vec4 gridColor = texture2D(gridTexture, scaledUV, -4.0);
    
    // Use grid texture as alpha mask
    // We use the red channel or alpha channel of the grid texture to determine visibility
    // Assuming ball2.png is white on transparent or black.
    float mask = gridColor.r; // Or gridColor.a if it has alpha
    
    // Apply mask to alpha - this cuts out the shape
    if (mask < 0.01) {
        discard;
    }
    gl_FragColor = vec4(finalColor, 1.0);
}
