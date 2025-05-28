<script lang="ts">
import Shape3DCanvas from "$lib/components/babylon/Shape3DCanvas.svelte";
import Paragraph from "$lib/components/typography/Paragraph.svelte";
import SectionHeading from "$lib/components/typography/SectionHeading.svelte";
import Image from "$lib/components/ui/Image.svelte";
import NavbarFiller from "$lib/components/ui/NavbarFiller.svelte";
import Section from "$lib/components/ui/Section.svelte";
import { onMount } from "svelte";

let sequenceItemsStates: boolean[] = [];
let sequenceContainer: HTMLElement;
let sequenceBox: HTMLElement;

let rightPart1: HTMLElement;
let rightPart2: HTMLElement;
let rightPart3: HTMLElement;
let targetProgressPercentage: number = 0;
let currentProgressPercentage: number = 0;

let shape3DCanvas: Shape3DCanvas | null = null;
let minScrollY: number = 0;
let maxScrollY: number = 0;

interface SequenceItem {
	minY: number;
	maxY: number;
	onActive: () => void;
	onInactive: () => void;
}

const sequence: SequenceItem[] = [
	{
		minY: -0.5,
		maxY: 0.33,
		onActive: () => {
			rightPart1.classList.add(
				"opacity-100",
				"!translate-x-0",
				"transition-delay-0",
			);
			shape3DCanvas?.resetShapeKeys();
		},
		onInactive: () => {
			rightPart1.classList.remove("opacity-100", "!translate-x-0");
		},
	},
	{
		minY: 0.33,
		maxY: 0.66,
		onActive: () => {
			rightPart2.classList.add("opacity-100", "!translate-x-0");
			shape3DCanvas?.makeShapeKeyActive(0);
		},
		onInactive: () => {
			rightPart2.classList.remove("opacity-100", "!translate-x-0");
		},
	},
	{
		minY: 0.66,
		maxY: 1.5,
		onActive: () => {
			rightPart3.classList.add("opacity-100", "!translate-x-0");
			shape3DCanvas?.makeShapeKeyActive(1);
		},
		onInactive: () => {
			rightPart3.classList.remove("opacity-100", "!translate-x-0");
		},
	},
];

function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

function lerp(start: number, end: number, t: number): number {
	return start + (end - start) * t;
}

function animateProgress(timestamp: number) {
	currentProgressPercentage = lerp(
		currentProgressPercentage,
		targetProgressPercentage,
		0.01,
	);
	if (currentProgressPercentage != targetProgressPercentage) {
		requestAnimationFrame(animateProgress);
	}
}

function handleScroll() {
	const scrollY = window.scrollY - minScrollY;

	const normalizedScrollY = clamp(scrollY / (maxScrollY - minScrollY), 0, 1);
	targetProgressPercentage = normalizedScrollY * 100;
	requestAnimationFrame(animateProgress);

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
        containerClasses="sticky top-0 h-dvh overflow-x-hidden pt-24 lg:pt-16 xl:pt-20"
        class="grid grid-cols-1 grid-rows-2 md:grid-rows-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-16"
        backgroundColor="bg-slate-200 dark:bg-slate-700"
        bind:element={sequenceBox}
    >
        <!-- progress bar -->
        <div class="w-full h-2 absolute left-0 bottom-0 bg-black z-60">
            <!-- progress -->
            <div
                class="h-full bg-red-500"
                style="width: {currentProgressPercentage}%"
            ></div>
        </div>

        <div class="relative">
            <Shape3DCanvas bind:this={shape3DCanvas} onReady={onCanvasReady} />
        </div>

        <div class="relative flex-none">
            <div
                bind:this={rightPart1}
                class="absolute top-0 left-0 right-0 bottom-0 opacity-0 translate-x-20 transition-all duration-500 flex justify-center flex-col"
            >
                <SectionHeading title="Part 1" subtitle="Introduction" />
                <Paragraph size="xl">
                    Suspendiesse rhoncus efficitur lacus, eget semper risus
                    tincidunt sed. Praesent a gravida nunc. Nulla dapibus
                    aliquet laoreet.
                </Paragraph>
            </div>
            <div
                bind:this={rightPart2}
                class="absolute top-0 left-0 right-0 bottom-0 opacity-0 translate-x-20 transition-all duration-500 flex justify-center flex-col"
            >
                <SectionHeading title="Part 2" subtitle="How does it work?" />
                <Paragraph size="xl">
                    Suspendisse rhoncus efficitur lacus, eget semper risus
                    tincidunt sed. Praesent a gravida nunc. Nulla dapibus
                    aliquet laoreet.
                </Paragraph>
            </div>
            <div
                bind:this={rightPart3}
                class="absolute top-0 left-0 right-0 bottom-0 opacity-0 translate-x-20 transition-all duration-500 flex justify-center flex-col"
            >
                <SectionHeading title="Part 3" subtitle="Conclusion" />
                <Paragraph size="xl">
                    Suspendisse rhoncus efficitur lacus, eget semper risus
                    tincidunt sed. Praesent a gravida nunc. Nulla dapibus
                    aliquet laoreet.
                </Paragraph>
            </div>
        </div>
    </Section>
</div>
