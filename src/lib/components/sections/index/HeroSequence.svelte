<script lang="ts">
import HeroWave3DCanvas from "$lib/components/babylon/HeroWave3DCanvas.svelte";
import H2 from "$lib/components/typography/H2.svelte";
import Paragraph from "$lib/components/typography/Paragraph.svelte";
import SectionHeading from "$lib/components/typography/SectionHeading.svelte";
import Section from "$lib/components/ui/Section.svelte";
import { onMount } from "svelte";
import gsap from "gsap";

let sequenceItemsStates: boolean[] = [];
let sequenceContainer: HTMLElement;
let sequenceBox: HTMLElement;
let currentScrollValue: number = 0;

let scrollContainerElement: HTMLElement | null = null;
let slideElements: HTMLElement[] = [];
let currentProgress = {
	value: 0,
};

let heroWave3DCanvas: HeroWave3DCanvas | null = null;
let minScrollY: number = 0;
let maxScrollY: number = 0;

interface Slide {
	title: string;
	description: string;
}

const slides: Slide[] = [
	{
		title: "Iets wat blijft <i>hangen</i>",
		description:
			"Ik ben Sem, ik bouw werelden die je niet zomaar wegklikt. Met 3D krijgt je website karakter, een gevoel, iets dat mensen echt onthouden.",
	},
	{
		title: "Interactieve <i>verhalen</i>",
		description:
			"Jouw muis wordt een toverstaf in een betoverende digitale wereld. Elk element reageert op jouw aanraking, en samen creëren we een ervaring die je blijft raken.",
	},
	{
		title: "Voor iedereen <i>toegankelijk</i>",
		description:
			"Geen gedoe, geen downloads, 3D op het web opent deuren met één klik. Voor iedereen, overal, meteen toegankelijk en klaar om te fascineren.",
	},
];

interface SequenceItem {
	minY: number;
	maxY: number;
	onActive: () => void;
	onInactive: () => void;
}

const animateScrollContainer = (scrollValue: number) => {
	currentScrollValue = scrollValue;
	gsap.to(scrollContainerElement, {
		scrollLeft: scrollValue * scrollContainerElement!.scrollWidth,
		duration: 1,
		ease: "power.out",
	});
};

const sequence: SequenceItem[] = [
	{
		minY: -0.5,
		maxY: 1 / 3,
		onActive: () => {
			animateScrollContainer(0);

			slideElements[0].classList.add(
				"opacity-100",
				"!translate-x-0",
				"transition-delay-0",
			);
		},
		onInactive: () => {
			slideElements[0].classList.remove("opacity-100", "!translate-x-0");
		},
	},
	{
		minY: 1 / 3,
		maxY: 2 / 3,
		onActive: () => {
			slideElements[1].classList.add("opacity-100", "!translate-x-0");
			animateScrollContainer(1 / 3);
		},
		onInactive: () => {
			slideElements[1].classList.remove("opacity-100", "!translate-x-0");
		},
	},
	{
		minY: 2 / 3,
		maxY: 1.5,
		onActive: () => {
			slideElements[2].classList.add("opacity-100", "!translate-x-0");
			animateScrollContainer(2 / 3);
		},
		onInactive: () => {
			slideElements[2].classList.remove("opacity-100", "!translate-x-0");
		},
	},
	//{
	//	minY: -0.5,
	//	maxY: 1 / 6,
	//	onActive: () => {
	//		heroWave3DCanvas?.activateStep(0);
	//	},
	//	onInactive: () => {},
	//},
	//{
	//	minY: 1 / 6,
	//	maxY: 2 / 6,
	//	onActive: () => {
	//		heroWave3DCanvas?.activateStep(1);
	//	},
	//	onInactive: () => {},
	//},
	//{
	//	minY: 2 / 6,
	//	maxY: 3 / 6,
	//	onActive: () => {
	//		heroWave3DCanvas?.activateStep(2);
	//	},
	//	onInactive: () => {},
	//},
	//{
	//	minY: 3 / 6,
	//	maxY: 4 / 6,
	//	onActive: () => {
	//		heroWave3DCanvas?.activateStep(3);
	//	},
	//	onInactive: () => {},
	//},
	//{
	//	minY: 4 / 6,
	//	maxY: 5 / 6,
	//	onActive: () => {
	//		heroWave3DCanvas?.activateStep(4);
	//	},
	//	onInactive: () => {},
	//},
	//{
	//	minY: 5 / 6,
	//	maxY: 1.5,
	//	onActive: () => {
	//		heroWave3DCanvas?.activateStep(5);
	//	},
	//	onInactive: () => {},
	//},
];

function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

function lerp(start: number, end: number, t: number): number {
	return start + (end - start) * t;
}

function handleScroll() {
	const scrollY = window.scrollY - minScrollY;
	const normalizedScrollY = clamp(scrollY / (maxScrollY - minScrollY), 0, 1);
	const newTarget = normalizedScrollY * 100;
	currentProgress.value = newTarget;
	heroWave3DCanvas!.update(normalizedScrollY * 5);

	sequence.forEach((item, index) => {
		if (normalizedScrollY >= item.minY && normalizedScrollY <= item.maxY) {
			if (!sequenceItemsStates[index]) {
				item.onActive();
				sequenceItemsStates[index] = true;
			}
		} else {
			if (sequenceItemsStates[index]) {
				item.onInactive();
				sequenceItemsStates[index] = false;
			}
		}
	});
}

function onCanvasReady() {
	handleScroll();
}

onMount(() => {
	sequenceItemsStates = sequence.map(() => false);
	minScrollY = sequenceContainer.offsetTop;
	maxScrollY =
		sequenceContainer.offsetTop +
		sequenceContainer.offsetHeight -
		sequenceBox.offsetHeight;

	// on resize
	window.addEventListener("resize", () => {
		animateScrollContainer(currentScrollValue);
	});

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					window.addEventListener("scroll", handleScroll);
				} else {
					window.removeEventListener("scroll", handleScroll);
				}
			});
		},
		{
			threshold: 0,
			rootMargin: "0px",
		},
	);
	observer.observe(sequenceContainer);
});
</script>

<div bind:this={sequenceContainer} class="w-full relative h-[4000px]">
	<Section
		id="scroll-sequence"
		containerClasses="cursor-scroll sticky top-0 h-dvh overflow-x-hidden pt-24 lg:pt-16 xl:pt-20 pb-32 pt-32"
		class="grid grid-cols-1 grid-rows-2 md:grid-rows-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 "
		backgroundColor="bg-white dark:bg-black"
		bind:element={sequenceBox}
	>

		<div class="w-full h-full absolute inset-0">
			<HeroWave3DCanvas bind:this={heroWave3DCanvas} onReady={onCanvasReady} />
		</div>

		<!-- bottom gradient overlay -->
		<div class="absolute inset-0 bg-gradient-to-t from-white to-transparent dark:from-black dark:to-transparent"></div>

		<div class="absolute inset-0 select-none">
			<!-- scroll container -->
			<div bind:this={scrollContainerElement} class="h-full w-auto flex overflow-x-hidden">
				{#each slides as slide, index}
					<div
						class="flex flex-none flex-col justify-end gap-4 md:gap-6 lg:gap-8 xl:gap-10 h-full w-dvw p-8 lg:p-12 xl:p-16 2xl:p-24"
					>
						<div bind:this={slideElements[index]} class="flex flex-col gap-4 lg:gap-6">
							<H2 class="text-black dark:text-white"
							>{@html slide.title}</H2>
							<Paragraph class="text-black/80 dark:text-white/80">
								{@html slide.description}
							</Paragraph>
						</div>
						<div class="w-full h-[1px] bg-white/20">
							<div
								class="h-full bg-white"
								style="width: {Math.max(0, Math.min(100, (currentProgress.value - index * 33.33) * 3))}%"
							> </div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</Section>
</div>
