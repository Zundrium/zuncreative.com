<script lang="ts">
import Button from "../../ui/Button.svelte";
import MdiArrowDown from "~icons/mdi/arrow-down";
import MdiPhone from "~icons/mdi/phone";

import H1 from "$lib/components/typography/H1.svelte";
import ScrollIndicator from "$lib/components/ui/ScrollIndicator.svelte";
import HeroWave3DCanvas from "$lib/components/babylon/HeroWave3DCanvas.svelte";
</script>

<section
    id="hero"
    class="relative px-6 min-h-svh w-full flex flex-col gap-8 lg:gap-12 items-center justify-center pb-32 pt-32 -mt-20 md:-mt-27"
>
    <!-- <ShaderToyExample /> -->
    <div class="absolute left-0 top-0 w-full h-full">
        <!-- dark overlay -->
			<HeroWave3DCanvas />
        <!-- <Sunset3DCanvas /> -->
    </div>

	<!-- <H1 class="z-20 text-white text-center">A website to <i>remember</i></H1> -->
 <!--    <div class="flex flex-col md:flex-row gap-4 z-20"> -->
 <!--        <Button href="#contact" ariaLabel="Click me" iconLeft={MdiPhone} -->
 <!--            >Maak een afspraak</Button -->
 <!--        > -->
 <!--        <Button -->
 <!--            href="#how-it-works" -->
 <!--            ariaLabel="Read more" -->
 <!--            style="line" -->
 <!--            iconRight={MdiArrowDown}>Read more</Button -->
 <!--        > -->
 <!--    </div> -->

    <!-- scroll button -->

    <ScrollIndicator />
</section>
