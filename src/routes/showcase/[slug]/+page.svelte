<script lang="ts">
import MaterialSymbolsLightClose from '~icons/material-symbols-light/close';
import SeoHead from "$lib/utils/SeoHead.svelte";
import Showcase from "$lib/components/sections/index/Showcase.svelte";
import * as m from "$lib/paraglide/messages.js";
import Section from "$lib/components/ui/Section.svelte";
import { scrollToTop } from "$lib/utils/lenis.js";
import H1 from "$lib/components/typography/H1.svelte";
import MaterialSymbolsOpenInNew from "~icons/material-symbols/open-in-new";
import Button from "$lib/components/ui/Button.svelte";
import Image from "$lib/components/ui/Image.svelte";
import { getBrandByName, type Brand } from "$lib/utils/brands";

let { data } = $props();

let partnerBrand: Brand | undefined = $state(undefined);

const { item, showcaseItems } = $derived(data);

$effect(() => {
	if (item.title) {
		scrollToTop();
		if(item.partner_brand) {
			partnerBrand = getBrandByName(item.partner_brand);
		} else {
			partnerBrand = undefined;
		}
	}
});
</script>

<SeoHead
	props={{
		title: m.blog_title(),
		description: m.blog_description(),
		keywords: m.blog_keywords(),
		slug: "blog",
		thumbnail: "/images/2d_matrix.png",
		type: "Blog",
	}}
/>

{#key item}
	<Section 
		id="showcase-item"
		class="bg-white dark:bg-black text-black dark:text-white pt-12 flex flex-col gap-4 lg:gap-8 xl:gap-12"

	>
	{#if partnerBrand}
	<div class="w-full flex items-center justify-center gap-6">
		<object class="size-14" data="/svg/logo-white.svg" type="image/svg+xml" title="Zun Creative Logo"></object>
		<MaterialSymbolsLightClose class="size-14"/>
		<object class="{partnerBrand.height} invert" data="{partnerBrand.url}" type="image/svg+xml" title="Zun Creative Logo"></object>
	</div>
	{/if}
		<H1 class="text-center">{item.title}</H1>

		<div class="flex justify-between">
			<div class="flex gap-4 lg:gap-8 justify-center items-center">
				<span class="font-medium">Categories:</span>
				{#each item.keywords as keyword}
					<Button
						style="line"
						ariaLabel="Keyword {keyword}"
						href={`/#showcase`}>
						{keyword.toUpperCase()}
					</Button>
				{/each}
			</div>

			{#if item.external_url}
				<Button
					style="line"
					ariaLabel="Go to {item.external_url}"
					href={item.external_url}
					target="_blank"
					iconRight={MaterialSymbolsOpenInNew}>
					Open in new tab
				</Button>
			{/if}
		</div>
		{#if item.video!.includes("_mobile")}
			<div class="flex items-start rounded-xl flex gap-4 lg:gap-8 xl:gap-12 w-full">
				<video
					class="rounded-xl object-cover overflow-hidden w-1/3"
					autoplay
					loop
					muted
					preload="none"
					playsinline>
					<source src="{item.video}" type="video/mp4">
					Your browser does not support the video tag.
				</video>
				<article class="prose lg:prose-xl dark:prose-invert w-2/3 max-w-full!">
					<item.component />
				</article>


			</div>
		{:else}
			<article class="w-full max-w-full! prose lg:prose-xl dark:prose-invert text-center">
				<item.component />
			</article>
			<div class="flex items-center justify-center rounded-xl">
				<video
					class="rounded-xl w-full h-full bg-gray-100 dark:bg-gray-900"
					autoplay
					loop
					muted
					preload="none"
					playsinline>
					<source src="{item.video}" type="video/mp4">
					Your browser does not support the video tag.
				</video>
			</div>

		{/if}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each item.gallery! as galleryImage}
				<Image
					parallax
					src={galleryImage}
					alt={item.title}
					class="rounded-xl object-cover w-full h-full overflow-hidden"
					sizes="(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, (min-width: 768px) 480px"
				/>
			{/each}
		</div>
	</Section>
{/key}

<Showcase showcaseItems={showcaseItems} />
