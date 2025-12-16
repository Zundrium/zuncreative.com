
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

// Fog uniforms
uniform float time;
uniform float waveFrequency;
uniform float waveIntensity;
uniform float zFogStartMin;
uniform float zFogStartMax;
uniform float zFogEndMin;
uniform float zFogEndMax;

// Rim uniforms
uniform vec3 cameraPosition;
uniform float rimPower;
uniform float rimIntensity;

// Grid uniforms
uniform sampler2D gridTexture;
uniform float gridResolution;

void main(void) {

    // Calculate color based on height with smooth transition
    float currentMaxY = maxY;
    if (currentMaxY <= 0.0) currentMaxY = 0.0001;
    
    float t = (vDisplacement - minY) / (currentMaxY - minY);
    t = clamp(t, 0.0, 1.0);
    // Use smoothstep for non-linear interpolation
    t = smoothstep(0.0, 1.0, t);
    
    vec3 baseColor = mix(bottomColor, topColor, t);

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
    vec3 finalColor = finalColorWithRim * (1.0 - totalFogFactor);

    // Apply repeating grid texture
    // Create tiled UVs based on subdivision count (gridResolution)
    // Add 0.5 offset to align texture center with vertices
    // We remove fract() to avoid mipmap artifacts at the seams; sampler should be set to REPEAT
    vec2 gridUV = vUV * gridResolution + 0.5;
    vec4 gridColor = texture2D(gridTexture, gridUV);
    
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
