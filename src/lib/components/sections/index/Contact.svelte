<script lang="ts">
import SectionHeading from "$lib/components/typography/SectionHeading.svelte";
import Button from "$lib/components/ui/Button.svelte";
import Section from "$lib/components/ui/Section.svelte";
import {
	viewportSlideInBottom,
	viewportSlideInTop,
} from "$lib/utils/viewportSwitchClass";

import MdiLinkedin from "~icons/mdi/linkedin";
import MdiPhone from "~icons/mdi/phone";
import MdiEmail from "~icons/mdi/email";
import AnimatedParagraph from "$lib/components/typography/AnimatedParagraph.svelte";

const contactMethods = [
	{
		icon: MdiPhone,
		ariaLabel: "Call",
		text: "+31 6 13 665 658",
		link: "tel:+31613665658",
	},
	{
		icon: MdiEmail,
		ariaLabel: "Mail to",
		text: "sem@zuncreative.com",
		link: "mailto:sem@zuncreative.com",
	},
	{
		icon: MdiLinkedin,
		ariaLabel: "LinkedIn profile",
		text: "/in/sem-verbraak/",
		link: "https://www.linkedin.com/in/sem-verbraak/",
	},
];
</script>

<Section
    id="contact"
    class="flex flex-col justify-center gap-8 md:gap-10 lg:gap-12 items-center text-center min-h-svh"
    backgroundColor="bg-white dark:bg-black"
>
    <SectionHeading subtitle="Contact" title="Laten we <i>ontmoeten</i>" />
    <div class="flex flex-col items-center w-full" use:viewportSlideInTop>
        <AnimatedParagraph size="xl" class="w-full md:w-1/2">
				Contact opnemen kan altijd via e-mail of telefoon. Voor vragen over mijn werk of om een project te bespreken, aarzel niet om contact op te nemen. Ik kijk ernaar uit om iets te horen!	
        </AnimatedParagraph>
    </div>
    <div
        class="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 lg:gap-12 xl:gap-16 w-full"
    >
        {#each contactMethods as contactMethod}
            <Button
				style="text"
                iconLeft={contactMethod.icon}
                ariaLabel={contactMethod.ariaLabel}
                href={contactMethod.link}>{contactMethod.text}</Button
            >
        {/each}
    </div>
</Section>
