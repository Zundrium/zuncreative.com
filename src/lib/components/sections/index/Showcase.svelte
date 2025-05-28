<script lang="ts">
import MdiArrowUpRightThick from "~icons/mdi/arrow-up-right-thick";
import H3 from "$lib/components/typography/H3.svelte";
import Paragraph from "$lib/components/typography/Paragraph.svelte";
import SectionHeading from "$lib/components/typography/SectionHeading.svelte";
import Button from "$lib/components/ui/Button.svelte";
import Image from "$lib/components/ui/Image.svelte";
import Section from "$lib/components/ui/Section.svelte";
import { viewportSlideInBottom } from "$lib/utils/viewportSwitchClass";
import { showcaseItemTag } from "$lib/utils/types/showcaseItem";

const showCases = [
	{
		title: "Alterframe",
		subTitle: "AI Photobooth with instant print",
		image: "",
		link: "",
		tags: [showcaseItemTag.AI, showcaseItemTag.Web],
	},
	{
		title: "Hebweb",
		subTitle: "Subscription based managed website",
		image: "",
		link: "",
		tags: [showcaseItemTag.Web],
	},
	{
		title: "Code Couture PoS",
		subTitle: "Avatar based garment configurator",
		image: "",
		link: "",
		tags: [showcaseItemTag.ThreeD, showcaseItemTag.Web],
	},
];
</script>

<Section
    id="blog-items"
    class="flex flex-col gap-4 md:gap-8 lg:gap-12 justify-center"
    backgroundColor="bg-white dark:bg-black"
>
    <SectionHeading centered title="My <i>work</i>" subtitle="Showcase" />
    <div
        class="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 lg:gap-8 xl:gap-12"
    >
        {#each showCases as showCase}
            <a href="#"
                class="flex flex-col gap-2 md:gap-2 lg:gap-4 items-start cursor-pointer"
                use:viewportSlideInBottom
            >
					<div class="overflow-hidden rounded-xl ">
						 <Image
							  alt="placeholder"
							  src="/images/placeholder1.jpg"
							  sizes="(min-width:1920px) 1920px, (min-width:1280px) 1280px, (min-width:768px) 480px"
						 />
					</div>
                <hgroup class="flex flex-col gap-1 md:gap-2">
                    <H3>{showCase.title}</H3>
                    <span
                        class="text-sm text-slate-700 dark:text-slate-300"
                        >{showCase.subTitle}</span
                    >
                </hgroup>
                
            </a>
        {/each}
    </div>
</Section>
