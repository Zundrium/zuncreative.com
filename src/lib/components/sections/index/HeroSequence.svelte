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
		title: "Let's create an <br/>immersive <i>experience</i>",
		description:
			"My name is Sem,<br/>and I enjoy making 3D focused websites<br/>for immersive marketing campaigns or games.",
	},
	{
		title: "Time to expand<br/>your <i>horizon</i>",
		description:
			"With the latest web technologies, we can create stunning<br/>3D experiences that are accessible to everyone.",
	},
	{
		title: "A world starts with<br/>a single <i>click</i>",
		description:
			" With a QR code or short link everyone in the world<br/>can access your new experience.",
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
	{
		minY: -0.5,
		maxY: 1 / 6,
		onActive: () => {
			heroWave3DCanvas?.activateStep(0);
		},
		onInactive: () => {},
	},
	{
		minY: 1 / 6,
		maxY: 2 / 6,
		onActive: () => {
			heroWave3DCanvas?.activateStep(1);
		},
		onInactive: () => {},
	},
	{
		minY: 2 / 6,
		maxY: 3 / 6,
		onActive: () => {
			heroWave3DCanvas?.activateStep(2);
		},
		onInactive: () => {},
	},
	{
		minY: 3 / 6,
		maxY: 4 / 6,
		onActive: () => {
			heroWave3DCanvas?.activateStep(3);
		},
		onInactive: () => {},
	},
	{
		minY: 4 / 6,
		maxY: 5 / 6,
		onActive: () => {
			heroWave3DCanvas?.activateStep(4);
		},
		onInactive: () => {},
	},
	{
		minY: 5 / 6,
		maxY: 1.5,
		onActive: () => {
			heroWave3DCanvas?.activateStep(5);
		},
		onInactive: () => {},
	},
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
	const distance = Math.abs(newTarget - currentProgress.value);
	const duration = Math.log(distance + 1) * 0.2;

	currentProgress.value = newTarget;

	//gsap.to(currentProgress, {
	//	value: newTarget,
	//	duration: Math.max(duration, 0.05),
	//	ease: "power2.out",
	//});

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
		containerClasses="sticky top-0 h-dvh overflow-x-hidden pt-24 lg:pt-16 xl:pt-20 pb-32 pt-32 -mt-20 md:-mt-27"
		class="grid grid-cols-1 grid-rows-2 md:grid-rows-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 "
		backgroundColor="bg-white dark:bg-black"
		bind:element={sequenceBox}
	>

		<div class="w-full h-full absolute inset-0">
			<HeroWave3DCanvas bind:this={heroWave3DCanvas} onReady={onCanvasReady} />
		</div>

		<!-- bottom gradient overlay -->
		<div class="absolute inset-0 bg-gradient-to-t from-white to-transparent dark:from-black dark:to-transparent"></div>

		<div class="absolute inset-0 ">
			<!-- scroll container -->
			<div bind:this={scrollContainerElement} class="h-full w-auto flex overflow-x-hidden">
				{#each slides as slide, index}
					<div
						class="flex flex-none flex-col justify-end gap-4 md:gap-6 lg:gap-8 xl:gap-10 h-full w-dvw p-4 lg:p-8 2xl:p-12"
					>
						<div bind:this={slideElements[index]}>
							<H2 class="text-black dark:text-white"
							>{@html slide.title}</H2>
							<Paragraph class="text-black dark:text-white">
								{@html slide.description}
							</Paragraph>
						</div>
						<div class="w-full h-[1px] bg-black/50">
							<div
								class="h-full bg-white/50"
								style="width: {Math.max(0, Math.min(100, (currentProgress.value - index * 33.33) * 3))}%"
							> </div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</Section>
</div>
