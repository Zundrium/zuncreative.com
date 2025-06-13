<script lang="ts">
import { onDestroy } from "svelte";
import gsap from "gsap";
import type { ComponentType, SvelteComponent } from "svelte";

let classes = "";
export { classes as class };
export let href: string | undefined = undefined;
export let ariaLabel: string | undefined = undefined;
export let iconLeft: any = undefined;
export let iconRight: any = undefined;
export let style: "normal" | "text" | "line" | "secondary" = "line";
export let size: "sm" | "md" | "lg" = "md";
export let click: (() => void) | undefined = undefined;

let buttonEl: HTMLElement;
let maskEl: HTMLElement;
let iconLeftEl: HTMLElement | null = null;
let iconRightEl: HTMLElement | null = null;
let maskTween: gsap.core.Tween | null = null;

// Base classes for all buttons
let baseClasses = `${classes} text-center rounded-full cursor-pointer font-medium w-full relative inline-flex items-center justify-center transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 z-10`;

// Style variants
const styleClasses = {
	normal:
		"bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200 focus:ring-white dark:focus:ring-black focus:ring-offset-gray-900 dark:focus:ring-offset-white",
	secondary:
		"bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300 focus:ring-gray-500",
	text: "bg-transparent border-none text-black dark:text-white hover:text-white dark:hover:text-black  focus:ring-0",
	line: "bg-transparent border-2 border-black text-black dark:border-white dark:text-white hover:text-white dark:hover:text-black focus:ring-0",
};

// Size variants
const sizeClasses = {
	sm: "px-4 py-1.5 text-sm",
	md: "px-6 py-2.5 text-base",
	lg: "px-8 py-3.5 text-lg",
};

const iconClasses =
	"flex items-center justify-center transition-transform duration-300 w-[1.2em] h-[1.2em] z-20";

// Animation helpers
const animateIcons = (active: boolean) => {
	const x = active ? 4 : 0;
	if (iconLeft && iconLeftEl) gsap.to(iconLeftEl, { x: -x, duration: 0.3 });
	if (iconRight && iconRightEl) gsap.to(iconRightEl, { x, duration: 0.3 });
};

const setMaskPosition = (e: MouseEvent) => {
	const rect = buttonEl.getBoundingClientRect();
	return {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top,
	};
};

const startMaskAnimation = (size: number, duration: number, ease: string) => {
	if (maskTween) maskTween.kill();

	maskTween = gsap.to(maskEl, {
		width: size,
		height: size,
		duration,
		ease,
		onComplete: () => (maskTween = null),
	});
};

const handleMouseEnter = (e: MouseEvent) => {
	if (!buttonEl || !maskEl) return;

	// Get mouse position and set mask
	const { x, y } = setMaskPosition(e);
	gsap.set(maskEl, {
		left: x,
		top: y,
		width: 0,
		height: 0,
		opacity: 1,
	});

	// Calculate mask size
	const rect = buttonEl.getBoundingClientRect();
	const diagonal = Math.sqrt(rect.width ** 2 + rect.height ** 2);
	startMaskAnimation(diagonal * 2, 0.3, "power2.in");

	animateIcons(true);
};

const handleMouseLeave = (e: MouseEvent) => {
	if (!buttonEl || !maskEl) return;

	// Position mask at exit point
	const { x, y } = setMaskPosition(e);
	gsap.set(maskEl, { left: x, top: y });

	// Shrink animation
	startMaskAnimation(0, 0.5, "expo.out");
	maskTween?.eventCallback("onComplete", () => {
		gsap.set(maskEl, { opacity: 0 });
	});

	animateIcons(false);
};

onDestroy(() => maskTween?.kill());
</script>

<div class="relative overflow-hidden rounded-full">
    <svelte:element this={href ? "a": "button"}
        {...$$props}
        {href}
        aria-label={ariaLabel}
        class={`${baseClasses} ${styleClasses[style]} ${sizeClasses[size]}`}
        bind:this={buttonEl}
        on:mouseenter|stopPropagation={handleMouseEnter}
        on:mouseleave|stopPropagation={handleMouseLeave}
        on:click={click}
    >
        <div class="absolute rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none z-5 opacity-0 translate bg-black dark:bg-white" bind:this={maskEl}></div>
        <div class="relative z-10 flex items-center gap-1">
            {#if iconLeft}
                <div class={`${iconClasses} mr-1`} bind:this={iconLeftEl}>
                    <svelte:component this={iconLeft} />
                </div>
            {/if}
            <slot />
            {#if iconRight}
                <div class={`${iconClasses} ml-1`} bind:this={iconRightEl}>
                    <svelte:component this={iconRight} />
                </div>
            {/if}
        </div>
    </svelte:element>
</div>
