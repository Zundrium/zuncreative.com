<script lang="ts">
import MdiArrowUpRightThick from "~icons/mdi/arrow-up-right-thick";

import type { MarkdownTextfile } from "$lib/utils/types.js";
import * as m from "$lib/paraglide/messages.js";
import { formatDate } from "$lib/utils/formatDate";
import SeoHead from "$lib/utils/SeoHead.svelte";
import Paragraph from "$lib/components/typography/Paragraph.svelte";
import Section from "$lib/components/ui/Section.svelte";
import SectionHeading from "$lib/components/typography/SectionHeading.svelte";
import PageHeading from "$lib/components/ui/PageHeading.svelte";
import Button from "$lib/components/ui/Button.svelte";
import H1 from "$lib/components/typography/H1.svelte";
import Image from "$lib/components/ui/Image.svelte";
import { viewportSlideInBottom } from "$lib/utils/viewportSwitchClass.js";

let { data } = $props();

function capitalizeAndStripesToSpaces(str: string) {
	return str.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

import MdiArrowRight from "~icons/mdi/arrow-right";
import H3 from "$lib/components/typography/H3.svelte";
import { onMount } from "svelte";
import { scrollToTop } from "$lib/utils/lenis.js";

onMount(() => {
	scrollToTop();
});
</script>

<SeoHead
	props={{
		title: m.blog_title(),
		description: m.blog_description(),
		keywords: m.blog_keywords(),
		slug: "blog",
		thumbnail: "/images/placeholder1.jpg",
		type: "Blog",
	}}
/>

<Section
	id="post"
	class="flex flex-col gap-4 md:gap-6 lg:gap-8 xl:gap-12 justify-center pt-24"
	backgroundColor="bg-white dark:bg-black"
>
	<SectionHeading centered title="Recente <i>gedachten</i>" subtitle="Blog" />
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4 lg:gap-6 xl:gap-8">
		{#each data.posts as post}
		<div
			class="flex flex-col gap-4 md:gap-4 lg:gap-6 xl:gap-8 items-start"
		>
			<a href="/blog/{post.slug}" class="relative cursor-pointer w-full aspect-4/2 overflow-hidden rounded-xl" data-cursor-icon="fullscreen" use:viewportSlideInBottom> 
				<Image
					parallax
					alt="{post.title}"
					src="{post.header_image}"
					class="absolute inset-0 w-full h-full object-cover "
					sizes="(min-width:1920px) 1920px, (min-width:1280px) 1280px, (min-width:768px) 480px"
				/>
			</a>
			<div class="flex flex-col gap-2">
				<hgroup class="flex flex-col gap-1 md:gap-2">
					<H3>{post.title}</H3>
				</hgroup>
				<Paragraph class="flex-1">
					{post.description}
				</Paragraph>
			</div>
			<div class="w-full flex items-center justify-between gap-2">
				<Button
					style="line"
					href={`/blog/${post.slug}`}
					ariaLabel="Blogpost: {post.title}"
					iconRight={MdiArrowRight}>Lees meer</Button>
				<span class="text-black/80 dark:text-white/80">{formatDate(post.publish_date)}</span>
			</div>
		</div>
{/each}
	</div>
</Section>
