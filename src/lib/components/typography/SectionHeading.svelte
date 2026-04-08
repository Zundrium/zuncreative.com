<script lang="ts">
import { onMount } from "svelte";
import H2 from "./H2.svelte";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { viewportFade } from "$lib/utils/viewportSwitchClass";

let className = "";
let titleElement: HTMLElement;
let hgroupElement: HTMLElement;

export let centered: boolean = false;
export let title: string;
export let href: string | null = null;
export let subtitle: string;
export let animationDelay: number = 0;
export let animationDuration: number = 1;
export let stagger: number = 0.1;
export { className as class };

onMount(() => {
	// Register GSAP plugins
	gsap.registerPlugin(ScrollTrigger, SplitText);

	const splitElements: any[] = [];

	// Function to create split text reveal effect
	const createSplitReveal = (element: any) => {
		const split = new SplitText(element, { type: "lines" });
		splitElements.push(split);

		// Wrap each line in a div with overflow hidden for the reveal effect
		split.lines.forEach((line) => {
			gsap.set(line, {
				overflow: "hidden",
				position: "relative",
			});

			// Create inner element for the sliding animation
			const inner = document.createElement("div");
			inner.innerHTML = line.innerHTML;
			line.innerHTML = "";
			line.appendChild(inner);

			// Set initial state - slide up and fade
			gsap.set(inner, {
				y: "100%",
				opacity: 0,
			});
		});

		return split;
	};

	// Create the reveal animation
	const tl = gsap.timeline({
		scrollTrigger: {
			trigger: hgroupElement,
			start: "top 80%",
			end: "bottom 20%",
			toggleActions: "play none none reverse",
		},
	});

	// Then animate each line of the title
	if (titleElement) {
		const splitTitle = createSplitReveal(titleElement);

		tl.to(
			splitTitle.lines.map((line) => line.firstChild),
			{
				y: "0%",
				opacity: 1,
				duration: animationDuration,
				stagger: stagger,
				ease: "power2.out",
				delay: animationDelay,
			},
		);
	}

	// Cleanup function
	return () => {
		ScrollTrigger.getAll().forEach((trigger) => {
			if (trigger.trigger === hgroupElement) {
				trigger.kill();
			}
		});
		splitElements.forEach((split) => split.revert());
	};
});
</script>

<hgroup
    bind:this={hgroupElement}
    class="relative flex flex-col gap-2 {className} {centered
        ? 'text-center'
        : ''}"
>
	<div class="flex flex-row w-full gap-8 items-center justify-center" use:viewportFade>
    <span 
        class="uppercase text-sm text-neutral-700 dark:text-neutral-300"
    >
        {subtitle}
    </span>
	</div>
    
    {#if href}
        <a {href}>
            <div bind:this={titleElement}>
                <H2>{@html title}</H2>
            </div>
        </a>
    {:else}
        <div bind:this={titleElement}>
            <H2 class="transition-transform duration-700">{@html title}</H2>
        </div>
    {/if}
</hgroup>
