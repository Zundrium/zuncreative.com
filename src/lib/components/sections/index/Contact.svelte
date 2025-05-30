<script lang="ts">
import Paragraph from "$lib/components/typography/Paragraph.svelte";
import SectionHeading from "$lib/components/typography/SectionHeading.svelte";
import Button from "$lib/components/ui/Button.svelte";
import Section from "$lib/components/ui/Section.svelte";
import {
	viewportSlideInBottom,
	viewportSlideInTop,
} from "$lib/utils/viewportSwitchClass";

import MdiPhone from "~icons/mdi/phone";
import MdiEmail from "~icons/mdi/email";

const contactMethods = [
	{
		icon: MdiPhone,
		ariaLabel: "Call",
		text: "+31 6 665 658",
		link: "tel:+316665658",
	},
	{
		icon: MdiEmail,
		ariaLabel: "Mail to",
		text: "info@hebweb.nl",
		link: "mail:info@hebweb.nl",
	},
];
</script>

<Section
    id="contact"
    class="flex flex-col justify-center gap-8 md:gap-10 lg:gap-12 items-center text-center"
    backgroundColor="bg-white dark:bg-black"
>
    <SectionHeading subtitle="Contact me" title="Let's <i>meet</i>" />
    <div class="flex flex-col items-center" use:viewportSlideInTop>
        <Paragraph size="xl" class="w-full md:w-1/2">
            Quisque mattis sodales purus, eu finibus diam eleifend eu. In
            accumsan orci sed justo interdum ornare. Fusce et mi vitae dolor
            porttitor porttitor vel non orci. Nulla facilisi.
        </Paragraph>
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
