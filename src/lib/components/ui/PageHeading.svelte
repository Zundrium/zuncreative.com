<script lang="ts">
    import NavbarFiller from "./NavbarFiller.svelte";

    let className = "";

    export let centered: boolean = false;
    export { className as class };
</script>

<section
    class="w-full flex flex-col items-center bg-gray-700 dark:bg-gray-800 py-8 lg:py-24 text-white"
>
    <NavbarFiller />
    <div class="container px-4">
        <hgroup
            class="flex flex-col gap-4 xl:gap-6 {className} {centered
                ? 'text-center'
                : ''}"
        >
            <slot />
        </hgroup>
    </div>
</section>
