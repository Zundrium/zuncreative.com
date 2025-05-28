<script lang="ts">
import MdiArrowRight from "~icons/mdi/arrow-right";
import H3 from "$lib/components/typography/H3.svelte";
import Paragraph from "$lib/components/typography/Paragraph.svelte";
import SectionHeading from "$lib/components/typography/SectionHeading.svelte";
import Button from "$lib/components/ui/Button.svelte";
import Image from "$lib/components/ui/Image.svelte";
import Section from "$lib/components/ui/Section.svelte";
import { viewportSlideInBottom } from "$lib/utils/viewportSwitchClass";

export let posts: any = [];
</script>

<Section
	id="post"
	class="flex flex-col gap-4 md:gap-8 lg:gap-12 justify-center"
	backgroundColor="bg-white dark:bg-black"
>
	<SectionHeading centered title="Recent <i>thoughts</i>" subtitle="Blog" />
	<div
		class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 lg:gap-12 xl:gap-16"
	>
		{#each posts as post}
			<div
				class="flex flex-col gap-2 md:gap-2 lg:gap-4 items-start"
				use:viewportSlideInBottom
			>
				<div class="relative w-full h-40 overflow-hidden"> 
					<Image
						alt="{post.title}"
						src="{post.header_image}"
						class="absolute inset-0 w-full h-full object-cover rounded-xl"
						sizes="(min-width:1920px) 1920px, (min-width:1280px) 1280px, (min-width:768px) 480px"
					/>
				</div>
				<hgroup class="flex flex-col gap-1 md:gap-2">
					<H3>{post.title}</H3>
					<span
						class="uppercase text-sm text-slate-700 dark:text-slate-300"
					>{post.subTitle}</span
					>
				</hgroup>
				<Paragraph class="flex-1">
					{post.description}
				</Paragraph>
				<Button
					style="text"
					href={`/blog/${post.slug}`}
					ariaLabel="Blogpost: {post.title}"
					iconRight={MdiArrowRight}>Read more</Button
				>
			</div>
		{/each}
	</div>
</Section>
