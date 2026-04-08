<script lang="ts">
import { onMount } from "svelte";
import MdiMoonAndStars from "~icons/mdi/moon-and-stars";
import MdiWhiteBalanceSunny from "~icons/mdi/white-balance-sunny";
import MdiLaptop from "~icons/mdi/laptop";

let activeTheme: string = $state("system");
let mediaQuery: any;

function applyTheme(theme: string) {
	const classList = document.documentElement.classList;
	classList.toggle("dark", theme == "dark");
}

function applySystemTheme() {
	applyTheme(mediaQuery.matches ? "dark" : "light");
}

onMount(() => {
	mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

	const storedName: string | null = localStorage.getItem("theme");
	if (storedName) {
		activeTheme = storedName;
		applyTheme(storedName);
	} else {
		applySystemTheme();
	}

	mediaQuery.addEventListener("change", () => {
		if (activeTheme == null) {
			applySystemTheme();
		}
	});
});

$effect(() => {
	if (activeTheme === "system") {
		localStorage.removeItem("theme");
		applySystemTheme();
	} else {
		localStorage.setItem("theme", activeTheme);
		applyTheme(activeTheme);
	}
});
</script>

<div
    class="flex items-center gap-4"
>
    <button
        class="cursor-pointer duration-300 {activeTheme === 'system' ? 'opacity-100': 'opacity-50 hover:opacity-100'}"
        aria-label="Switch to system theme"
        onclick={() => {
            activeTheme = "system";
        }}
    >
        <MdiLaptop class="size-6 lg:size-4" />
    </button>
    <button
        class="cursor-pointer duration-300 {activeTheme === 'light' ? 'opacity-100': 'opacity-50 hover:opacity-100'}"
        aria-label="Switch to light theme"
        onclick={() => {
            activeTheme = "light";
        }}
    >
        <MdiWhiteBalanceSunny class="size-6 lg:size-4" />
    </button>
    <button
        class="cursor-pointer duration-300 {activeTheme === 'dark' ? 'opacity-100': 'opacity-50 hover:opacity-100'}"
        aria-label="Switch to dark theme"
        onclick={() => {
            activeTheme = "dark";
        }}
    >
        <MdiMoonAndStars class="size-6 lg:size-4" />
    </button>
</div>

