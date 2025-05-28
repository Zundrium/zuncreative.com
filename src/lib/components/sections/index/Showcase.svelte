<script lang="ts">
import MdiArrowUpRightThick from "~icons/mdi/arrow-up-right-thick";
import H3 from "$lib/components/typography/H3.svelte";
import Paragraph from "$lib/components/typography/Paragraph.svelte";
import SectionHeading from "$lib/components/typography/SectionHeading.svelte";
import Button from "$lib/components/ui/Button.svelte";
import Image from "$lib/components/ui/Image.svelte";
import Section from "$lib/components/ui/Section.svelte";
import { viewportSlideInBottom } from "$lib/utils/viewportSwitchClass";
import Example3DCanvas from "$lib/components/babylon/Example3DCanvas.svelte";

const showCases = [
	{
		title: "Alterframe",
		subTitle: "AI Photobooth with instant print",
		image: "",
		link: "",
	},
	{
		title: "Hebweb",
		subTitle: "Subscription based managed website",
		image: "",
		link: "",
	},
	{
		title: "Code Couture PoS",
		subTitle: "Avatar based garment configurator",
		image: "",
		link: "",
	},
];
</script>

<Section
    id="showcase"
    class="flex flex-col gap-4 md:gap-8 lg:gap-12 justify-center"
    backgroundColor="bg-white dark:bg-black"
>
    <div class="absolute left-0 top-0 w-full h-full">
        <Example3DCanvas />
    </div>
	
    <SectionHeading centered title="My <i>work</i>" subtitle="Showcase" />
    <div
        class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 lg:gap-12 xl:gap-16"
    >
        {#each showCases as showCase}
            <div
                class="flex flex-col gap-2 md:gap-4 lg:gap-6 items-start cursor-pointer"
                use:viewportSlideInBottom
            >
                <Image
                    alt="placeholder"
                    src="/images/placeholder1.jpg"
                    class="w-full rounded-xl"
                    sizes="(min-width:1920px) 1920px, (min-width:1280px) 1280px, (min-width:768px) 480px"
                />
                <hgroup class="flex flex-col gap-1 md:gap-2">
                    <H3>{showCase.title}</H3>
                    <span
                        class="text-sm text-slate-700 dark:text-slate-300"
                        >{showCase.subTitle}</span
                    >
                </hgroup>
                
            </div>
        {/each}
    </div>
</Section>
