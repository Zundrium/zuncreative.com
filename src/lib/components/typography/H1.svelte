<script lang="ts">
let className = "";
export { className as class };
</script>

<h1 class="font-medium text-6xl lg:text-8xl xl:text-9xl {className}">
    <slot />
</h1>
