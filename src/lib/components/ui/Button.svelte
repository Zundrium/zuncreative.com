
<script lang="ts">
import { onDestroy } from "svelte";
import gsap from "gsap";
import type { ComponentType, SvelteComponent } from "svelte";

export let href: string | undefined = undefined;
export let ariaLabel: string | undefined = undefined;
export let iconLeft: ComponentType<SvelteComponent> | undefined = undefined;
export let iconRight: ComponentType<SvelteComponent> | undefined = undefined;
export let style: "normal" | "text" | "line" | "secondary" = "normal";
export let size: "sm" | "md" | "lg" = "md";
export let click: (() => void) | undefined = undefined;

let buttonEl: HTMLElement;
let maskEl: HTMLElement;
let iconLeftEl: HTMLElement | null = null;
let iconRightEl: HTMLElement | null = null;
let maskTween: gsap.core.Tween | null = null;

// Base classes for all buttons
const baseClasses =
	"cursor-pointer font-medium w-full relative inline-flex items-center justify-center transition-colors duration-300 ease-[cubic-bezier(0.215,0.61,0.355,1)] rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 z-10";

// Style variants
const styleClasses = {
	normal:
		"bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200 focus:ring-white dark:focus:ring-black focus:ring-offset-gray-900 dark:focus:ring-offset-white",
	secondary:
		"bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300 focus:ring-gray-500",
	text: "bg-transparent border-none text-black dark:text-white focus:ring-0",
	line: "bg-transparent border-2 border-black text-black dark:border-white dark:text-white focus:ring-0",
};

// Size variants
const sizeClasses = {
	sm: "px-4 py-1.5 text-sm",
	md: "px-6 py-2.5 text-base",
	lg: "px-8 py-3.5 text-lg",
};

// Icon container classes
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
		xPercent: -50,
		yPercent: -50,
		width: 0,
		height: 0,
		opacity: 1,
	});

	// Set mask color based on style
	maskEl.style.backgroundColor = style === "normal" ? "#f97316" : "white";

	// Calculate mask size
	const rect = buttonEl.getBoundingClientRect();
	const diagonal = Math.sqrt(rect.width ** 2 + rect.height ** 2);
	startMaskAnimation(diagonal * 2, 0.3, "power2.in");

	// Style-specific effects
	if (style === "line" || style === "text") {
		gsap.to(buttonEl, { color: "#000000", duration: 0.2 });
	}

	animateIcons(true);
};

const handleMouseLeave = (e: MouseEvent) => {
	if (!buttonEl || !maskEl) return;

	// Position mask at exit point
	const { x, y } = setMaskPosition(e);
	gsap.set(maskEl, { left: x, top: y, xPercent: -50, yPercent: -50 });

	// Shrink animation
	startMaskAnimation(0, 0.5, "expo.out");
	maskTween?.eventCallback("onComplete", () => {
		gsap.set(maskEl, { opacity: 0, backgroundColor: "transparent" });
	});

	// Reset styles
	if (style === "line" || style === "text") {
		gsap.to(buttonEl, { color: "", duration: 0.3 });
	}

	animateIcons(false);
};

onDestroy(() => maskTween?.kill());
</script>

<style>
    .button-container {
        position: relative;
        overflow: hidden;
        border-radius: 9999px;
        display: inline-flex;
    }
    
    .mask {
        position: absolute;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 5;
        opacity: 0;
        transform-origin: center;
        background-color: transparent;
    }
    
    .content {
        position: relative;
        z-index: 10;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
</style>

{#if href}
    <div class="button-container">
        <a
            {href}
            {ariaLabel}
            class={`${baseClasses} ${styleClasses[style]} ${sizeClasses[size]}`}
            bind:this={buttonEl}
            on:mouseenter|stopPropagation={handleMouseEnter}
            on:mouseleave|stopPropagation={handleMouseLeave}
        >
            <div class="mask" bind:this={maskEl} />
            <div class="content">
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
        </a>
    </div>
{:else}
    <div class="button-container ">
        <button
            {ariaLabel}
            class={`${baseClasses} ${styleClasses[style]} ${sizeClasses[size]}`}
            bind:this={buttonEl}
            on:mouseenter|stopPropagation={handleMouseEnter}
            on:mouseleave|stopPropagation={handleMouseLeave}
            on:click|preventDefault={click}
        >
            <div class="mask" bind:this={maskEl} />
            <div class="content">
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
        </button>
    </div>
{/if}

