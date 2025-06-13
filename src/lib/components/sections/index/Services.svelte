<script>
import AnimatedParagraph from "$lib/components/typography/AnimatedParagraph.svelte";
import H3 from "$lib/components/typography/H3.svelte";
import Paragraph from "$lib/components/typography/Paragraph.svelte";
import SectionHeading from "$lib/components/typography/SectionHeading.svelte";
import Section from "$lib/components/ui/Section.svelte";
import { viewportSlideInBottom } from "$lib/utils/viewportSwitchClass";
import * as m from "$lib/paraglide/messages";
</script>
<Section
	id="over-mij"
	class="flex flex-col gap-4 lg:gap-6 xl:gap-12 justify-center items-center"
>
	<SectionHeading 
		centered
		subtitle={m.services_section_subtitle()}
		title={m.services_section_title()}
	/>

<AnimatedParagraph class="text-center w-full md:w-1/2">
			{@html m.services_section_intro()}
		</AnimatedParagraph>

	<div 
		class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-8 2xl:gap-12">
		
		<div class="text-center flex flex-col gap-4 lg:gap-6 xl:gap-12">
			<h3 class="text-6xl md:text-7xl lg:text-8xl xl:text-9xl serif-display" use:viewportSlideInBottom>AI</h3>
			<AnimatedParagraph>
				{@html m.services_section_ai_description()}
			</AnimatedParagraph>
		</div>
		<div class="text-center flex flex-col gap-4 lg:gap-6 xl:gap-12">
			<h3 class="text-6xl md:text-7xl lg:text-8xl xl:text-9xl serif-display" use:viewportSlideInBottom>AR</h3>
			<AnimatedParagraph>
				{@html m.services_section_ar_description()}
			</AnimatedParagraph>
		</div>
		<div class="text-center flex flex-col gap-4 lg:gap-6 xl:gap-12">
			<h3 class="text-6xl md:text-7xl lg:text-8xl xl:text-9xl serif-display" use:viewportSlideInBottom>3D</h3>
			<AnimatedParagraph>
				{@html m.services_section_3d_description()}
			</AnimatedParagraph>
		</div>

	</div>

</Section>
