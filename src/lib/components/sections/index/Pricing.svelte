<script lang="ts">
import Button from "$lib/components/ui/Button.svelte";
import Section from "$lib/components/ui/Section.svelte";
import MdiEye from "~icons/mdi/eye";
import MdiShape from "~icons/mdi/shape";
import MdiCheck from "~icons/mdi/check";
import MdiShapeSquarePlus from "~icons/mdi/shape-square-plus";
import MdiBan from "~icons/mdi/ban";
import MdiPhone from "~icons/mdi/phone";

import Paragraph from "$lib/components/typography/Paragraph.svelte";
import SectionHeading from "$lib/components/typography/SectionHeading.svelte";
import CircleIcon from "$lib/components/ui/CircleIcon.svelte";
import { viewportFade } from "$lib/utils/viewportSwitchClass";

type ButtonStyle = "secondary" | "line" | "text" | "normal" | undefined;

const pricingTiers = [
	{
		name: "Base",
		price: "129",
		icon: MdiShape,
		description:
			"Curabitur et blandit nunc, sed porttitor lectus. Fusce malesuada, ante eget gravida eleifend, ligula ligula fringilla augue, nec iaculis nunc ligula pellentesque erat.",
		style:
			"bg-white dark:bg-slate-800 text-black dark:text-white border-2 dark:border-gray-700",
		animation: viewportFade,
		features: [
			{ name: "Custom Design & Development", included: true },
			{ name: "Cloudflare hosting", included: true },
			{ name: "Edits binnen 2 werkdagen", included: true },
			{ name: "Domeinregistratie", included: true },
			{ name: "1 E-mail inbox", included: true },
			{ name: "3D Graphics", included: false },
			{ name: "Multilingual support", included: false },
			{ name: "Dark/Light theme", included: false },
		],
		buttonStyle: undefined as ButtonStyle,
	},
	{
		name: "Premium",
		price: "179",
		icon: MdiShapeSquarePlus,
		description:
			"Curabitur et blandit nunc, sed porttitor lectus. Fusce malesuada, ante eget gravida eleifend, ligula ligula fringilla augue, nec iaculis nunc ligula pellentesque erat.",
		style:
			"bg-slate-100 dark:bg-slate-700 text-black dark:text-white border-2 border-gray-200 dark:border-gray-600",
		animation: viewportFade,
		features: [
			{ name: "Custom Design & Development", included: true },
			{ name: "Cloudflare hosting", included: true },
			{ name: "Edits binnen 2 werkdagen", included: true },
			{ name: "Domeinregistratie", included: true },
			{ name: "5 E-mail inboxes", included: true },
			{ name: "3D Graphics", included: true },
			{ name: "Multilingual support", included: false },
			{ name: "Dark/Light theme", included: true },
		],
		buttonStyle: "normal" as ButtonStyle,
	},
	{
		name: "Immersive",
		price: "250",
		icon: MdiEye,
		description:
			"Curabitur et blandit nunc, sed porttitor lectus. Fusce malesuada, ante eget gravida eleifend, ligula ligula fringilla augue, nec iaculis nunc ligula pellentesque erat.",
		style: "bg-black text-white dark:bg-white dark:text-black",
		animation: viewportFade,
		features: [
			{ name: "Custom Design & Development", included: true },
			{ name: "Cloudflare hosting", included: true },
			{ name: "Edits binnen 2 werkdagen", included: true },
			{ name: "Domeinregistratie", included: true },
			{ name: "10 E-mail inboxes", included: true },
			{ name: "3D Graphics", included: true },
			{ name: "Multilingual support", included: true },
			{ name: "Dark/Light theme", included: true },
		],
		buttonStyle: "secondary" as ButtonStyle,
	},
];
</script>

<Section
	id="pricing"
	class="flex flex-col gap-8 lg:gap-12 items-center justify-center"
	backgroundColor="bg-slate-50 dark:bg-slate-800"
>
	<div class="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-8 xl:gap-16">
		<div class="flex flex-col gap-4">
			<SectionHeading subtitle="Pricing" title="Choose your plan" />
			<Paragraph size="xl">
				Curabitur et blandit nunc, sed porttitor lectus. Fusce
				malesuada, ante eget gravida eleifend, ligula ligula fringilla
				augue, nec iaculis nunc ligula pellentesque erat.
			</Paragraph>
		</div>
		{#each pricingTiers as tier, i}
			<div
				use:tier.animation
				class="flex flex-col {tier.style} rounded-xl p-4 md:p-6 lg:p-8 justify-between gap-4 xl:gap-6 2xl:gap-8"
			>
				<div class="w-full flex gap-2 lg:gap-4 2xl:gap-8 items-center">
					<CircleIcon size="sm" icon={tier.icon} />
					<span class="font-bold text-center text-lg md:text-xl lg:text-2xl"
						>{tier.name}</span
					>
				</div>

				<hgroup class="flex flex-col w-full gap-2">
					<h3
						class="w-full font-bold text-2xl lg:text-3xl xl:text-4xl"
					>
						&euro; {tier.price}
						<span class="text-slate-500 inline-block">
							/ month</span
						>
					</h3>
					<span
						class="w-full text-xs lg:text-sm text-slate-500 uppercase"
						>Excl. BTW, billed annually</span
					>
				</hgroup>
				<Paragraph size="sm">
					{tier.description}
				</Paragraph>
				<ul
					class="flex flex-col gap-1 xl:gap-2 {i !== 2
						? 'dark:text-slate-300'
						: ''}"
				>
					{#each tier.features as feature}
						<li
							class="flex text-xs justify-between items-center {!feature.included
								? 'line-through text-slate-700 dark:text-slate-300'
								: ''} "
						>
							<span>{feature.name}</span>
							{#if feature.included}
								<MdiCheck class="size-4" />
							{:else}
								<MdiBan class="size-4" />
							{/if}
						</li>
					{/each}
				</ul>
				<Button
					href="/#contact"
					ariaLabel="Make an appointment Button"
					iconLeft={MdiPhone}
					style={tier.buttonStyle}
				>
					Maak een afspraak
				</Button>
			</div>
		{/each}
	</div>
</Section>
