<script>
import Contact from "$lib/components/sections/index/Contact.svelte";
import HowItWorks from "$lib/components/sections/index/HowItWorks.svelte";
import Introduction from "$lib/components/sections/index/Introduction.svelte";
import Pricing from "$lib/components/sections/index/Pricing.svelte";
import Showcase from "$lib/components/sections/index/Showcase.svelte";
import Testimonials from "$lib/components/sections/index/Testimonials.svelte";
import SeoHead from "$lib/utils/SeoHead.svelte";
import HeroSequence from "$lib/components/sections/index/HeroSequence.svelte";
import BrandCarousel from "$lib/components/sections/index/BrandCarousel.svelte";
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
<Showcase />

<!--
<Introduction />
<HowItWorks />
<ScrollSequence />
<Pricing />
<Testimonials />
<Faq />
-->
<Contact />
