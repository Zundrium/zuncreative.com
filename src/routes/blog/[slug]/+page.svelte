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
import { onMount } from "svelte";
import { scrollToTop } from "$lib/utils/lenis.js";
let { data } = $props();
const { post, posts } = $derived(data);
import "/node_modules/highlight.js/styles/base16/default-dark.min.css"
import { viewportSlideInBottom } from "$lib/utils/viewportSwitchClass.js";


onMount(() => {
	scrollToTop();
});

$effect(() => {
	if (data.post) {
		scrollToTop();
	}
});
</script>

<SeoHead
	props={{
		title: `${post.title} | Zun Creative`,
		description: post.description,
		keywords: post.keywords.join(", "),
		slug: post.slug,
		thumbnail: `${post.header_image}`,
		type: "Article",
		datePublished: formatDateToISO8601(post.publish_date),
		dateModified: formatDateToISO8601(post.modify_date),
	}}
/>

{#key post}
<section
	id="hero"
	style="clip-path: inset(0 0 0 0); backface-visibility: hidden;"
	class="relative px-6 w-full bg-slate-500 flex flex-col gap-8 items-center justify-end pt-24 lg:pt-16 xl:pt-20 pb-32 pt-32 h-svh"
>
	{#if post.header_image}
		<Image
			src={post.header_image}
			alt={post.title}
			class="absolute top-0 left-0 right-0 bottom-0 w-full z-0 h-full object-cover fixed"
		/>
	{/if}

	<div
		class="absolute top-0 left-0 right-0 bottom-0 bg-black/40 w-full h-full z-10"
	></div>

	<div class="container relative z-20">
		<div class="w-full md:w-2/3">
		<hgroup class="flex flex-col gap-2 lg:gap-4 text-white w-full">
			<H1>{post.title}</H1>
			<Paragraph size="xl" class="opacity-80">
				{post.description}
			</Paragraph>
			{#if post.modify_date}
				<div
					class="flex flex-col lg:flex-row gap-2 lg:gap-6 lg:items-center opacity-60"
				>
					<i>Geschreven door Sem Verbraak</i>
					<span class="hidden lg:inline">|</span>
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
{/key}

<Section
	id="article"
	class="flex flex-col gap-4 md:gap-8 lg:gap-12 xl:gap-16 items-center"
>
	{#key post}
	<article class="prose lg:prose-xl dark:prose-invert prose-strong:font-extralight">
		{@html post.html}
	</article>
	{/key}
</Section>

<Section 
id="recent-posts"
	class="flex flex-col gap-4 md:gap-8 lg:gap-12 xl:gap-16 justify-center"
>
		<H3>Recente blogposts</H3>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-8 flex">
			{#each posts as relatedPost}
				{#if post.slug !== relatedPost.slug}
					<div
			class="flex flex-col gap-4 md:gap-4 lg:gap-6 xl:gap-8 items-start"
		>
			<a href="/blog/{relatedPost.slug}" class="relative cursor-pointer w-full aspect-4/2 overflow-hidden rounded-xl" data-cursor-icon="fullscreen" use:viewportSlideInBottom> 
				<Image
					parallax
					alt={relatedPost.title}
					src={relatedPost.header_image}
					class="absolute inset-0 w-full h-full object-cover "
					sizes="(min-width:1920px) 1920px, (min-width:1280px) 1280px, (min-width:768px) 480px"
				/>
			</a>
			<div class="flex flex-col gap-2">
				<hgroup class="flex flex-col gap-1 md:gap-2">
					<H3>{relatedPost.title}</H3>
				</hgroup>
				<Paragraph class="flex-1">
					{relatedPost.description}
				</Paragraph>
			</div>
			<div class="w-full flex items-center justify-between gap-2">
				<Button
					style="line"
					href={`/blog/${relatedPost.slug}`}
					ariaLabel="Blogpost: {relatedPost.title}"
					iconRight={MdiArrowRight}>Lees meer</Button>
				<span class="text-black/80 dark:text-white/80">{formatDate(relatedPost.publish_date)}</span>
			</div>
		</div>
				{/if}
			{/each}
		</div>
</Section>

