<script lang="ts">
import MdiFoodApple from "~icons/mdi/food-apple";
import H3 from "$lib/components/typography/H3.svelte";
import Paragraph from "$lib/components/typography/Paragraph.svelte";
import SectionHeading from "$lib/components/typography/SectionHeading.svelte";
import CircleIcon from "$lib/components/ui/CircleIcon.svelte";
import Section from "$lib/components/ui/Section.svelte";
import { viewportSlideInBottom } from "$lib/utils/viewportSwitchClass";

const questions = [
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
			" Suspendisse rhoncus efficitur lacus, eget semper risus tincidunt sed. Praesent a gravida nunc. Nulla dapibus aliquet laoreet.",
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
			" Suspendisse rhoncus efficitur lacus, eget semper risus tincidunt sed. Praesent a gravida nunc. Nulla dapibus aliquet laoreet.",
		icon: MdiFoodApple,
	},
];
</script>

<Section
	id="faq"
	class="flex flex-col justify-center gap-8 md:gap-10 lg:gap-12 items-center"
	backgroundColor="bg-slate-50 dark:bg-slate-800"
>
	<SectionHeading centered subtitle="FAQ" title="Commonly asked questions" />
	<div
		class=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 pt-8 md:pt-16"
	>
		{#each questions as question}
			<div
				use:viewportSlideInBottom
				class="p-4 md:p-5 lg:p-6 bg-white dark:bg-slate-900 rounded-xl gap-2 md:gap-3 lg:gap-4 flex flex-col"
			>
				<CircleIcon icon={question.icon} class="-mt-8 md:-mt-16" />
				<H3>{question.title}</H3>
				<Paragraph>
					{question.description}
				</Paragraph>
			</div>
		{/each}
	</div>
</Section>
