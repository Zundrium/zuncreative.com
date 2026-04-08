// src/lib/utils/lenis.ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
// Svelte store import removed

let lenis: Lenis | null = null;

export function initLenis() {
    if (typeof window === 'undefined') return; // Browser check
    // Simple check for mobile (can be improved)
    if (window.innerWidth < 640) return;

    history.scrollRestoration = "manual";
    gsap.registerPlugin(ScrollTrigger);

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
    }
}

// Utility functions to use Lenis
export function scrollTo(target: string | number | HTMLElement, options?: any) {
    if (lenis) {
        lenis.scrollTo(target, options);
        setTimeout(() => {
            ScrollTrigger.refresh();
        });
    } else {
        window.scrollTo({ top: typeof target === 'number' ? target : 0, ...options });
    }
}

export function scrollToTop() {
    if (lenis) {
        lenis.scrollTo(0, { immediate: true });
        setTimeout(() => {
            ScrollTrigger.refresh();
        });
    } else {
        window.scrollTo(0, 0);
    }
}

export function scrollToElement(selector: string, options?: any) {
    if (typeof window === 'undefined') return;
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
    return () => { };
}
