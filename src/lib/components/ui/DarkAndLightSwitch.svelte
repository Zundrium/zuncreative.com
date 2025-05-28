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
    class="flex items-center bg-slate-200 dark:bg-white/5 rounded-full p-1 gap-1"
>
    <button
        class="p-1 lg:p-2 rounded-full cursor-pointer {activeTheme === 'system'
            ? 'bg-white dark:bg-black'
            : 'hover:bg-slate-300 dark:hover:bg-black'}"
        aria-label="Switch to system theme"
        onclick={() => {
            activeTheme = "system";
        }}
    >
        <MdiLaptop class="size-4" />
    </button>
    <button
        class="p-1 lg:p-2 rounded-full cursor-pointer {activeTheme === 'light'
            ? 'bg-white dark:bg-black'
            : 'hover:bg-slate-300 dark:hover:bg-black'}"
        aria-label="Switch to light theme"
        onclick={() => {
            activeTheme = "light";
        }}
    >
        <MdiWhiteBalanceSunny class="size-4" />
    </button>
    <button
        class="p-1 lg:p-2 rounded-full cursor-pointer {activeTheme === 'dark'
            ? 'bg-white dark:bg-black'
            : 'hover:bg-slate-300 dark:hover:bg-black'}"
        aria-label="Switch to dark theme"
        onclick={() => {
            activeTheme = "dark";
        }}
    >
        <MdiMoonAndStars class="size-4" />
    </button>
</div>

