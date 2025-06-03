<script lang="ts">
import Contact from "$lib/components/sections/index/Contact.svelte";
import Showcase from "$lib/components/sections/index/Showcase.svelte";
import SeoHead from "$lib/utils/SeoHead.svelte";
import HeroSequence from "$lib/components/sections/index/HeroSequence.svelte";
import BrandCarousel from "$lib/components/sections/index/BrandCarousel.svelte";
import RecentPosts from "$lib/components/sections/index/RecentPosts.svelte";
import type { MarkdownTextfile } from "$lib/utils/types";
import Services from "$lib/components/sections/index/Services.svelte";

export let data: {
	posts: MarkdownTextfile[];
	showcaseItems: MarkdownTextfile[];
};
</script>


<SeoHead
    props={{
        title: "Zun Creative",
        description: "My name is Sem and I'm a freelance 3D web developer",
        keywords: "Zun Creative, freelance developer, Amsterdam",
        slug: "website",
		thumbnail: "/images/2d_matrix.png",
        type: "WebPage",
    }}
/>

<HeroSequence />
<BrandCarousel />
<Services />
<RecentPosts posts={data.posts} />
<Showcase showcaseItems={data.showcaseItems}/>
<Contact />
