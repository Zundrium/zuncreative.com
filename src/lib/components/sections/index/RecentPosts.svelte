<script lang="ts">
import MdiArrowRight from "~icons/mdi/arrow-right";
import H3 from "$lib/components/typography/H3.svelte";
import Paragraph from "$lib/components/typography/Paragraph.svelte";
import SectionHeading from "$lib/components/typography/SectionHeading.svelte";
import Button from "$lib/components/ui/Button.svelte";
import Image from "$lib/components/ui/Image.svelte";
import Section from "$lib/components/ui/Section.svelte";
import { viewportSlideInBottom } from "$lib/utils/viewportSwitchClass";
import { formatDate } from "$lib/utils/formatDate";

export let posts: any = [];
</script>

<Section
	id="post"
	class="flex flex-col gap-4 md:gap-6 lg:gap-8 xl:gap-12 justify-center"
>
	<SectionHeading centered title="Eigen <i>woorden</i>" subtitle="Blog" />
	<div class="grid grid-cols-1 md:grid-cols-2 gap-8 xl:gap-12">
		<!-- Latest blog post with thumbnail -->
		<div
			class="flex flex-col gap-6 xl:gap-8 items-start"
		>
			<a href="/blog/{posts[0].slug}" class="relative cursor-pointer w-full flex-1 min-h-48 overflow-hidden rounded-xl" data-cursor-icon="fullscreen" use:viewportSlideInBottom> 
				<Image
					parallax
					alt="{posts[0].title}"
					src="{posts[0].header_image}"
					class="absolute inset-0 w-full h-full object-cover "
					sizes="(min-width:1920px) 1920px, (min-width:1280px) 1280px, (min-width:768px) 480px"
				/>
			</a>
			<div class="flex flex-col gap-2">
				<hgroup class="flex flex-col gap-1 md:gap-2">
					<H3>{posts[0].title}</H3>
				</hgroup>
				<Paragraph class="hidden md:flex flex-1">
					{posts[0].description}
				</Paragraph>
			</div>
			<div class="w-full flex items-center justify-between gap-2">
				<Button
					style="line"
					href={`/blog/${posts[0].slug}`}
					ariaLabel="Blogpost: {posts[0].title}"
					iconRight={MdiArrowRight}>Lees meer</Button>
				<span class="hidden md:block text-black/80 dark:text-white/80">{formatDate(posts[0].publish_date)}</span>

			</div>
		</div>

		<!-- List of other blog posts -->
		<div class="flex flex-col gap-6 xl:gap-8 justify-between items-start">
			{#each posts.slice(1) as post}
				<div
					class="flex md:flex-col gap-2 md:gap-2 lg:gap-4 items-start w-full"
					use:viewportSlideInBottom
				>

					<div class="flex-1 w-full flex flex-col gap-2">
						<hgroup class="flex flex-col gap-1 md:gap-2">
							<H3>{post.title}</H3>
						</hgroup>
						<Paragraph class="flex-1 hidden md:flex">
							{post.description}
						</Paragraph>
					</div>
					<div class="h-full md:w-full flex items-center justify-center md:justify-between gap-2">
						<Button
							style="text"
							href={`/blog/${post.slug}`}
							ariaLabel="Blogpost: {post.title}"
							iconRight={MdiArrowRight}>Lees meer</Button>

						<span class="hidden md:block text-black/80 dark:text-white/80">{formatDate(post.publish_date)}</span>
					</div>
				</div>
			{/each}
			<Button
				href="/blog"
				style="line"
				ariaLabel="View all blog posts"
				iconRight={MdiArrowRight}>Bekijk alles</Button>
		</div>


	</div>
</Section>
