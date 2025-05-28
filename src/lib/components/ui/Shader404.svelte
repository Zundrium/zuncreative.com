<script lang="ts">
    import { onMount } from "svelte";

    let initialized: boolean = false;

    // Default shader - a simple color gradient with time animation
    const fragmentShader: string = `
#define S(a,b,t) smoothstep(a,b,t)

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord / iResolution.xy;
    float ratio = iResolution.x / iResolution.y;
    vec2 tuv = uv - 0.5;
    float angle = radians(90.0 + sin(iTime)*20.0);
    float s = sin(angle);
    float c = cos(angle);
    tuv.y /= ratio;
    vec2 rotated;
    rotated.x = c * tuv.x - s * tuv.y;
    rotated.y = s * tuv.x + c * tuv.y;
    rotated.y *= ratio;
    float frequency = 5.0;
    float amplitude = 25.0;
    float speed = iTime * 2.0;
    rotated.x += sin(rotated.y * frequency + speed) / amplitude;
    float s_const = sin(radians(-5.0));
    float c_const = cos(radians(-5.0));
    float r = c_const * rotated.x - s_const * rotated.y;
    vec3 layer1 = mix(vec3(1, 1, 1), vec3(0, 0, 0), S(-0.5, 0.2, r));
    fragColor = vec4(layer1, 1.0);
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
        const resolutionLocation = gl.getUniformLocation(
            program,
            "iResolution",
        );

        if (timeLocation) gl.uniform1f(timeLocation, time);
        if (resolutionLocation)
            gl.uniform3f(resolutionLocation, canvas.width, canvas.height, 1.0);

        // Draw
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        animationFrameId = requestAnimationFrame(render);
    }

    onMount(() => {
        if (initWebGL()) {
            animationFrameId = requestAnimationFrame(render);
        }

        initialized = true;

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            if (gl && program) {
                gl.deleteProgram(program);
            }
        };
    });
</script>

<canvas
    bind:this={canvas}
    class="absolute left-0 top-0 w-full h-full duration-2000 {initialized
        ? 'opacity-50'
        : 'opacity-0'}"
></canvas>
