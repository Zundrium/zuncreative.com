<script lang="ts">
let className = "";
export { className as class };
</script>

<h1 class="font-medium text-6xl lg:text-7xl xl:text-8xl {className}">
    <slot />
</h1>
