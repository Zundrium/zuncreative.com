<script lang="ts">
import MdiArrowUpRightThick from "~icons/mdi/arrow-up-right-thick";
import H3 from "$lib/components/typography/H3.svelte";
import Paragraph from "$lib/components/typography/Paragraph.svelte";
import SectionHeading from "$lib/components/typography/SectionHeading.svelte";
import Button from "$lib/components/ui/Button.svelte";
import Image from "$lib/components/ui/Image.svelte";
import Section from "$lib/components/ui/Section.svelte";
import { showcaseItemTags } from "$lib/utils/types/showcaseItem";
import type { MarkdownTextfile } from "$lib/utils/types";
import { viewportFade, viewportSlideInBottom } from "$lib/utils/viewportSwitchClass";
import { onMount } from "svelte";

export let showcaseItems: MarkdownTextfile[] = [];
let filteredShowcaseItems: MarkdownTextfile[] = [];

let activeTag: string | null = null;

// Memoized tag processing - only run once on mount
onMount(() => {
	filteredShowcaseItems = showcaseItems;
});

// Optimized filtering function
function filterItems(tag: string | null): void {
	if (!tag) {
		filteredShowcaseItems = showcaseItems;
		return;
	}

	const lowerTag = tag.toLowerCase();
	filteredShowcaseItems = showcaseItems.filter((item: MarkdownTextfile) =>
		item.keywords.includes(lowerTag),
	);
}

// Optimized tag setter with batched updates
function setActiveTag(tag: string | null): void {
	if (activeTag === tag) return; // Prevent unnecessary updates

	activeTag = tag;
	filterItems(tag);
}

// Pre-compute button handlers to avoid recreation
const tagHandlers = showcaseItemTags.reduce(
	(acc, tag) => {
		acc[tag] = () => setActiveTag(tag);
		return acc;
	},
	{} as Record<string, () => void>,
);

const showAllHandler = () => setActiveTag(null);

// Memoized class computation
function getItemClasses(item: MarkdownTextfile): string {
	const baseClasses = "flex flex-col cursor-pointer overflow-hidden relative";

	if (item.featured) {
		return `${baseClasses} row-span-2 col-span-2`;
	}
	if (item.mobile) {
		return `${baseClasses} row-span-2`;
	}
	return `${baseClasses} col-span-2`;
}
</script>

<Section
	id="showcase"
	class="flex flex-col gap-4 md:gap-6 lg:gap-12 justify-center"
>
	<SectionHeading centered title="Mijn <i>werk</i>" subtitle="Showcase" />

	<div class="flex gap-2 items-center w-full justify-center">	
		{#each showcaseItemTags as tag (tag)}
			<Button
				style="text"
				size="sm"
				ariaLabel="Showcase items tagged with {tag}"
				click={tagHandlers[tag]}
			>
				{tag}
			</Button>
		{/each}
		<Button
			style="text"
			size="sm"
			ariaLabel="Show all showcase items"
			click={showAllHandler}
		>
			All
		</Button>
	</div>

	<div
		class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 auto-rows-[12rem] md:auto-rows-[14rem] lg:auto-rows-[20rem] gap-4 grid-flow-row-dense"
	>
		{#each filteredShowcaseItems as showcaseItem (showcaseItem.slug)}		
			<a	
				href="/showcase/{showcaseItem.slug}"
				class={getItemClasses(showcaseItem)}
				data-cursor-icon="fullscreen"
				use:viewportFade
			>  
				<div class="absolute inset-0 bg-gradient-to-t from-white dark:from-black to-transparent opacity-20 dark:opacity-50 z-1"></div>
				<Image 
					parallax 
					src={showcaseItem.header_image} 
					alt={showcaseItem.title} 
					class="w-full h-full transition-transform hover:scale-200 duration-300"
					loading="lazy"
				/>
				<span class="absolute rounded-tr-4xl bg-white dark:bg-black text-black dark:text-white font-medium px-8 py-4 left-0 bottom-0 z-10">{showcaseItem.title}</span>
			</a>
		{/each}
	</div>
</Section>
