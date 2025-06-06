<script lang="ts">
import MaterialSymbolsLightClose from "~icons/material-symbols-light/close";
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
		if (item.partner_brand) {
			partnerBrand = getBrandByName(item.partner_brand);
		} else {
			partnerBrand = undefined;
		}
	}
});
</script>

<SeoHead
	props={{
		title: `${item.title} | Zun Creative `,
		description: item.description,
		keywords: item.keywords.join(", "),
		slug: item.slug,
		thumbnail: item.header_image,
		type: "WebPage",
	}}
/>

{#key item}
	<Section 
		id="showcase-item"
		class="bg-white dark:bg-black text-black dark:text-white pt-12 flex flex-col gap-4"

	>
	{#if partnerBrand}
	<div class="w-full flex items-center justify-center gap-6 pb-4">
		<object class="size-14" data="/svg/logo-white.svg" type="image/svg+xml" title="Zun Creative Logo"></object>
		<MaterialSymbolsLightClose class="size-14"/>
		<object class="{partnerBrand.height} invert" data="{partnerBrand.url}" type="image/svg+xml" title="Zun Creative Logo"></object>
	</div>
	{/if}
		<div class="flex flex-col gap-4 lg:gap-8 xl:gap-12 ">
		<H1 class="text-center"><i>{item.title}</i></H1>

		<div class="flex justify-between flex-row gap-4">
			<div class="flex gap-4 lg:gap-8 justify-center items-center">
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
					<span class="hidden md:inline">Open</span>
				</Button>
			{/if}
		</div>
		{#if item.video!.includes("_mobile")}
			<div class="flex flex-col md:flex-row items-start rounded-xl flex gap-4 lg:gap-8 xl:gap-12 w-full">
				<video
					class="rounded-xl object-cover overflow-hidden w-full md:w-1/3"
					autoplay
					loop
					controls
					muted
					preload="none"
					playsinline>
					<source src="{item.video}" type="video/mp4">
					Your browser does not support the video tag.
				</video>
				<article class="prose lg:prose-xl dark:prose-invert w-full md:w-2/3 max-w-full! prose-strong:font-extralight">
					{@html item.html}
				</article>


			</div>
		{:else}
			<article class="w-full max-w-full! prose lg:prose-xl dark:prose-invert text-center prose-strong:font-extralight">
				{@html item.html}
			</article>
			<div class="flex items-center justify-center rounded-xl">
				<video
					class="rounded-xl w-full h-full bg-gray-100 dark:bg-gray-900"
					autoplay
					loop
					muted
					controls
					preload="none"
					playsinline>
					<source src="{item.video}" type="video/mp4">
					Your browser does not support the video tag.
				</video>
			</div>
		{/if}

		</div>
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
