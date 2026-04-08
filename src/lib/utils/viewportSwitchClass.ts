import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the ScrollTrigger plugin
// Note: In Astro client scripts, we need to ensure this runs only on client
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

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

export function viewportParallaxImage(node: HTMLElement): {
    destroy: () => void;
} {
    // Pre-scale the image to account for parallax movement
    gsap.set(node, {
        scale: 1.2,
        transformOrigin: "center center",
    });

    const scrollTrigger = ScrollTrigger.create({
        trigger: node.parentElement, // Use parent as trigger
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
            // Move element faster than scroll but with contained movement
            const yPos = (self.progress - 0.5) * -(node.clientHeight / 5); // Center the movement
            gsap.set(node, {
                y: yPos,
                ease: "none",
            });
        },
    });

    return {
        destroy() {
            scrollTrigger.kill();
            gsap.set(node, { y: 0, scale: 1 });
        },
    };
}

export function viewportParallaxSlow(node: HTMLElement): {
    destroy: () => void;
} {
    const scrollTrigger = ScrollTrigger.create({
        trigger: node,
        start: "top bottom",
        end: "bottom top",
        scrub: true, // Smooth scrubbing effect
        onUpdate: (self) => {
            // Move element slower than scroll (0.5x speed)
            const yPos = self.progress * -50;
            gsap.set(node, {
                y: yPos,
                ease: "none",
            });
        },
    });

    return {
        destroy() {
            scrollTrigger.kill();
            gsap.set(node, { y: 0 }); // Reset position
        },
    };
}

export function viewportParallaxFast(node: HTMLElement): {
    destroy: () => void;
} {
    const scrollTrigger = ScrollTrigger.create({
        trigger: node,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
            // Move element faster than scroll (1.5x speed)
            const yPos = self.progress * -150;
            gsap.set(node, {
                y: yPos,
                ease: "none",
            });
        },
    });

    return {
        destroy() {
            scrollTrigger.kill();
            gsap.set(node, { y: 0 });
        },
    };
}

export function viewportParallaxReverse(node: HTMLElement): {
    destroy: () => void;
} {
    const scrollTrigger = ScrollTrigger.create({
        trigger: node,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
            // Move element in opposite direction
            const yPos = self.progress * 100;
            gsap.set(node, {
                y: yPos,
                ease: "none",
            });
        },
    });

    return {
        destroy() {
            scrollTrigger.kill();
            gsap.set(node, { y: 0 });
        },
    };
}

export function viewportParallaxScale(node: HTMLElement): {
    destroy: () => void;
} {
    const scrollTrigger = ScrollTrigger.create({
        trigger: node,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
            // Scale and move based on scroll progress
            const progress = self.progress;
            const yPos = progress * -30;
            const scale = 1 + progress * 0.1;

            gsap.set(node, {
                y: yPos,
                scale: scale,
                ease: "none",
            });
        },
    });

    return {
        destroy() {
            scrollTrigger.kill();
            gsap.set(node, { y: 0, scale: 1 });
        },
    };
}

export function viewportParallaxRotate(node: HTMLElement): {
    destroy: () => void;
} {
    const scrollTrigger = ScrollTrigger.create({
        trigger: node,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
            // Rotate and move based on scroll progress
            const progress = self.progress;
            const yPos = progress * -40;
            const rotation = progress * 10;

            gsap.set(node, {
                y: yPos,
                rotation: rotation,
                ease: "none",
            });
        },
    });

    return {
        destroy() {
            scrollTrigger.kill();
            gsap.set(node, { y: 0, rotation: 0 });
        },
    };
}

// More advanced parallax with custom configuration
export function viewportParallaxCustom(
    node: HTMLElement,
    config: {
        speed?: number;
        direction?: "up" | "down";
        scale?: boolean;
        rotation?: boolean;
        opacity?: boolean;
    } = {},
): { destroy: () => void } {
    const {
        speed = 0.5,
        direction = "up",
        scale = false,
        rotation = false,
        opacity = false,
    } = config;

    const scrollTrigger = ScrollTrigger.create({
        trigger: node,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
            const progress = self.progress;
            const multiplier = direction === "up" ? -1 : 1;
            const yPos = progress * (100 * speed) * multiplier;

            const transforms: gsap.TweenVars = {
                y: yPos,
                ease: "none",
            };

            if (scale) {
                transforms.scale = 1 + progress * 0.2;
            }

            if (rotation) {
                transforms.rotation = progress * 15;
            }

            if (opacity) {
                transforms.opacity = 0.3 + progress * 0.7;
            }

            gsap.set(node, transforms);
        },
    });

    return {
        destroy() {
            scrollTrigger.kill();
            gsap.set(node, {
                y: 0,
                scale: 1,
                rotation: 0,
                opacity: 1,
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
            rotationX: 20,
            rotationZ: -3,
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
        },
        to: {
            opacity: 1,
            duration: 1,
            ease: "power1.out",
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

export function viewportRevealCircle(node: HTMLElement): {
    destroy: () => void;
} {
    // Add the base class
    node.classList.add("circle-reveal");

    // Set up ScrollTrigger
    const trigger = ScrollTrigger.create({
        trigger: node,
        start: "top 80%",
        onEnter: () => node.classList.add("open"),
        onLeave: () => node.classList.remove("open"),
        onEnterBack: () => node.classList.add("open"),
        onLeaveBack: () => node.classList.remove("open"),
    });

    return {
        destroy: () => {
            trigger.kill();
            node.classList.remove("circle-reveal", "open");
        },
    };
}

export function viewportRevealStripes(node: HTMLElement): {
    destroy: () => void;
} {
    // Add the base class
    node.classList.add("stripe-reveal");

    // Set up ScrollTrigger
    const trigger = ScrollTrigger.create({
        trigger: node,
        start: "top 80%",
        onEnter: () => node.classList.add("open"),
        onLeave: () => node.classList.remove("open"),
        onEnterBack: () => node.classList.add("open"),
        onLeaveBack: () => node.classList.remove("open"),
    });

    return {
        destroy: () => {
            trigger.kill();
            node.classList.remove("stripe-reveal", "open");
        },
    };
}
