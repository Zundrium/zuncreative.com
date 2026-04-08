import { gsap, type GSAPTween } from "gsap";

// icons to use
// We need to use the ?raw import for SVG strings as in the original
import MaterialSymbolsOpenInNew from "~icons/material-symbols/open-in-new?raw";
import MaterialSymbolsFullscreen from "~icons/material-symbols/fullscreen?raw";
import MaterialSymbolsOpenInFull from "~icons/material-symbols/open-in-full?raw";
import MaterialSymbolsArrowRightAlt from "~icons/material-symbols/arrow-right-alt?raw";

export class CircleCursor {
    private cursorElement: HTMLElement;
    private scrollIndicator: HTMLElement;
    private iconContainer: HTMLElement;
    private iconElements: Record<string, HTMLElement> = {};
    private currentIconType: string | null = null;
    private isHovering: boolean = false;
    private isScrolling: boolean = false;
    private hasIcon: boolean = false;
    private lastMouseX: number = 0;
    private lastMouseY: number = 0;
    private currentPointerElement: HTMLElement | null = null;
    private currentScrollElement: HTMLElement | null = null;
    private scrollAnimation: GSAPTween | null = null;
    private iconAnimations: Record<string, GSAPTween> = {};
    private size: number = 20;

    // Icon mapping
    private iconMap: Record<string, string> = {
        "open-external": MaterialSymbolsOpenInNew,
        fullscreen: MaterialSymbolsFullscreen,
        "open-in-full": MaterialSymbolsOpenInFull,
        "arrow-right": MaterialSymbolsArrowRightAlt,
    };

    constructor() {
        this.cursorElement = this.createCursorElement();
        this.scrollIndicator = this.createScrollIndicator();
        this.iconContainer = this.createIconContainer();
        this.createAllIcons();
        this.cursorElement.appendChild(this.scrollIndicator);
        this.cursorElement.appendChild(this.iconContainer);
        this.init();
    }

    private createCursorElement(): HTMLElement {
        const cursor = document.createElement("div");
        cursor.style.cssText = `
			position: fixed;
			width: ${this.size}px;
			height: ${this.size}px;
			background-color: white;
			border-radius: 50%;
			pointer-events: none;
			z-index: 9999;
			transform: translate(-50%, -50%);
			mix-blend-mode: difference;
		`;
        cursor.id = "custom-cursor";
        return cursor;
    }

    private createScrollIndicator(): HTMLElement {
        const dot = document.createElement("div");
        dot.style.cssText = `
			width: ${this.size / 2}px;
			height: ${this.size / 2}px;
			background-color: orange;
			border-radius: 50%;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -150%);
			opacity: 0;
			pointer-events: none;
		`;
        return dot;
    }

    private createIconContainer(): HTMLElement {
        const container = document.createElement("div");
        container.style.cssText = `
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			pointer-events: none;
			display: flex;
			align-items: center;
			justify-content: center;
			width: ${this.size / 1.5}px;
			height: ${this.size / 1.5}px;
			color: black;
			z-index: 1;
		`;
        return container;
    }

    private createAllIcons(): void {
        // Create all icon elements once
        Object.entries(this.iconMap).forEach(([iconType, iconSvg]) => {
            const iconElement = document.createElement("div");
            iconElement.innerHTML = iconSvg;
            iconElement.style.cssText = `
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%) scale(0);
				opacity: 0;
				width: ${this.size / 1.5}px;
				height: ${this.size / 1.5}px;
				display: flex;
				align-items: center;
				justify-content: center;
				pointer-events: none;
			`;

            // Style the SVG inside
            const svgElement = iconElement.querySelector("svg");
            if (svgElement) {
                svgElement.style.cssText = `
					width: 100%;
					height: 100%;
					fill: currentColor;
				`;
            }

            this.iconElements[iconType] = iconElement;
            this.iconContainer.appendChild(iconElement);
        });
    }

    private init(): void {
        document.body.appendChild(this.cursorElement);
        document.body.style.cursor = "none";
        this.addGlobalCursorStyle();
        this.addEventListeners();
    }

    private addGlobalCursorStyle(): void {
        let styleElement = document.getElementById(
            "custom-cursor-style",
        ) as HTMLStyleElement;
        if (!styleElement) {
            styleElement = document.createElement("style");
            styleElement.id = "custom-cursor-style";
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = ".cursor-pointer { cursor: none !important; }";
    }

    private addEventListeners(): void {
        document.addEventListener("mousemove", this.handleMouseMove.bind(this));
        document.addEventListener("scroll", this.handleScroll.bind(this), true);
    }

    private handleMouseMove(e: MouseEvent): void {
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        this.updateCursorPosition();
        this.updateHoverState();
    }

    private handleScroll(): void {
        this.updateCursorPosition();
        this.updateHoverState();
    }

    private updateCursorPosition(): void {
        this.cursorElement.style.left = `${this.lastMouseX}px`;
        this.cursorElement.style.top = `${this.lastMouseY}px`;
    }

    private updateHoverState(): void {
        const elementUnderCursor = document.elementFromPoint(
            this.lastMouseX,
            this.lastMouseY,
        ) as HTMLElement | null;
        const newPointerElement = this.findPointerElement(elementUnderCursor);
        const newScrollElement = this.findScrollElement(elementUnderCursor);

        // Scroll state
        if (newScrollElement !== this.currentScrollElement) {
            if (this.currentScrollElement && !newScrollElement) {
                this.isScrolling = false;
                this.animateToNormalState();
            }
            if (newScrollElement && !this.isScrolling) {
                this.isScrolling = true;
                this.isHovering = false;
                this.hideAllIcons(); // Force hide all icons
                this.animateToScrollState();
            }
            this.currentScrollElement = newScrollElement;
        }

        // Pointer state
        if (newPointerElement !== this.currentPointerElement) {
            if (this.currentPointerElement && !newPointerElement) {
                this.isHovering = false;
                this.hideAllIcons(); // Force hide all icons
                this.animateScale(1);
            }
            if (newPointerElement && !this.isScrolling) {
                this.isHovering = true;
                const iconType = newPointerElement.getAttribute("data-cursor-icon");
                this.showIcon(iconType);
                this.animateScale(2.8);
            }
            this.currentPointerElement = newPointerElement;
        }

        // Additional safety check: if we're not hovering and not scrolling, ensure no icons are visible
        if (!this.isHovering && !this.isScrolling && this.hasIcon) {
            this.hideAllIcons();
        }
    }

    private findScrollElement(element: HTMLElement | null): HTMLElement | null {
        while (element && element !== document.body) {
            if (element.classList.contains("cursor-scroll")) return element;
            element = element.parentElement;
        }
        return null;
    }

    private findPointerElement(element: HTMLElement | null): HTMLElement | null {
        while (element && element !== document.body) {
            if (element.classList.contains("cursor-pointer")) return element;
            element = element.parentElement;
        }
        return null;
    }

    private showIcon(iconType: string | null): void {
        // First, hide all icons
        this.hideAllIcons();

        // Show new icon if it exists
        if (iconType && this.iconElements[iconType]) {
            this.currentIconType = iconType;
            this.hasIcon = true;

            // Kill any existing animation for this icon
            if (this.iconAnimations[iconType]) {
                this.iconAnimations[iconType].kill();
            }

            // Animate icon in
            this.iconAnimations[iconType] = gsap.fromTo(
                this.iconElements[iconType],
                {
                    scale: 0,
                    opacity: 0,
                },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.3,
                    delay: 0.1,
                    ease: "back.out(1.7)",
                },
            );
        } else {
            // No icon to show
            this.currentIconType = null;
            this.hasIcon = false;
        }
    }

    private hideAllIcons(): void {
        // Kill all existing icon animations
        Object.values(this.iconAnimations).forEach((animation) => {
            if (animation) animation.kill();
        });
        this.iconAnimations = {};

        // Hide all icons immediately
        Object.values(this.iconElements).forEach((iconElement) => {
            gsap.set(iconElement, {
                scale: 0,
                opacity: 0,
            });
        });

        this.hasIcon = false;
        this.currentIconType = null;
    }

    private hideIcon(): void {
        this.hideAllIcons(); // Use the more robust hideAllIcons method
    }

    private animateScale(scale: number): void {
        gsap.to(this.cursorElement, {
            scale,
            duration: 0.3,
            ease: "power2.out",
        });
    }

    private animateToScrollState(): void {
        gsap.to(this.cursorElement, {
            height: this.size * 3 + "px",
            width: this.size * 2 + "px",
            borderRadius: "99999px",
            duration: 0.3,
            ease: "power2.out",
        });

        // Show scroll indicator
        gsap.set(this.scrollIndicator, { opacity: 1, y: 0 });

        // Animate scroll gesture (vertical bounce)
        setTimeout(() => {
            this.scrollAnimation = gsap.to(this.scrollIndicator, {
                transform: "translate(-50%, -150%)",
                duration: 1,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        });
    }

    private animateToNormalState(): void {
        gsap.to(this.cursorElement, {
            scale: 1,
            height: this.size,
            width: this.size,
            borderRadius: "50%",
            duration: 0.3,
            ease: "power2.out",
        });

        // Hide scroll indicator
        gsap.to(this.scrollIndicator, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
                // Clear animation
                if (this.scrollAnimation) {
                    this.scrollAnimation.kill();
                    this.scrollAnimation = null;
                }
                gsap.set(this.scrollIndicator, { y: 0 });
            },
        });
    }

    public destroy(): void {
        // Kill all animations
        Object.values(this.iconAnimations).forEach((animation) => {
            if (animation) animation.kill();
        });

        if (this.scrollAnimation) {
            this.scrollAnimation.kill();
        }

        document.removeEventListener("mousemove", this.handleMouseMove.bind(this));
        document.removeEventListener("scroll", this.handleScroll.bind(this), true);

        if (this.cursorElement.parentNode) {
            this.cursorElement.parentNode.removeChild(this.cursorElement);
        }

        const styleElement = document.getElementById("custom-cursor-style");
        if (styleElement) {
            styleElement.remove();
        }

        document.body.style.cursor = "auto";
    }

    public setColor(color: string): void {
        this.cursorElement.style.backgroundColor = color;
    }

    public setSize(size: number): void {
        this.size = size;
        this.cursorElement.style.width = `${size}px`;
        this.cursorElement.style.height = `${size}px`;
    }

    public setHoverScale(scale: number): void {
        if (this.isHovering) {
            this.animateScale(scale);
        }
    }

    public setBlendMode(blendMode: string): void {
        this.cursorElement.style.mixBlendMode = blendMode;
    }

    public addCustomIcon(name: string, iconSvg: string): void {
        this.iconMap[name] = iconSvg;

        // Create the icon element
        const iconElement = document.createElement("div");
        iconElement.innerHTML = iconSvg;
        iconElement.style.cssText = `
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%) scale(0);
			opacity: 0;
			width: 20px;
			height: 20px;
			display: flex;
			align-items: center;
			justify-content: center;
			pointer-events: none;
		`;

        // Style the SVG inside
        const svgElement = iconElement.querySelector("svg");
        if (svgElement) {
            svgElement.style.cssText = `
				width: 100%;
				height: 100%;
				fill: currentColor;
			`;
        }

        this.iconElements[name] = iconElement;
        this.iconContainer.appendChild(iconElement);
    }
}

export default CircleCursor;
