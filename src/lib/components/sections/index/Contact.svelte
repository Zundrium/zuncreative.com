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
import * as m from "$lib/paraglide/messages";

const contactMethods = [
	{
		icon: MdiPhone,
		ariaLabel: m.contact_phone_aria(),
		text: "+316 13 665 658",
		link: "tel:+31613665658",
	},
	{
		icon: MdiEmail,
		ariaLabel: m.contact_email_aria(),
		text: "sem@zuncreative.com",
		link: "mailto:sem@zuncreative.com",
	},
	{
		icon: MdiLinkedin,
		ariaLabel: m.contact_linkedin_aria(),
		text: "/in/sem-verbraak/",
		link: "https://www.linkedin.com/in/sem-verbraak/",
	},
];
</script>

<Section
    id="contact"
    class="flex flex-col justify-center gap-8 md:gap-10 lg:gap-12 items-center text-center"
>
    <SectionHeading subtitle={m.contact_section_subtitle()} title={m.contact_section_title()} />
    <div class="flex flex-col items-center w-full" use:viewportSlideInTop>
        <AnimatedParagraph size="xl" class="w-full md:w-1/2">
				{@html m.contact_section_description()}
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
