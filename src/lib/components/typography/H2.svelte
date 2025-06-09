<script lang="ts">
let className = "";
export { className as class };
</script>

<h2 class="text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-medium {className}">
    <slot />
</h2>
