<script lang="ts">
import MdiBan from "~icons/mdi/ban";
import MdiArrowUpRightThick from "~icons/mdi/arrow-up-right-thick";

import H1 from "$lib/components/typography/H1.svelte";
import Paragraph from "$lib/components/typography/Paragraph.svelte";
import Button from "$lib/components/ui/Button.svelte";
import Section from "$lib/components/ui/Section.svelte";
import Shader404 from "$lib/components/ui/Shader404.svelte";
</script>

<Section
    class="flex flex-col items-center justify-center text-center gap-4 md:gap-8 lg:gap-16"
    id="404"
    backgroundColor="bg-slate-300 dark:bg-slate-800"
>
    <Shader404 />
    <div class="relative z-20 flex flex-col gap-4 md:gap-8 items-center w-full">
        <MdiBan class="size-48" />
        <hgroup class="flex flex-col gap-2">
            <H1>404</H1>
            <span class="uppercase text-s text-gray-800 dark:text-gray-400"
                >Page not found</span
            >
        </hgroup>

        <Paragraph size="sm" class="text-black dark:text-gray-200"
            >This page has been doesn't exist or has been moved. <br />Please
            check the url or go back to the homepage and navigate to the right
            page.</Paragraph
        >
        <Button ariaLabel="Back to home" href="/" iconRight={MdiArrowUpRightThick}
            >Back to the homepage</Button
        >
    </div>
</Section>
