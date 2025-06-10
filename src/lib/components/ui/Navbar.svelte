<script lang="ts">
import MdiMenu from "~icons/mdi/menu";
import MdiClose from "~icons/mdi/close";
import MdiPhone from "~icons/mdi/phone";

import Button from "$lib/components/ui/Button.svelte";
import { onMount } from "svelte";
import { page } from "$app/stores";
import DarkAndLightIcon from "./DarkAndLightIcon.svelte";

const navLinks: any[] = [
	// { name: "Showcase", href: "/#showcase" },
	{ name: "Over mij", href: "/#over-mij" },
	{ name: "Blog", href: "/blog" },
	{ name: "Showcase", href: "/#showcase" },
	{ name: "Contact", href: "/#contact", style: "line" },
];

let initialized: boolean = false;
const mainNavTransparent =
	"bg-transparent dark:bg-gradient-to-b dark:from-black/70 dark:to-transparent text-black dark:text-white";
const mainNavOpaque = "bg-white dark:bg-black text-black dark:text-white";
let mobileNavOpen = false;
let navbar: HTMLElement;

let scrollY = 0;
$: isHome = $page.url.pathname === "/";
$: isOpaque =
	(!isHome && scrollY > 50) || (isHome && scrollY > 3500) || mobileNavOpen;
$: navbarClass = isOpaque ? mainNavOpaque : mainNavTransparent;

let currentSection = "";
let sections: NodeListOf<HTMLElement>;

// Simple throttle to avoid too many updates
function throttle(callback: Function, limit = 100) {
	let waiting = false;
	return function (...args: any[]) {
		if (!waiting) {
			callback(...args);
			waiting = true;
			setTimeout(() => {
				waiting = false;
			}, limit);
		}
	};
}
const throttledUpdateCurrentSection = throttle(updateCurrentSection, 100);

function toggleMobileNav() {
	mobileNavOpen = !mobileNavOpen;
}

function hideMobileNav() {
	mobileNavOpen = false;
}

function handleKeyDown(event: KeyboardEvent, menuKey?: string) {
	if (event.key === "Enter" || event.key === " ") {
		event.preventDefault();
		toggleMobileNav();
	}
}

function updateCurrentSection() {
	if (!sections || !sections.length) return;
	const viewportMiddle = scrollY + window.innerHeight / 2;
	let found = false;
	for (let i = 0; i < sections.length; i++) {
		const section = sections[i];
		const sectionTop = section.offsetTop - 100;
		const sectionBottom = sectionTop + section.clientHeight;
		if (viewportMiddle >= sectionTop && viewportMiddle <= sectionBottom) {
			currentSection = "/#" + section.id;
			found = true;
			break;
		}
	}
	if (!found) {
		currentSection = "";
	}
}

// Update a CSS variable for scroll-margin based on the navbar height
function setupNavbar(node: HTMLElement) {
	function updateNavbarScrollMargin() {
		document.documentElement.style.setProperty(
			"--navbar-scroll-margin",
			`${node.offsetHeight / 2}px`,
		);
	}
	updateNavbarScrollMargin();
	window.addEventListener("resize", updateNavbarScrollMargin);
	return {
		destroy() {
			window.removeEventListener("resize", updateNavbarScrollMargin);
		},
	};
}

onMount(() => {
	sections = document.querySelectorAll("section");
	updateCurrentSection();
	initialized = true;
});

// Reactively update the current section when scrollY changes.
$: if (sections) {
	throttledUpdateCurrentSection();
}
</script>

<!-- Bind scrollY from the window -->
<svelte:window bind:scrollY />

<header
	bind:this={navbar}
	use:setupNavbar
	class="sticky flex flex-col items-center z-50 top-0 left-0 right-0"
>
	<div
		class="{navbarClass} w-full transition-colors duration-300 flex justify-center h-24 -mb-24 {mobileNavOpen
				? 'h-dvh bg-white dark:bg-black'
				: 'bg-transparent'}"
	>
		<div
			class="container transition-colors duration-300 px-6 py-6 lg:py-3 flex flex-col lg:flex-row justify-between items-center max-h-dvh "
		>
			<div class="w-full flex items-center justify-between {mobileNavOpen ? 'flex-col h-dvh' : ''}">

				<div class="lg:flex-1 flex lg:h-full w-full items-center justify-between">
					<a href="/" class="cursor-pointer relative w-14 h-14" aria-label="Home" style="width: 56px; height: 56px; overflow: hidden;">
						<object class="absolute pointer-events-none inset-0 w-full h-full duration-300 {isOpaque ? 'opacity-100' : 'opacity-0'}" data="/svg/logo.svg" type="image/svg+xml" title="Zun Creative Logo"></object>
						<object class="absolute pointer-events-none inset-0 w-full h-full duration-300 invert dark:invert-0 {isOpaque ? 'opacity-0' : 'opacity-100'}" data="/svg/logo-white.svg" type="image/svg+xml" title="Zun Creative Logo"></object>
					</a>
<div class="lg:hidden">
						<DarkAndLightIcon />
					</div>
<button
					class="size-12 p-2 cursor-pointer lg:hidden"
					on:click={toggleMobileNav}
					on:keydown={handleKeyDown}
					aria-label={mobileNavOpen
						? "Close Navigation Menu"
						: "Open Navigation Menu"}
					aria-expanded={mobileNavOpen}
					aria-controls="mobile-nav"
				>
					<div class="relative h-full w-full">
						<span class="sr-only"
						>{mobileNavOpen ? "Close" : "Open"} Menu</span
						>
						<MdiMenu
							class="absolute left-0 top-0 h-full w-full transition-transform duration-300 {mobileNavOpen
								? 'scale-0 rotate-180'
								: 'scale-100 rotate-0'}"
						/>
						<MdiClose
							class="absolute left-0 top-0 h-full w-full transition-transform duration-300 {mobileNavOpen
								? 'scale-100 rotate-0'
								: 'scale-0 -rotate-180'}"
						/>
					</div>
				</button>
				</div>

				<div class="hidden lg:flex flex-none items-center justify-center h-full">
					<DarkAndLightIcon />
				</div>



				<nav
					aria-label="primary navigation"
					class="flex-1 transition-opacity duration-300 justify-center items-center text-xl md:text-base h-full {mobileNavOpen
						? 'flex flex-col items-center w-full'
						: 'hidden'} lg:flex"
					id="mobile-nav"
				>
					<ul
						class="flex flex-col lg:flex-row gap-2 lg:gap-4 items-center justify-center h-full"
					>
						{#each navLinks as navLink}
							<li
								class="flex flex-col flex-none items-center w-full lg:w-auto lg:border-none border-black/10 dark:border-white/10 py-2"
							>
								<Button
									style="{navLink.style || 'text'}"
									click={() => {hideMobileNav()}}
									href={navLink.href}
								>
									{navLink.name}
								</Button>
							</li>
						{/each}
					</ul>

					
				</nav>
				

			</div>
		</div>
	</div>
</header>

<!-- <div
class="fixed top-0 right-0 bottom-0 left-0 bg-black/60 z-40 backdrop-blur-xs transition-opacity-visibility {mobileNavOpen
? 'visible opacity-100'
: 'hidden opacity-0'}"
aria-hidden="true"
on:click={hideMobileNav}
></div> -->

