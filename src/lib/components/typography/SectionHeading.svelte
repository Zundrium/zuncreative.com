<script lang="ts">
//import { viewportActive } from "$lib/utils/viewportSwitchClass";
import H2 from "./H2.svelte";

let className = "";

export let centered: boolean = false;
export let title;
export let href: string | null = null;
export let subtitle;
export { className as class };
</script>

<hgroup
    class="relative flex flex-col gap-2 {className} {centered
        ? 'text-center'
        : ''}"
>
    <span class="uppercase text-sm text-slate-700 dark:text-slate-300"
        >{subtitle}</span
    >
    {#if href}
        <a {href}><H2>{title}</H2></a>
    {:else}
        <div>
            <H2 class="transition-transform duration-700">{@html title}</H2>
        </div>
    {/if}
</hgroup>
