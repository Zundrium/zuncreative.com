<script lang="ts">
import MdiMenu from "~icons/mdi/menu";
import MdiClose from "~icons/mdi/close";
import MdiPhone from "~icons/mdi/phone";
import MdiArrowDown from "~icons/mdi/arrow-down";

import Button from "$lib/components/ui/Button.svelte";
import { slide, fade } from "svelte/transition";
import { onMount } from "svelte";
import H3 from "$lib/components/typography/H3.svelte";
import Paragraph from "$lib/components/typography/Paragraph.svelte";
import { page } from "$app/stores";

const navLinks = [
	// { name: "Showcase", href: "/#showcase" },
	{ name: "Blog", href: "/blog" },
	{ name: "Showcase", href: "/#showcase" },
	{
		name: "Services",
		subMenuId: "services",
		subMenu: [
			{ name: "Service #1", href: "/" },
			{ name: "Service #2", href: "/" },
			{ name: "Service #3", href: "/" },
		],
	},
];

let initialized: boolean = false;
let activeSubmenu: string | null = null;
const mainNavTransparent =
	"bg-gradient-to-b from-black/60 to-transparent text-white";
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

function showSubmenu(menuKey: string) {
	activeSubmenu = menuKey;
}

function hideSubmenu() {
	activeSubmenu = null;
}

function toggleMobileNav() {
	mobileNavOpen = !mobileNavOpen;
}

function hideMobileNav() {
	mobileNavOpen = false;
}

function handleKeyDown(event: KeyboardEvent, menuKey?: string) {
	if (event.key === "Enter" || event.key === " ") {
		event.preventDefault();
		menuKey ? showSubmenu(menuKey) : toggleMobileNav();
	}
	if (event.key === "Escape") {
		activeSubmenu = null;
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

$: submenu = navLinks.find((link) => link.subMenuId === activeSubmenu)?.subMenu;
</script>

<!-- Bind scrollY from the window -->
<svelte:window bind:scrollY />

<!-- <div -->
<!-- 	class="hidden md:flex relative z-10 bg-white/30 h-8 dark:bg-black/30 text-slate-300 w-full flex items-center justify-center" -->
<!-- > -->
<!-- 	<div class="container flex px-4 py-2 justify-between text-xs"> -->
<!-- 		<nav aria-label="top left navigation"> -->
<!-- 			<ul class="flex gap-8"> -->
<!-- 				<li> -->
<!-- 					<a href="#" class="hover:text-slate-100">Left link #1</a> -->
<!-- 				</li> -->
<!-- 				<li> -->
<!-- 					<a href="#" class="hover:text-slate-100">Left link #2</a> -->
<!-- 				</li> -->
<!-- 			</ul> -->
<!-- 		</nav> -->
<!-- 		<nav aria-label="top right navigation"> -->
<!-- 			<ul class="flex gap-8"> -->
<!-- 				<li> -->
<!-- 					<a href="#" class="hover:text-slate-100">Right link #1</a> -->
<!-- 				</li> -->
<!-- 				<li> -->
<!-- 					<a href="#" class="hover:text-slate-100">Right link #2</a> -->
<!-- 				</li> -->
<!-- 				<li> -->
<!-- 					<a href="#" class="hover:text-slate-100">Right link #3</a> -->
<!-- 				</li> -->
<!-- 			</ul> -->
<!-- 		</nav> -->
<!-- 	</div> -->
<!-- </div> -->

<header
	bind:this={navbar}
	use:setupNavbar
	class="sticky flex flex-col items-center z-50 top-0 left-0 right-0"
>
	<div
		class="{navbarClass} w-full transition-colors duration-300 flex justify-center h-24 -mb-24"
	>
		<div
			class="container px-4 py-6 lg:py-3 flex flex-col lg:flex-row justify-between items-center max-h-svh {mobileNavOpen
				? 'h-svh'
				: ''}"
		>
			<div class="w-full lg:w-auto flex justify-between items-center">
				<a href="/" class="cursor-pointer relative w-14 h-14" aria-label="Home">
					 <object class="absolute pointer-events-none inset-0 w-full h-full duration-500 {isOpaque ? 'opacity-100' : 'opacity-0'}" data="/svg/logo.svg" type="image/svg+xml" title="Zun Creative Logo"></object>
					 <object class="absolute pointer-events-none inset-0 w-full h-full duration-500 {isOpaque ? 'opacity-0' : 'opacity-100'}" data="/svg/logo-white.svg" type="image/svg+xml" title="Zun Creative Logo"></object>
				</a
				>
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

			<nav
				aria-label="primary navigation"
				class="transition-height transition-opacity duration-300 justify-center w-full lg:w-auto lg:pb-0 text-xl md:text-lg h-full overflow-auto lg:overflow-hidden {mobileNavOpen
					? ''
					: 'hidden'} lg:flex"
				id="mobile-nav"
			>
				<ul
					class="flex flex-col lg:flex-row gap-2 lg:gap-8 2xl:gap-12 items-center justify-center h-full"
				>
					{#each navLinks as navLink}
						<li
							class="flex flex-col flex-none items-center w-full lg:w-auto lg:border-none border-black/10 dark:border-white/10 py-2"
						>
							{#if navLink.subMenu}
								<button
									class="cursor-pointer flex py-2 items-center font-bold md:font-medium"
									on:mouseenter={() =>
										showSubmenu(navLink.subMenuId)}
									on:keydown={(e) =>
										handleKeyDown(e, navLink.subMenuId)}
									aria-haspopup="true"
									aria-expanded={activeSubmenu ===
										navLink.subMenuId}
									aria-controls={`submenu-${navLink.subMenuId}`}
								>
									{navLink.name}
									<MdiArrowDown
										class="hidden lg:flex size-4 transition-transform duration-300 {activeSubmenu ===
										navLink.subMenuId
											? 'rotate-180'
											: 'rotate-0'}"
										aria-hidden="true"
									/>
								</button>
								<ul
									id={`submenu-${navLink.subMenuId}`}
									class="flex flex-col lg:hidden items-center"
									role="menu"
									aria-label={`${navLink.name} Submenu`}
								>
									{#each navLink.subMenu as subMenuLink}
										<li
											role="none"
											class="flex flex-auto items-center"
										>
											<a
												href={subMenuLink.href}
												class="p-1 lg:p-2 hover:underline"
												role="menuitem"
											>
												{subMenuLink.name}
											</a>
										</li>
									{/each}
								</ul>
							{:else}
								<a
									class="cursor-pointer flex py-2 hover:underline items-center gap-2 {currentSection ===
									navLink.href
										? 'font-bold'
										: ''}"
									on:click={hideMobileNav}
									href={navLink.href}
								>
									{navLink.name}
								</a>
							{/if}
						</li>
					{/each}
				</ul>
			</nav>
			<Button
				href="/#contact"
				class="hidden! lg:flex!"
				ariaLabel="Call to Action Button"
				iconLeft={MdiPhone}
			>
				Contact
			</Button>
		</div>
	</div>

	{#if submenu}
		<div
			class="hidden md:flex w-full bg-white dark:bg-slate-800 p-4 justify-center text-black dark:text-white"
			transition:slide={{ duration: 300, axis: "y" }}
		>
			<div class="grid grid-cols-3 gap-4">
				{#each submenu as item}
					<div
						class="{activeSubmenu === 'products'
							? 'bg-blue-100'
							: 'bg-green-100'} dark:bg-blue-900 p-4 rounded"
					>
						<H3>{item.name}</H3>
						<Paragraph size="sm"
							>Detailed description or list of products</Paragraph
						>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</header>

<!-- <div
	class="fixed top-0 right-0 bottom-0 left-0 bg-black/60 z-40 backdrop-blur-xs transition-opacity-visibility {mobileNavOpen
		? 'visible opacity-100'
		: 'hidden opacity-0'}"
	aria-hidden="true"
	on:click={hideMobileNav}
></div> -->

<div
	class="fixed top-0 right-0 bottom-0 left-0 bg-black/30 z-40 backdrop-blur-xs transition--opacity-visibility duration-300
		{activeSubmenu !== null ? 'visible opacity-100' : 'invisible opacity-0'}"
	aria-hidden="true"
	on:mouseenter={hideSubmenu}
></div>
