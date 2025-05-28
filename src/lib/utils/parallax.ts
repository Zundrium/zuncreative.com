/**
 * ParallaxHeight properties interface
 */
interface ParallaxElement {
    element: HTMLElement;
    inView: boolean;      // Whether element is currently in view
}

// Store for parallax elements
const parallaxElements: ParallaxElement[] = [];

// Animation settings
const PARALLAX_RANGE = 100;   // Maximum movement in pixels

/**
 * Update the position based on scroll position with direct setting (no animation)
 */
function updatePosition(item: ParallaxElement): void {
    if (!item.inView) {
        // If not in view, don't update
        return;
    }

    const rect = item.element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Calculate how far through the viewport the element is (0 to 1)
    // 0 = element at bottom of viewport, 1 = element at top of viewport
    const viewportPosition = 1 - ((rect.top + rect.height / 2) / viewportHeight);

    // Calculate position directly - no lerping
    const yPosition = -PARALLAX_RANGE + (viewportPosition * (PARALLAX_RANGE * 2));

    // Apply the transform directly
    item.element.style.transform = `translate3d(0, ${yPosition}px, 0)`;
}

/**
 * Initialize the parallax effect for an element
 */
export function parallaxHeight(node: HTMLElement): { destroy: () => void } {
    // Apply necessary CSS classes for performance
    node.classList.add(
        "will-change-transform"
    );

    // Removed transition class since we want immediate updates

    // Set transform-style through direct style
    node.style.transformStyle = "preserve-3d";

    // Position the element correctly initially
    node.style.transform = `translate3d(0, 0, 0)`;

    // Initialize the parallax element data - simplified since we don't need animation properties
    const parallaxItem: ParallaxElement = {
        element: node,
        inView: false
    };

    // Store the element
    parallaxElements.push(parallaxItem);

    // Create a dedicated observer for parallax effects
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.target === node) {
                    const wasInView = parallaxItem.inView;
                    parallaxItem.inView = entry.isIntersecting;

                    // Directly update the position
                    updatePosition(parallaxItem);

                    // Add scroll listener when element comes into view
                    if (!wasInView && entry.isIntersecting) {
                        window.addEventListener('scroll', onScroll, { passive: true });
                    }
                    // Remove scroll listener when element goes out of view
                    else if (wasInView && !entry.isIntersecting) {
                        window.removeEventListener('scroll', onScroll);
                    }
                }
            });
        },
        {
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], // Multiple thresholds for smoother tracking
            rootMargin: "50px 0px" // Extended margin to start effects earlier
        }
    );

    // Start observing
    observer.observe(node);

    // Scroll handler - directly updates position without animation
    function onScroll() {
        // Immediately update the position on scroll
        updatePosition(parallaxItem);
    }

    // Initialize by updating the position
    updatePosition(parallaxItem);

    // Return the cleanup function
    return {
        destroy() {
            // Stop observing
            observer.disconnect();

            // Remove from parallax elements array
            const index = parallaxElements.findIndex(item => item.element === node);
            if (index !== -1) {
                parallaxElements.splice(index, 1);
            }

            // Remove scroll listener
            window.removeEventListener('scroll', onScroll);
        }
    };
}