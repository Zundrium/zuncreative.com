<script lang="ts">
let className = "";
export { className as class };

export let size: "sm" | "md" | "lg" | "xl" = "md";

const sizeStyles = {
	sm: "text-xs/4 lg:text-sm/5 2xl:text-base/6",
	md: "text-base/6 lg:text-lg/7",
	lg: "text-lg/7 lg:text-lg/8",
	xl: "text-lg/7 lg:text-xl/8 xl:text-2xl/9",
};
</script>

<p class="{sizeStyles[size]}  {className}">
    <slot />
</p>
