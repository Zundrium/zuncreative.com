<script lang="ts">
let className = "";
export { className as class };
</script>

<h2 class="text-2xl md:text-3xl lg:text-5xl xl:text-7xl font-medium mb-4 tracking-tight {className}">
    <slot />
</h2>
