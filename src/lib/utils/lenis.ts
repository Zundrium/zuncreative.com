// src/lib/lenis.ts
import Lenis from "lenis";
import { browser } from "$app/environment";
import { writable } from "svelte/store";

// Svelte store to hold the Lenis instance
export const lenisStore = writable<Lenis | null>(null);

let lenis: Lenis | null = null;

export function initLenis() {
	if (!browser) return;
	history.scrollRestoration = "manual";

	// Create Lenis instance
	lenis = new Lenis({
		duration: 1.2,
		easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
		orientation: "vertical",
		gestureOrientation: "vertical",
		smoothWheel: true,
		wheelMultiplier: 1,
		touchMultiplier: 2,
		infinite: false,
	});

	// Update the store
	lenisStore.set(lenis);

	// Animation loop
	function raf(time: number) {
		lenis?.raf(time);
		requestAnimationFrame(raf);
	}
	requestAnimationFrame(raf);

	return lenis;
}

export function destroyLenis() {
	if (lenis) {
		lenis.destroy();
		lenis = null;
		lenisStore.set(null);
	}
}

// Utility functions to use Lenis
export function scrollTo(target: string | number | HTMLElement, options?: any) {
	if (lenis) {
		lenis.scrollTo(target, options);
	}
}

export function scrollToTop() {
	if(lenis) {
		lenis.scrollTo(0, {immediate: true});
	}
}

export function scrollToElement(selector: string, options?: any) {
	if (!browser) return;
	const element = document.querySelector(selector);
	if (element) {
		scrollTo(element as HTMLElement, options);
	}
}

// Get current Lenis instance
export function getLenis(): Lenis | null {
	return lenis;
}

// Add scroll event listener
export function onScroll(callback: (data: any) => void) {
	if (lenis) {
		lenis.on("scroll", callback);
		return () => lenis?.off("scroll", callback);
	}
	return () => {};
}
