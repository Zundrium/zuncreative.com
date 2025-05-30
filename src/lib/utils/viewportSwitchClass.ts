import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface AnimationConfig {
	from: gsap.TweenVars;
	to: gsap.TweenVars;
	scrollTrigger?: {
		start?: string;
		end?: string;
		toggleActions?: string;
	};
}

function createViewportAnimation(
	node: HTMLElement,
	config: AnimationConfig,
): { destroy: () => void } {
	// Set initial state
	gsap.set(node, config.from);

	// Default ScrollTrigger settings
	const defaultScrollTrigger = {
		trigger: node,
		start: "top 80%",
		end: "bottom 20%",
		toggleActions: "play none none reverse",
		...config.scrollTrigger,
	};

	// Create timeline
	const tl = gsap.timeline({
		scrollTrigger: defaultScrollTrigger,
	});

	// Add animation
	tl.to(node, config.to);

	return {
		destroy() {
			ScrollTrigger.getAll().forEach((trigger) => {
				if (trigger.trigger === node) {
					trigger.kill();
				}
			});
		},
	};
}

export function viewportSlideInLeft(node: HTMLElement): {
	destroy: () => void;
} {
	return createViewportAnimation(node, {
		from: {
			x: -100,
			opacity: 0,
			rotationY: -15,
			transformPerspective: 1000,
			transformOrigin: "center center",
		},
		to: {
			x: 0,
			opacity: 1,
			rotationY: 0,
			duration: 0.8,
			ease: "power2.out",
		},
	});
}

export function viewportSlideInRight(node: HTMLElement): {
	destroy: () => void;
} {
	return createViewportAnimation(node, {
		from: {
			x: 100,
			opacity: 0,
			rotationY: 15,
			transformPerspective: 1000,
			transformOrigin: "center center",
		},
		to: {
			x: 0,
			opacity: 1,
			rotationY: 0,
			duration: 0.8,
			ease: "power2.out",
		},
	});
}

export function viewportSlideInBottom(node: HTMLElement): {
	destroy: () => void;
} {
	return createViewportAnimation(node, {
		from: {
			y: 50,
			opacity: 0,
			rotationX: 5,
			rotationZ: -1,
			transformPerspective: 1000,
			transformOrigin: "center bottom",
		},
		to: {
			y: 0,
			opacity: 1,
			rotationX: 0,
			rotationZ: 0,
			duration: 0.8,
			ease: "power2.out",
		},
	});
}

export function viewportSlideInBottomDirect(node: HTMLElement): {
	destroy: () => void;
} {
	return createViewportAnimation(node, {
		from: {
			y: 100,
			opacity: 0,
			rotationX: 20,
			transformPerspective: 1000,
			transformOrigin: "center bottom",
		},
		to: {
			y: 0,
			opacity: 1,
			rotationX: 0,
			duration: 1,
			ease: "power3.out",
		},
		scrollTrigger: {
			toggleActions: "play none none none",
		},
	});
}

export function viewportSlideInTopDirect(node: HTMLElement): {
	destroy: () => void;
} {
	return createViewportAnimation(node, {
		from: {
			y: -100,
			opacity: 0,
			rotationX: -20,
			transformPerspective: 1000,
			transformOrigin: "center top",
		},
		to: {
			y: 0,
			opacity: 1,
			rotationX: 0,
			duration: 1,
			ease: "power3.out",
		},
		scrollTrigger: {
			toggleActions: "play none none none",
		},
	});
}

export function viewportSlideInTop(node: HTMLElement): { destroy: () => void } {
	return createViewportAnimation(node, {
		from: {
			y: -50,
			opacity: 0,
			rotationX: -15,
			transformPerspective: 1000,
			transformOrigin: "center top",
		},
		to: {
			y: 0,
			opacity: 1,
			rotationX: 0,
			duration: 0.8,
			ease: "power2.out",
		},
	});
}

export function viewportFade(node: HTMLElement): { destroy: () => void } {
	return createViewportAnimation(node, {
		from: {
			opacity: 0,
			scale: 0.95,
		},
		to: {
			opacity: 1,
			scale: 1,
			duration: 1,
			ease: "power2.out",
		},
	});
}

export function viewportScaleFromBottom(node: HTMLElement): {
	destroy: () => void;
} {
	return createViewportAnimation(node, {
		from: {
			scale: 0.8,
			y: 50,
			opacity: 0,
			rotationX: 5,
			rotationZ: -1,
			transformPerspective: 1000,
			transformOrigin: "center bottom",
		},
		to: {
			scale: 1,
			y: 0,
			opacity: 1,
			rotationX: 0,
			rotationZ: 0,
			duration: 1,
			ease: "back.out(1.7)",
		},
	});
}

// Special case for viewportActive since it doesn't use GSAP animations
export function viewportActive(node: HTMLElement): { destroy: () => void } {
	const scrollTrigger = ScrollTrigger.create({
		trigger: node,
		start: "top 80%",
		end: "bottom 20%",
		onEnter: () => node.classList.add("active"),
		onLeave: () => node.classList.remove("active"),
		onEnterBack: () => node.classList.add("active"),
		onLeaveBack: () => node.classList.remove("active"),
	});

	return {
		destroy() {
			scrollTrigger.kill();
			node.classList.remove("active");
		},
	};
}
