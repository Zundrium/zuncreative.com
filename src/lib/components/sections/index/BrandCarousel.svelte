<script lang="ts">
	import { onMount } from "svelte";
	// Import the functions and interface from your updated brands.ts file
	import { getAllBrands, type Brand } from "$lib/utils/brands"; // Adjust path if necessary

	// Use our new global function to get all brands
	let brandNames: Brand[] = getAllBrands() as Brand[];

	// Pre-compute doubled array using the brandNames from our function
	let doubledBrands: Brand[] = [...brandNames, ...brandNames];

	// Preload images for better UX
	let imagesLoaded = false;

	onMount(() => {
		// Preload all brand images
		const imagePromises = brandNames.map(({ url }) => { // Destructure 'url' directly
			return new Promise<void>((resolve) => {
				const img = new Image();
				img.src = url; // Use the pre-computed URL
				img.onload = () => resolve();
				img.onerror = () => resolve(); // Don't fail on missing images
			});
		});

		Promise.allSettled(imagePromises).then(() => {
			imagesLoaded = true;
		});
	});
</script>

<div class="brand-carousel">
	<div class="scroll-container" class:loaded={imagesLoaded}>
		{#each doubledBrands as { name, height, url }, index (name + index)} 
			<img 
				src={url} 
				alt="{name} logo" 
				class="brand-logo {height}"
				loading="lazy"
				decoding="async"
			/>
		{/each}
	</div>
	
	<!-- Gradient overlays -->
	<!-- <div class="gradient-left" aria-hidden="true"></div> -->
	<!-- <div class="gradient-right" aria-hidden="true"></div> -->
</div>

<style>
	.brand-carousel {
		position: relative;
		overflow: hidden;
		padding: 2rem 0;
		background-color: black;
	}

	@media (min-width: 1024px) {
		.brand-carousel {
			padding: 3rem 0;
		}
	}

	@media (min-width: 1536px) {
		.brand-carousel {
			padding: 4rem 0;
		}
	}

	.scroll-container {
		display: flex;
		align-items: center;
		width: max-content;
		/* Use transform3d for hardware acceleration */
		animation: scroll 30s linear infinite;
		will-change: transform;
		/* Prevent layout shifts during animation */
		backface-visibility: hidden;
		/* Optimize for smooth animation */
		transform: translateZ(0);
	}

	.scroll-container.loaded {
		/* Only start animation after images are loaded */
		animation-play-state: running;
	}

	.brand-logo {
		width: auto;
		object-fit: contain;
		opacity: 0.3;
		flex-shrink: 0;
		margin-right: 3rem;
		transition: opacity 0.8s ease;
		/* Improve image rendering */
		image-rendering: -webkit-optimize-contrast;
		image-rendering: crisp-edges;
	}

	.brand-logo:hover {
		opacity: 0.7;
	}

	/* Dark mode support */
	@media (prefers-color-scheme: dark) {
		.brand-logo {
			filter: invert(1);
		}
	}

	.gradient-left,
	.gradient-right {
		position: absolute;
		top: 0;
		height: 100%;
		width: 6.25rem;
		pointer-events: none;
		z-index: 10;
	}

	@media (min-width: 768px) {
		.gradient-left,
		.gradient-right {
			width: 12.5rem;
		}
	}

	@media (min-width: 1024px) {
		.gradient-left,
		.gradient-right {
			width: 25rem;
		}
	}

	.gradient-left {
		left: 0;
		background: linear-gradient(to right, black, transparent);
	}

	.gradient-right {
		right: 0;
		background: linear-gradient(to left, black, transparent);
	}

	/* Light mode gradients */
	@media (prefers-color-scheme: light) {
		.gradient-left {
			background: linear-gradient(to right, white, transparent);
		}
		
		.gradient-right {
			background: linear-gradient(to left, white, transparent);
		}
	}

	@keyframes scroll {
		from {
			transform: translate3d(0, 0, 0);
		}
		to {
			transform: translate3d(-50%, 0, 0);
		}
	}

	/* Reduce motion for accessibility */
	@media (prefers-reduced-motion: reduce) {
		.scroll-container {
			animation-duration: 120s;
		}
	}
</style>
