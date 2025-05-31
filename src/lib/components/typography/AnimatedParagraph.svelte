<script lang="ts">
import { onMount } from "svelte";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

let className = "";
let paragraphElement: HTMLElement;
export { className as class };

export let size: "sm" | "md" | "lg" | "xl" = "md";

const sizeStyles = {
	xs: "text-xs lg:text-xs/3 2xl:text-xs/4",
	sm: "text-xs/4 lg:text-sm/5 2xl:text-base/6",
	md: "text-base/6 lg:text-lg/7",
	lg: "text-lg/7 lg:text-lg/8",
	xl: "text-lg/7 lg:text-xl/8 xl:text-2xl/9",
};

onMount(() => {
	gsap.registerPlugin(SplitText);
	gsap.registerPlugin(ScrollTrigger);

	const split = new SplitText(paragraphElement, { type: "words" });

	gsap.from(split.words, {
		scrollTrigger: {
			trigger: paragraphElement,
			start: "top 80%",
			end: "bottom 20%",
			toggleActions: "play none none reverse",
		},
		duration: 1,
		y: 30,
		autoAlpha: 0,
		stagger: 0.03,
	});
});
</script>

<p bind:this={paragraphElement} class="{sizeStyles[size]}  {className}">
	<slot />
</p>
