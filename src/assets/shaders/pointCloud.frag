
#ifdef GL_ES
precision highp float;
#endif

#if !defined(GL_ES) || defined(GL_FRAGMENT_PRECISION_HIGH)
precision highp float;
#else
precision mediump float;
#endif

varying vec3 vColor;
varying vec3 vWorldPos;

uniform float time;
uniform float waveFrequency;
uniform float waveIntensity;
uniform float zFogStartMin;
uniform float zFogStartMax;
uniform float zFogEndMin;
uniform float zFogEndMax;

void main(void) {
	vec3 colorWithWave = vColor + vec3((sin((vWorldPos.x + vWorldPos.z) * waveFrequency + time) * 0.5 + 0.5) * waveIntensity);

	float frontFog = (zFogStartMax - vWorldPos.z) / (zFogStartMax - zFogStartMin);
	frontFog = clamp(frontFog, 0.0, 1.0);

	float backFog = (zFogEndMin - vWorldPos.z) / (zFogEndMin - zFogEndMax);
	backFog = clamp(backFog, 0.0, 1.0);

	float totalFogFactor = max(frontFog, backFog);

	float alpha = 1.0 - totalFogFactor;

	gl_FragColor = vec4(colorWithWave * alpha, alpha);
}
