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

<PageHeading>
	<H1>{m.blog_title()}</H1>
	<Paragraph size="xl">
		{m.blog_description()}
	</Paragraph>
</PageHeading>
<Section
	id="blog"
	backgroundColor="bg-white dark:bg-slate-900"
	class="flex flex-col items-stretch justify-stretch gap-8 lg:gap-12 xl:gap-16 !lg:py-0 !px-0 !py-0"
>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-12 xl:gap-16">
		{#each data.posts as post}
			<div
				class="w-full flex flex-col gap-4 lg:gap-8 items-start"
				use:viewportSlideInBottom
			>
				{#if post.header_image}
					<a
						class="w-full block relative overflow-hidden"
						href="/blog/{post.slug}"
					>
						<Image
							thumb
							class="w-full transition-transform translate-z-0 scale-100 hover:scale-110 duration-400 ease-in-out"
							src={post.header_image}
							alt={post.title}
						/>
					</a>
				{/if}
				<div
					class="px-4 lg:px-0 flex flex-col items-start gap-4 lg:gap-8"
				>
					<SectionHeading
						title={post.title}
						href="/blog/{post.slug}"
						subtitle={formatDate(post.publish_date)}
					/>
					<Paragraph>{post.description}</Paragraph>
					<Button
						ariaLabel="Lees meer over {capitalizeAndStripesToSpaces(
							post.slug,
						)}"
						href="/blog/{post.slug}"
						iconRight={MdiArrowUpRightThick}
					>
						Lees meer over {capitalizeAndStripesToSpaces(post.slug)}
					</Button>
				</div>
			</div>
		{/each}
	</div>
</Section>
