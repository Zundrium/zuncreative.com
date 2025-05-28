<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    let renderCanvas: HTMLCanvasElement;
    let initialized: boolean = false;

    let babylonGraphics: any | null = null;

    onMount(async () => {
        const ExampleEmptyScene = (await import("./ExampleEmptyScene"))
            .ExampleEmptyScene;
        babylonGraphics = new ExampleEmptyScene();
        await babylonGraphics.initialize(renderCanvas);
        initialized = true;
    });

    onDestroy(() => {
        babylonGraphics?.dispose();
    });
</script>

<canvas
    bind:this={renderCanvas}
    class="pointer-events-none w-full h-full opacity-0 transition-opacity duration-2000 {initialized
        ? 'opacity-100'
        : ''}"
></canvas>
