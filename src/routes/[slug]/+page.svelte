<script lang="ts">
import { formatDate, formatDateToISO8601 } from "$lib/utils/formatDate.js";
import SeoHead from "$lib/utils/SeoHead.svelte";
import * as m from "$lib/paraglide/messages.js";
import H1 from "$lib/components/typography/H1.svelte";
import Paragraph from "$lib/components/typography/Paragraph.svelte";
import PageHeading from "$lib/components/ui/PageHeading.svelte";
import Image from "$lib/components/ui/Image.svelte";
import { onMount } from "svelte";
import { scrollToTop } from "$lib/utils/lenis.js";

let { data } = $props();
onMount(() => {
	scrollToTop();
});
</script>

<SeoHead
	props={{
		title: `${data.title} | Zun Creative`,
		description: data.description,
		keywords: data.keywords.join(", "),
		slug: data.slug,
		thumbnail: `/images/2d_matrix.png`,
		type: "BlogPosting",
		datePublished: formatDateToISO8601(data.publish_date),
		dateModified: formatDateToISO8601(data.modify_date),
	}}
/>

<PageHeading>
	<div class="w-full flex flex-col">
		<hgroup class="flex flex-col gap-4 lg:gap-8 xl:gap-12 justify-center">
			<H1>{data.title}</H1>
			<Paragraph size="xl">
				{data.description}
			</Paragraph>
			{#if data.modify_date}
				<div
					class="flex flex-col lg:flex-row gap-2 lg:gap-6 lg:items-center pb-12"
				>
					<span
						><i>{m.lastModifiedOn()}</i>
						<i>{formatDate(data.modify_date)}</i>
					</span>
					<span class="hidden lg:inline">|</span>
					<i>{m.publishedOn()} {formatDate(data.publish_date)}</i>
				</div>
			{/if}
		</hgroup>
		{#if data.header_image}
			<Image src={data.header_image} alt={data.title} />
		{/if}
	</div>
</PageHeading>

<article class="py-12 px-6 prose lg:prose-xl dark:prose-invert mx-auto prose-strong:font-extralight max-w-full md:max-w-prose prose-pre:overflow-x-auto">
	{@html data.html}
</article>
