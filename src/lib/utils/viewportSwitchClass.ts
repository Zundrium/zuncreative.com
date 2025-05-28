interface RegisteredElement {
	element: HTMLElement;
	inClasses: string[];
	outClasses: string[];
}

const registeredElements: RegisteredElement[] = [];
let observerInitialized = false;
let scrollListenerAttached = false;
let initTimeoutSet = false;
// Constant for visibility threshold (40%)
const VISIBILITY_THRESHOLD = 40;

/**
 * Create and initialize the Intersection Observer
 */
function initializeObserver(): void {
	if (observerInitialized) return;

	// Clear any pending timeout to avoid double initialization
	if (initTimeoutSet && (window as any).__viewportAnimationTimeout) {
		clearTimeout((window as any).__viewportAnimationTimeout);
		initTimeoutSet = false;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			// Process entries in batches with requestAnimationFrame to prevent layout thrashing
			requestAnimationFrame(() => {
				entries.forEach((entry) => {
					// Find the registered element data for this DOM element
					const elementData = registeredElements.find(
						(item) => item.element === entry.target,
					);

					if (!elementData) return;

					const { element, inClasses, outClasses } = elementData;

					if (entry.intersectionRatio >= VISIBILITY_THRESHOLD / 100) {
						element.classList.add(...inClasses);
						element.classList.remove(...outClasses);
					} else {
						element.classList.add(...outClasses);
						element.classList.remove(...inClasses);
					}
				});
			});
		},
		{
			threshold: [0, VISIBILITY_THRESHOLD / 100],
			rootMargin: "50px 0px", // Pre-load animations slightly before they come into view
		},
	);

	// Observe all existing elements
	registeredElements.forEach(({ element }) => {
		observer.observe(element);
	});

	observerInitialized = true;

	// Store the observer to allow for cleanup if needed
	(window as any).__viewportAnimationObserver = observer;

	// Now that Observer is initialized, we can remove the scroll listener
	if (scrollListenerAttached) {
		window.removeEventListener("scroll", onFirstScroll);
		scrollListenerAttached = false;
	}
}

/**
 * Handler for first scroll that sets a short timeout before initializing
 * This helps prevent lag during scrolling
 */
function onFirstScroll(): void {
	if (initTimeoutSet || observerInitialized) return;

	// Set a timeout to initialize slightly after scroll stops
	// This prevents performance issues when scrolling
	(window as any).__viewportAnimationTimeout = setTimeout(() => {
		initializeObserver();
		initTimeoutSet = false;
	}, 100); // Short delay prevents visible lag during scroll

	initTimeoutSet = true;
}

/**
 * Set up lazy initialization by attaching a scroll listener
 */
function setupLazyInitialization(): void {
	if (!scrollListenerAttached && !observerInitialized) {
		window.addEventListener("scroll", onFirstScroll, { passive: true });
		scrollListenerAttached = true;

		// Also initialize after a delay if user doesn't scroll
		// but only if not already initialized by other means
		(window as any).__viewportAnimationTimeout = setTimeout(() => {
			if (!observerInitialized) {
				initializeObserver();
			}
			initTimeoutSet = false;
		}, 1000);

		initTimeoutSet = true;
	}
}

/**
 * Register an element for viewport-based class switching
 */
export function viewportSwitchClass(
	element: HTMLElement,
	inClasses: string[],
	outClasses: string[],
): void {
	// Store the element
	registeredElements.push({ element, inClasses, outClasses });

	// If observer already exists, observe this new element
	if (observerInitialized && (window as any).__viewportAnimationObserver) {
		(window as any).__viewportAnimationObserver.observe(element);
	} else if (!scrollListenerAttached && !initTimeoutSet) {
		// Set up lazy initialization if not already done
		setupLazyInitialization();
	}
}

/**
 * Make an element slide in from the left when it enters the viewport
 */
export function viewportSlideInLeft(node: HTMLElement) {
	node.classList.add(
		"transition-opacity-transform",
		"transition-delay-300",
		"duration-1000",
	);
	viewportSwitchClass(
		node,
		["translate-x-0", "opacity-100"],
		["-translate-x-8", "opacity-0"],
	);
}

/**
 * Make an element slide in from the right when it enters the viewport
 */
export function viewportSlideInRight(node: HTMLElement) {
	node.classList.add(
		"transition-opacity-transform",
		"transition-delay-300",
		"duration-1000",
	);
	viewportSwitchClass(
		node,
		["translate-x-0", "opacity-100"],
		["translate-x-8", "opacity-0"],
	);
}

/**
 * Make an element slide in from the bottom when it enters the viewport
 */
export function viewportSlideInBottom(node: HTMLElement) {
	node.classList.add(
		"transition-opacity-transform",
		"transition-delay-300",
		"duration-1000",
	);
	viewportSwitchClass(
		node,
		["translate-x-0", "opacity-100"],
		["translate-y-8", "opacity-0"],
	);
}

/**
 * Make an element slide in from the top when it enters the viewport
 */
export function viewportSlideInTop(node: HTMLElement) {
	node.classList.add(
		"transition-opacity-transform",
		"transition-delay-300",
		"duration-1000",
	);
	viewportSwitchClass(
		node,
		["translate-x-0", "opacity-100"],
		["-translate-y-8", "opacity-0"],
	);
}

/**
 * Make an element fade in when it enters the viewport
 */
export function viewportFade(node: HTMLElement) {
	node.classList.add(
		"transition-opacity",
		"transition-delay-300",
		"duration-1500",
	);
	viewportSwitchClass(node, ["opacity-100"], ["opacity-0"]);
}

export function viewportScaleFromBottom(node: HTMLElement) {
	node.classList.add(
		"transition-transform",
		"transition-delay-300",
		"duration-1500",
		"origin-bottom",
	);
	viewportSwitchClass(node, ["scale-y-100"], ["scale-y-0"]);
}

export function viewportActive(node: HTMLElement) {
	viewportSwitchClass(node, ["active"], ["inactive"]);
}

/**
 * Force initialization immediately
 */
export function forceInitialize(): void {
	initializeObserver();
}

/**
 * Cleanup function to remove observers and event listeners
 */
export function cleanup(): void {
	if ((window as any).__viewportAnimationObserver) {
		(window as any).__viewportAnimationObserver.disconnect();
		observerInitialized = false;
	}

	if (scrollListenerAttached) {
		window.removeEventListener("scroll", onFirstScroll);
		scrollListenerAttached = false;
	}

	if (initTimeoutSet && (window as any).__viewportAnimationTimeout) {
		clearTimeout((window as any).__viewportAnimationTimeout);
		initTimeoutSet = false;
	}
}
