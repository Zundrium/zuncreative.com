
<script lang="ts">
export let icon;
export let style: "normal" | "inverted" = "normal";
export let size: "sm" | "md" | "lg" = "md";

let className = "";
export { className as class };

const sizeStyles: Record<"sm" | "md" | "lg", string> = {
	sm: "size-6 p-1 lg:size-12 p-2",
	md: "size-12 p-2 lg:size-16 p-3",
	lg: "size-16 p-3 lg:size-20 p-4",
};

$: computedClasses = `
    ${sizeStyles[size]}
    rounded-full overflow-visible flex-none
    ${
			style === "normal"
				? "bg-black dark:bg-white text-white dark:text-black"
				: "bg-white dark:bg-black text-black dark:text-white"
		}
    ${className}
  `
	.trim()
	.replace(/\s+/g, " ");
</script>

<svelte:component this={icon} class={computedClasses} />

