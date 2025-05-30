import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface RegisteredElement {
	element: HTMLElement;
	scrollTrigger?: ScrollTrigger;
	timeline?: gsap.core.Timeline;
}

const registeredElements: RegisteredElement[] = [];
let scrollTriggerInitialized = false;

// Constant for visibility threshold (40%)
const VISIBILITY_THRESHOLD = "40%";

/**
 * Initialize ScrollTrigger
 */
function initializeScrollTrigger(): void {
	if (scrollTriggerInitialized) return;

	// ScrollTrigger is ready to use immediately
	scrollTriggerInitialized = true;

	// Refresh ScrollTrigger to ensure all triggers are properly set up
	ScrollTrigger.refresh();
}

/**
 * Create a GSAP animation with ScrollTrigger
 */
function createScrollAnimation(
	element: HTMLElement,
	fromVars: gsap.TweenVars,
	toVars: gsap.TweenVars,
	duration: number = 1,
	delay: number = 0.3,
): void {
	// Initialize ScrollTrigger if not already done
	if (!scrollTriggerInitialized) {
		initializeScrollTrigger();
	}

	// Set initial state
	gsap.set(element, fromVars);

	// Create timeline for the animation
	const tl = gsap.timeline({
		scrollTrigger: {
			trigger: element,
			start: "top 80%", // Start when top of element hits 80% down the viewport
			end: "bottom 20%", // End when bottom of element hits 20% down the viewport
			toggleActions: "play none none reverse",
		},
	});

	// Add the animation to timeline
	tl.to(element, {
		...toVars,
		duration,
		delay,
		ease: "power2.out",
	});

	// Store the registered element
	registeredElements.push({
		element,
		timeline: tl,
		scrollTrigger: tl.scrollTrigger as ScrollTrigger,
	});
}

/**
 * Register an element for viewport-based class switching
 */
export function viewportSwitchClass(
	element: HTMLElement,
	inClasses: string[],
	outClasses: string[],
): void {
	// Initialize ScrollTrigger if not already done
	if (!scrollTriggerInitialized) {
		initializeScrollTrigger();
	}

	// Apply initial out classes
	element.classList.add(...outClasses);
	element.classList.remove(...inClasses);

	// Create ScrollTrigger for this element
	const trigger = ScrollTrigger.create({
		trigger: element,
		start: "top 80%", // More aggressive trigger point
		end: "bottom 20%",
		onEnter: () => {
			element.classList.add(...inClasses);
			element.classList.remove(...outClasses);
		},
		onLeave: () => {
			element.classList.add(...outClasses);
			element.classList.remove(...inClasses);
		},
		onEnterBack: () => {
			element.classList.add(...inClasses);
			element.classList.remove(...outClasses);
		},
		onLeaveBack: () => {
			element.classList.add(...outClasses);
			element.classList.remove(...inClasses);
		},
	});

	// Store the registered element
	registeredElements.push({
		element,
		scrollTrigger: trigger,
	});
}

/**
 * Make an element slide in from the left when it enters the viewport
 */
export function viewportSlideInLeft(node: HTMLElement): void {
	createScrollAnimation(
		node,
		{ x: -32, opacity: 0 }, // from state
		{ x: 0, opacity: 1 }, // to state
		1, // duration
		0.3, // delay
	);
}

/**
 * Make an element slide in from the right when it enters the viewport
 */
export function viewportSlideInRight(node: HTMLElement): void {
	createScrollAnimation(
		node,
		{ x: 32, opacity: 0 },
		{ x: 0, opacity: 1 },
		1,
		0.3,
	);
}

/**
 * Make an element slide in from the bottom when it enters the viewport
 */
export function viewportSlideInBottom(node: HTMLElement): void {
	createScrollAnimation(
		node,
		{
			y: 40,
			opacity: 0,
			rotationZ: 0,
			rotationX: 10,
			rotationY: 1,
			transformPerspective: 1000,
		},
		{
			y: 0,
			opacity: 1,
			rotationZ: 0,
			rotationX: 0,
			rotationY: 0,
		},
		1.5,
		0.3,
	);
}

export function viewportSlideInBottomDirect(node: HTMLElement): void {
	createScrollAnimation(
		node,
		{ y: 32, opacity: 0 },
		{ y: 0, opacity: 1 },
		1,
		0.3,
	);
}

/**
 * Make an element slide in from the top when it enters the viewport
 */
export function viewportSlideInTopDirect(node: HTMLElement): void {
	createScrollAnimation(
		node,
		{ y: -32, opacity: 0 },
		{ y: 0, opacity: 1 },
		1,
		0.3,
	);
}

export function viewportSlideInTop(node: HTMLElement): void {
	createScrollAnimation(
		node,
		{
			y: -40,
			opacity: 0,
			rotationZ: -3,
			rotationX: 5,
			rotationY: 1,
			transformPerspective: 1000,
		},
		{
			y: 0,
			opacity: 1,
			rotationZ: 0,
			rotationX: 0,
			rotationY: 0,
		},
		1.5,
		0.3,
	);
}

/**
 * Make an element fade in when it enters the viewport
 */
export function viewportFade(node: HTMLElement): void {
	createScrollAnimation(node, { opacity: 0 }, { opacity: 1 }, 1.5, 0.3);
}

export function viewportScaleFromBottom(node: HTMLElement): void {
	createScrollAnimation(
		node,
		{ scaleY: 0, transformOrigin: "bottom center" },
		{ scaleY: 1 },
		1.5,
		0.3,
	);
}

export function viewportActive(node: HTMLElement): void {
	viewportSwitchClass(node, ["active"], ["inactive"]);
}

/**
 * Force initialization immediately
 */
export function forceInitialize(): void {
	initializeScrollTrigger();
}

/**
 * Cleanup function to remove all ScrollTriggers
 */
export function cleanup(): void {
	// Kill all ScrollTriggers for registered elements
	registeredElements.forEach(({ scrollTrigger, timeline }) => {
		if (scrollTrigger) {
			scrollTrigger.kill();
		}
		if (timeline) {
			timeline.kill();
		}
	});

	// Clear the registered elements array
	registeredElements.length = 0;

	// Kill all ScrollTriggers globally (optional - use with caution)
	// ScrollTrigger.killAll();

	scrollTriggerInitialized = false;
}

/**
 * Refresh ScrollTrigger (useful after DOM changes)
 */
export function refresh(): void {
	ScrollTrigger.refresh();
}

/**
 * Batch refresh ScrollTrigger (more performant for multiple DOM changes)
 */
export function batchRefresh(): void {
	ScrollTrigger.batch(
		registeredElements.map((item) => item.element),
		{
			onEnter: (elements) => ScrollTrigger.refresh(),
			once: true,
		},
	);
}
