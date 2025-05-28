<script lang="ts">
    import { viewportActive } from "$lib/utils/viewportSwitchClass";
    import H2 from "../H2.svelte";

    let className = "";
    export { className as class };
</script>

<div use:viewportActive class="overflow-hidden">
    <H2 class="uppercase transition-transform duration-700 {className}">
        <slot />
    </H2>
</div>

<style lang="postcss">
    @reference "tailwindcss";

    :global(.active h2) {
        @apply translate-y-0;
    }
    :global(.inactive h2) {
        @apply translate-y-full;
    }
</style>
