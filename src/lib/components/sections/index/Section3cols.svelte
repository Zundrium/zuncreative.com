<script lang="ts">
import Section from "$lib/components/ui/Section.svelte";
</script>

<Section
	id="3cols"
	class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 lg:gap-12 xl:gap-16"
	backgroundColor="bg-slate-50"
>
	<div class="bg-green-100"></div>
	<div class="bg-red-100"></div>
	<div class="bg-blue-100"></div>
</Section>
