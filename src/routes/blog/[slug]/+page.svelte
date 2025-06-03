<script lang="ts">
import MdiArrowRight from "~icons/mdi/arrow-right";
import { formatDate, formatDateToISO8601 } from "$lib/utils/formatDate.js";
import SeoHead from "$lib/utils/SeoHead.svelte";
import * as m from "$lib/paraglide/messages.js";
import Paragraph from "$lib/components/typography/Paragraph.svelte";
import H1 from "$lib/components/typography/H1.svelte";
import H3 from "$lib/components/typography/H3.svelte";
import Section from "$lib/components/ui/Section.svelte";
import ScrollIndicator from "$lib/components/ui/ScrollIndicator.svelte";
import Button from "$lib/components/ui/Button.svelte";
import Image from "$lib/components/ui/Image.svelte";
let { data } = $props();
let post = data.post;
let posts = data.posts;

function capitalizeAndStripesToSpaces(str: string) {
	return str.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}
</script>

<SeoHead
	props={{
		title: post.title,
		description: post.description,
		keywords: post.keywords.join(", "),
		slug: post.slug,
		thumbnail: `${post.header_image}`,
		type: "BlogPosting",
		datePublished: formatDateToISO8601(post.publish_date),
		dateModified: formatDateToISO8601(post.modify_date),
	}}
/>

<section
	id="hero"
	style="clip-path: inset(0 0 0 0); backface-visibility: hidden;"
	class="relative px-4 h-svh w-full bg-slate-500 flex flex-col gap-8 items-center justify-end pt-24 lg:pt-16 xl:pt-20 pb-32 pt-32"
>
	{#if post.header_image}
		<Image
			parallax
			src={post.header_image}
			alt={post.title}
			class="absolute top-0 left-0 right-0 bottom-0 w-full z-0 h-full object-cover fixed"
		/>
	{/if}

	<div
		class="absolute top-0 left-0 right-0 bottom-0 bg-black/50 w-full h-full z-10"
	></div>

	<div class="container relative z-20">
		<div class="w-1/2">
		<hgroup class="flex flex-col gap-2 lg:gap-4 text-white w-full">
			<H1>{post.title}</H1>
			<Paragraph size="xl" class="opacity-80">
				{post.description}
			</Paragraph>
			{#if post.modify_date}
				<div
					class="flex flex-col lg:flex-row gap-2 lg:gap-6 lg:items-center opacity-60"
				>
					<span
						><i>{m.lastModifiedOn()}</i>
						<i>{formatDate(post.modify_date)}</i>
					</span>
					<span class="hidden lg:inline">|</span>
					<i>{m.publishedOn()} {formatDate(post.publish_date)}</i>
				</div>
			{/if}
		</hgroup>
			</div>
	</div>

	<!-- scroll button -->
	<ScrollIndicator />
</section>

<Section
	id="blogArticle"
	class="flex flex-col lg:flex-row gap-4 md:gap-8 lg:gap-12 xl:gap-16 justify-center"
>
	<article class="w-full prose lg:prose-xl dark:prose-invert">
		<post.component />
	</article>

	<div class="w-full flex flex-col lg:w-1/5 lg:gap-8">
		<H3>Recente blogposts</H3>
		<div class="gap-4 xl:gap-8 flex flex-col">
			{#each posts as relatedPost}
				{#if post.slug !== relatedPost.slug}
					<div class="w-full flex flex-col items-start gap-2">
						<Image
							thumb
							src={relatedPost.header_image}
							alt={relatedPost.title}
							class="cursor-pointer opacity-70 hover:opacity-100 duration-300"
						/>
						<span
							class="mb-1 text-xs text-slate-700 dark:text-slate-400"
							>{formatDate(post.publish_date)}</span
						>
						<a class="font-bold" href="/blog/{relatedPost.slug}"
							>{relatedPost.title}</a
						>
						<Paragraph size="sm">
							{relatedPost.description}
						</Paragraph>
						<Button
							style="text"
							size="sm"
ariaLabel="Lees meer over {capitalizeAndStripesToSpaces(
								relatedPost.slug,
							)}"

							href="/blog/{relatedPost.slug}"
							iconRight={MdiArrowRight}
						>
							Lees meer
						</Button>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</Section>
