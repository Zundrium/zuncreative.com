<script lang="ts">
    import MdiFormatQuoteCloseOutline from "~icons/mdi/format-quote-close-outline";
    import H3 from "$lib/components/typography/H3.svelte";
    import Paragraph from "$lib/components/typography/Paragraph.svelte";
    import SectionHeading from "$lib/components/typography/SectionHeading.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Section from "$lib/components/ui/Section.svelte";
    import { viewportSlideInBottom } from "$lib/utils/viewportSwitchClass";
    import Example3DCanvas from "$lib/components/babylon/Example3DCanvas.svelte";

    const reviews = [
        {
            person: "person #1",
            job: "job #1",
            quote: "Suspendisse rhoncus efficitur lacus, eget semper risus tincidunt sed. Praesent a gravida nunc. Nulla dapibus aliquet laoreet.",
        },
        {
            person: "person #2",
            job: "job #1",
            quote: "Suspendisse rhoncus efficitur lacus, eget semper risus tincidunt sed. Praesent a gravida nunc. Nulla dapibus aliquet laoreet.",
        },
        {
            person: "person #3",
            job: "job #3",
            quote: "Suspendisse rhoncus efficitur lacus, eget semper risus tincidunt sed. Praesent a gravida nunc. Nulla dapibus aliquet laoreet.",
        },
    ];
</script>

<Section
    id="testimonials"
    class="flex flex-col gap-8 md:gap-12 lg:gap-16 justify-center"
    backgroundColor="bg-white dark:bg-slate-900"
>
    <div class="absolute left-0 top-0 w-full h-full">
        <Example3DCanvas />
    </div>
    <SectionHeading
        centered
        subtitle="Testimonials"
        title="What our customers think"
    />
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
        {#each reviews as review}
            <div
                class="flex flex-col gap-2 md:gap-4 lg:gap-8 bg-slate-50 dark:bg-slate-800 rounded-xl p-4 md:p-6 lg:p-8"
                use:viewportSlideInBottom
            >
                <MdiFormatQuoteCloseOutline
                    class="self-end size-8 md:size-12 -mt-8 md:-mt-12"
                />
                <Paragraph size="lg">
                    {review.quote}
                </Paragraph>
                <div class="flex flex-col gap-2">
                    <H3>{review.person}</H3>
                    <span
                        class="uppercase text-sm text-slate-700 dark:text-slate-300"
                        >{review.job}</span
                    >
                </div>
            </div>
        {/each}
    </div>
</Section>
