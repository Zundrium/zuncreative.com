<script lang="ts">
import MdiArrowUpRightThick from "~icons/mdi/arrow-up-right-thick";
import H3 from "$lib/components/typography/H3.svelte";
import Paragraph from "$lib/components/typography/Paragraph.svelte";
import SectionHeading from "$lib/components/typography/SectionHeading.svelte";
import Button from "$lib/components/ui/Button.svelte";
import Image from "$lib/components/ui/Image.svelte";
import Section from "$lib/components/ui/Section.svelte";
import {
	viewportFade,
	viewportSlideInBottom,
} from "$lib/utils/viewportSwitchClass";
import { showcaseItemTags } from "$lib/utils/types/showcaseItem";
import type { MarkdownTextfile } from "$lib/utils/types";

export let showcaseItems: MarkdownTextfile[] = [];

let activeTag: string | null = null;

function setActiveTag(tag: string | null) {
	console.log("Setting active tag:", tag);
	if (tag) {
		activeTag = tag.toLowerCase();
	} else {
		activeTag = null;
	}
}

for (const item of showcaseItems) {
	item.keywords = item.keywords.toLowerCase().replace(" ", "");
}

$: filteredShowcaseItems = activeTag
	? showcaseItems.filter((item) =>
			item.keywords!.split(",").includes(activeTag!),
		)
	: showcaseItems;
</script>

<Section
	id="blog-items"
	class="flex flex-col gap-4 md:gap-8 lg:gap-12 justify-center"
	backgroundColor="bg-white dark:bg-black"
>
	<SectionHeading centered title="My <i>work</i>" subtitle="Showcase" />
	<div class="flex gap-6 items-center w-full justify-center">	
		{#each showcaseItemTags as tag}
			<Button
				style="text"
				size="sm"
				ariaLabel="Showcase items tagged with {tag}"
				click={() => {setActiveTag(tag)}}
			>
				{tag}
			</Button>
		{/each}
		<Button
			style="text"
			size="sm"
			ariaLabel="Show all showcase items"
			click={() => {setActiveTag(null)}}
		>
			All
		</Button>
	</div>
	<div
		class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 auto-rows-[20rem] gap-4 md:gap-6 lg:gap-8 xl:gap-12 grid-flow-row-dense"
	>
{#each filteredShowcaseItems as showcaseItem}		
			<a	
				href={`/showcase/${showcaseItem.slug}`}
				use:viewportSlideInBottom class="flex flex-col {showcaseItem.featured ? 'row-span-2 col-span-2' : ''} {showcaseItem.mobile ? 'row-span-2' : 'col-span-2'} cursor-pointer gap-2 " data-cursor-icon="fullscreen">  
				<div class="overflow-hidden object-cover flex-1 relative rounded-xl">
					<Image src={showcaseItem.header_image} alt={showcaseItem.title} class="w-full h-full transition-all duration-500 opacity-50 saturate-20 hover:saturate-100 hover:opacity-100" />
					<div class="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50 pointer-events-none"></div>
				</div>
				<span class="font-medium">{showcaseItem.title}</span>
			</a>
		{/each}
	</div>
</Section>
