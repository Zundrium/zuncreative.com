<script lang="ts">
import H3 from "$lib/components/typography/H3.svelte";
import Paragraph from "$lib/components/typography/Paragraph.svelte";
import SectionHeading from "$lib/components/typography/SectionHeading.svelte";
import CircleIcon from "$lib/components/ui/CircleIcon.svelte";
import Image from "$lib/components/ui/Image.svelte";
import Section from "$lib/components/ui/Section.svelte";
import MdiFoodApple from "~icons/mdi/food-apple";

import {
	viewportFade,
	viewportSlideInBottom,
} from "$lib/utils/viewportSwitchClass";
import Example3DCanvas from "$lib/components/babylon/Example3DCanvas.svelte";

let image: HTMLImageElement;

const benefits = [
	{
		title: "Title #1",
		description:
			"Curabitur et blandit nunc, sed porttitor lectus. Fusce malesuada, ante eget gravida eleifend, ligula ligula fringilla augue, nec iaculis nunc ligula pellentesque erat.",
		icon: MdiFoodApple,
	},
	{
		title: "Title #2",
		description:
			" Suspendisse rhoncus efficitur lacus, eget semper risus tincidunt sed. Praesent a gravida nunc. Nulla dapibus aliquet laoreet.",
		icon: MdiFoodApple,
	},
	{
		title: "Title #3",
		description:
			"Quisque mattis sodales purus, eu finibus diam eleifend eu. In accumsan orci sed justo interdum ornare. Fusce et mi vitae dolor porttitor porttitor vel non orci. Nulla facilisi. ",
		icon: MdiFoodApple,
	},
	{
		title: "Title #4",
		description:
			"Quisque mattis sodales purus, eu finibus diam eleifend eu. In accumsan orci sed justo interdum ornare. Fusce et mi vitae dolor porttitor porttitor vel non orci. Nulla facilisi. ",
		icon: MdiFoodApple,
	},
	{
		title: "Title #5",
		description:
			"Quisque mattis sodales purus, eu finibus diam eleifend eu. In accumsan orci sed justo interdum ornare. Fusce et mi vitae dolor porttitor porttitor vel non orci. Nulla facilisi. ",
		icon: MdiFoodApple,
	},
	{
		title: "Title #6",
		description:
			"Quisque mattis sodales purus, eu finibus diam eleifend eu. In accumsan orci sed justo interdum ornare. Fusce et mi vitae dolor porttitor porttitor vel non orci. Nulla facilisi. ",
		icon: MdiFoodApple,
	},
];
</script>

<Section
	id="introduction"
	class="flex flex-col items-stretch justify-stretch gap-8 lg:gap-12 xl:gap-16"
	backgroundColor="bg-white dark:bg-slate-900"
	containerClasses="overflow-hidden"
>
	<div class="absolute left-0 top-0 right-0 bottom-0">
		<Example3DCanvas />
	</div>
	<div
		class="flex-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-16"
	>
		<div class="overflow-hidden relative min-h-48">
			<Image
				alt="placeholder"
				src="/images/2d_matrix.png"
				class="absolute top-0 left-0 right-0 bottom-0 w-full z-0 h-full object-contain"
				sizes="(min-width:1920px) 1920px, (min-width:1280px) 1280px, (min-width:768px) 480px"
			/>
		</div>

		<div
			class="relative flex flex-col justify-center gap-2 md:gap-4 lg:gap-8"
		>
			<SectionHeading title="How it works" subtitle="How it works" />
			<Paragraph size="xl">
				Suspendisse rhoncus efficitur lacus, eget semper risus tincidunt
				sed. Praesent a gravida nunc. Nulla dapibus aliquet laoreet.
			</Paragraph>
		</div>
	</div>
	<div
		class=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-8 2xl:gap-12"
	>
		{#each benefits as benefit}
			<div
				use:viewportSlideInBottom
				class="flex w-full gap-4 lg:gap-8 items-start"
			>
				<CircleIcon icon={benefit.icon} />
				<div class="flex flex-col gap-2">
					<H3>{benefit.title}</H3>
					<Paragraph>
						{benefit.description}
					</Paragraph>
				</div>
			</div>
		{/each}
	</div>
</Section>
