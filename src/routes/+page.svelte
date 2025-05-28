<script lang="ts">
import Contact from "$lib/components/sections/index/Contact.svelte";
import Showcase from "$lib/components/sections/index/Showcase.svelte";
import SeoHead from "$lib/utils/SeoHead.svelte";
import HeroSequence from "$lib/components/sections/index/HeroSequence.svelte";
import BrandCarousel from "$lib/components/sections/index/BrandCarousel.svelte";
import RecentPosts from "$lib/components/sections/index/RecentPosts.svelte";

export let data: { posts: any[] };
</script>


<SeoHead
    props={{
        title: "Hebweb site base",
        description: "This is a base template",
        keywords: "Hebweb, base template",
        slug: "website",
        thumbnail: "/images/placeholder1.jpg",
        type: "WebPage",
    }}
/>

<HeroSequence />
<BrandCarousel />
<RecentPosts posts={data.posts} />
<Showcase />
<Contact />
