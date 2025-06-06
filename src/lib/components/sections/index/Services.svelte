<script>
import AnimatedParagraph from "$lib/components/typography/AnimatedParagraph.svelte";
import H3 from "$lib/components/typography/H3.svelte";
import Paragraph from "$lib/components/typography/Paragraph.svelte";
import SectionHeading from "$lib/components/typography/SectionHeading.svelte";
import Section from "$lib/components/ui/Section.svelte";
import { viewportSlideInBottom } from "$lib/utils/viewportSwitchClass";
</script>
<Section
	id="over-mij"
	class="flex flex-col gap-4 lg:gap-6 xl:gap-12 justify-center items-center"
>
	<SectionHeading 
		centered
		subtitle="over mij"
		title="Waar ik op <i>focus</i>"
	/>

<AnimatedParagraph class="text-center w-full md:w-1/2">
			Ik ben <i>Sem</i>, een web developer met meer dan 15 jaar ervaring uit Amsterdam. Ik maak audiovisuele websites en web applicaties die snel, toegankelijk en gebruiksvriendelijk zijn. Mijn focus ligt op het creëren van een geweldige gebruikerservaring door middel van moderne technologieën en designprincipes.
		</AnimatedParagraph>

	<div 
		class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-8 2xl:gap-12">
		
		<div class="text-center flex flex-col gap-4 lg:gap-6 xl:gap-12">
			<h3 class="text-6xl md:text-7xl lg:text-8xl xl:text-9xl serif-display" use:viewportSlideInBottom>AI</h3>
			<AnimatedParagraph>
				Alles is te versnellen, verbeteren en te personaliseren met Artificial Intelligence. Ik pas het toe in al mijn recente werk. Maar het kan geen verantwoordelijkheid nemen.
			</AnimatedParagraph>
		</div>
		<div class="text-center flex flex-col gap-4 lg:gap-6 xl:gap-12">
			<h3 class="text-6xl md:text-7xl lg:text-8xl xl:text-9xl serif-display" use:viewportSlideInBottom>AR</h3>
			<AnimatedParagraph>
				Al je ervaringen met Augmented Reality vergeet je niet, in combinatie met de laatste AI trends kan je iedereen een persoonlijke ervaring geven.
			</AnimatedParagraph>
		</div>
		<div class="text-center flex flex-col gap-4 lg:gap-6 xl:gap-12">
			<h3 class="text-6xl md:text-7xl lg:text-8xl xl:text-9xl serif-display" use:viewportSlideInBottom>3D</h3>
			<AnimatedParagraph>
				Een meer toegankelijke, visueel rijke ervaring kan gewoon in je browser, zoals de header hierboven. Elk concept, elke cinematische uitdrukking is te zien op een web pagina.
			</AnimatedParagraph>
		</div>

	</div>

</Section>
