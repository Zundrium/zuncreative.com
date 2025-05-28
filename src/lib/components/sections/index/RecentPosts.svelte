<script lang="ts">
import MdiArrowUpRightThick from "~icons/mdi/arrow-up-right-thick";
import H3 from "$lib/components/typography/H3.svelte";
import Paragraph from "$lib/components/typography/Paragraph.svelte";
import SectionHeading from "$lib/components/typography/SectionHeading.svelte";
import Button from "$lib/components/ui/Button.svelte";
import Image from "$lib/components/ui/Image.svelte";
import Section from "$lib/components/ui/Section.svelte";
import { viewportSlideInBottom } from "$lib/utils/viewportSwitchClass";

const posts: any = [];
</script>

<Section
    id="post"
    class="flex flex-col gap-4 md:gap-8 lg:gap-12 justify-center"
    backgroundColor="bg-slate-50 dark:bg-slate-800"
>
    <SectionHeading centered title="post" subtitle="Our work" />
    <div
        class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 lg:gap-12 xl:gap-16"
    >
        {#each posts as post}
            <div
                class="flex flex-col gap-2 md:gap-4 lg:gap-6 items-start"
                use:viewportSlideInBottom
            >
                <Image
                    alt="placeholder"
                    src="/images/placeholder1.jpg"
                    class="w-full rounded-xl"
                    sizes="(min-width:1920px) 1920px, (min-width:1280px) 1280px, (min-width:768px) 480px"
                />
                <hgroup class="flex flex-col gap-1 md:gap-2">
                    <H3>{post.title}</H3>
                    <span
                        class="uppercase text-sm text-slate-700 dark:text-slate-300"
                        >{post.subTitle}</span
                    >
                </hgroup>
                <Paragraph>
                    {post.description}
                </Paragraph>
                <Button
                    href={post.link}
                    ariaLabel="Website of {post.title}"
                    iconRight={MdiArrowUpRightThick}>Go to site</Button
                >
            </div>
        {/each}
    </div>
</Section>
