<script lang="ts">
let classes = "";
export { classes as class };
export let backgroundColor = "transparent";
export let containerClasses = "";
export let id;

export let element: HTMLElement | null = null;
</script>

<section
	{id}
	bind:this={element}
	class="relative text-black dark:text-white py-16 lg:py-16 xl:py-24 min-h-svh w-full flex justify-center scroll-mt-[var(--navbar-scroll-margin)] {backgroundColor} {containerClasses}"
>
	<div class="px-4 container flex-1 {classes}">
		<slot />
	</div>
</section>
