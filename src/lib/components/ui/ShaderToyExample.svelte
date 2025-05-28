<script lang="ts">
import { onMount } from "svelte";

let initialized: boolean = false;

// Default shader - a simple color gradient with time animation
const fragmentShader: string = `
#define S(a,b,t) smoothstep(a,b,t)

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalize and center coordinates
    vec2 uv = fragCoord / iResolution.xy;
    float ratio = iResolution.x / iResolution.y;
    vec2 tuv = uv - 0.5;

    // Use a simple time-varying angle instead of noise-based rotation.
    float angle = radians(180.0 + sin(iTime)*30.0);
    float s = sin(angle);
    float c = cos(angle);
    
    // Rotate by inlining the matrix multiplication, adjusting for aspect ratio.
    tuv.y /= ratio;
    vec2 rotated;
    rotated.x = c * tuv.x - s * tuv.y;
    rotated.y = s * tuv.x + c * tuv.y;
    rotated.y *= ratio;
    
    // Simplify wave warp: use only one sine warp instead of two.
    float frequency = 5.0;
    float amplitude = 30.0;
    float speed = iTime * 2.0;
    rotated.x += sin(rotated.y * frequency + speed) / amplitude;
    
    // Precompute a constant rotation for the mix calculation (-5°) inline.
    float s_const = sin(radians(-5.0));
    float c_const = cos(radians(-5.0));
    // Apply the constant rotation to extract the x coordinate.
    float r = c_const * rotated.x - s_const * rotated.y;
    
    // Define color layers and mix them using smoothstep.
    vec3 layer1 = mix(vec3(0.957, 0.804, 0.623), vec3(0.192, 0.384, 0.933), S(-0.3, 0.2, r));
    vec3 layer2 = mix(vec3(0.910, 0.510, 0.8),   vec3(0.350, 0.71, 0.953),  S(-0.3, 0.2, r));
    vec3 finalComp = mix(layer1, layer2, S(0.5, -0.3, rotated.y));

    // Darken the final output by scaling down the brightness.
    finalComp *= 0.7;
    
    fragColor = vec4(finalComp, 1.0);
}

  `;

let canvas: HTMLCanvasElement;
let gl: WebGLRenderingContext | null;
let program: WebGLProgram | null;
let startTime: number | null = null;
let animationFrameId: number;

const vertexShader: string = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

const wrapShader = (shaderSource: string): string => `
    precision highp float;
    uniform vec3 iResolution;
    uniform float iTime;
    ${shaderSource}
    void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `;

function createShader(
	gl: WebGLRenderingContext,
	type: number,
	source: string,
): WebGLShader | null {
	const shader = gl.createShader(type);
	if (!shader) return null;

	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error("Shader compile error:", gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

function initWebGL(): boolean {
	gl = canvas.getContext("webgl");
	if (!gl) return false;

	const vertShader = createShader(gl, gl.VERTEX_SHADER, vertexShader);
	const fragShader = createShader(
		gl,
		gl.FRAGMENT_SHADER,
		wrapShader(fragmentShader),
	);

	if (!vertShader || !fragShader) return false;

	program = gl.createProgram();
	if (!program) return false;

	gl.attachShader(program, vertShader);
	gl.attachShader(program, fragShader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error("Program link error:", gl.getProgramInfoLog(program));
		return false;
	}

	// Create rectangle covering entire canvas
	const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

	const positionLocation = gl.getAttribLocation(program, "position");
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

	return true;
}

function render(timestamp: number): void {
	if (!gl || !program) return;

	if (!startTime) startTime = timestamp;
	const time = (timestamp - startTime) * 0.001; // Convert to seconds

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.useProgram(program);

	// Set uniforms
	const timeLocation = gl.getUniformLocation(program, "iTime");
	const resolutionLocation = gl.getUniformLocation(program, "iResolution");

	if (timeLocation) gl.uniform1f(timeLocation, time);
	if (resolutionLocation)
		gl.uniform3f(resolutionLocation, canvas.width, canvas.height, 1.0);

	// Draw
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

	animationFrameId = requestAnimationFrame(render);
}

onMount(() => {
	setTimeout(() => {
		if (initWebGL()) {
			animationFrameId = requestAnimationFrame(render);

			initialized = true;
		}

		return () => {
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
			if (gl && program) {
				gl.deleteProgram(program);
			}
		};
	}, 1000);
});
</script>

<canvas
	bind:this={canvas}
	class="absolute left-0 top-0 w-full h-full duration-2000 {initialized
		? 'opacity-100'
		: 'opacity-0'}"
></canvas>
