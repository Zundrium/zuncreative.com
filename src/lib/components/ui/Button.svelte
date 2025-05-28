<script lang="ts">
export let href;
export let ariaLabel;
export let iconLeft: any = undefined;
export let iconRight: any = undefined;
export let style: "normal" | "text" | "line" | "secondary" = "normal";
export let size: "sm" | "md" | "lg" = "md";
let className = "";
export { className as class };

const classStyles = {
	normal:
		"font-medium bg-black dark:bg-white text-white dark:text-black hover:bg-slate-700 dark:hover:bg-slate-600",
	secondary:
		"font-medium bg-white dark:bg-black text-black dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700",
	text: "!px-0 text-black dark:text-white hover:text-slate-700 dark:hover:text-slate-300 hover:underline",
	line: "border border-white text-white {className} hover:border-gray-300 hover:text-slate-300 dark:hover:border-gray-400 dark:hover:text-slate-400",
};

const sizeStyles = {
	sm: "text-xs lg:text-sm 2xl:text-base gap-1 lg:gap-1 2xl:gap-2 px-3 py-2",
	md: "text-sm lg:text-base 2xl:text-lg gap-1 lg:gap-2 2xl:gap-3 px-6 py-3",
	lg: "",
};
</script>

<a
	{href}
	class="cursor-pointer text-center flex items-center justify-center rounded-full transition-colors duration-400 {sizeStyles[
		size
	]} {classStyles[style]} {className}"
	aria-label={ariaLabel}
>
	{#if iconLeft}
		<svelte:component this={iconLeft} />
	{/if}
	<slot />
	{#if iconRight}
		<svelte:component this={iconRight} />
	{/if}
</a>
