<script lang="ts">
let className = "";
export { className as class };
</script>

<h1 class="font-medium text-5xl/14 lg:text-6xl/16 xl:text-7xl/18 {className}">
    <slot />
</h1>
