<script lang="ts">
import { onMount } from "svelte";
import TablerBrightnessFilled from "~icons/tabler/brightness-filled";

// --- State Management ---

// 1. The user's explicit preference ('light', 'dark', or 'system').
// We read from localStorage on initialization, otherwise default to 'system'.
let themePreference = $state(
	(typeof window !== "undefined" && localStorage.getItem("theme")) || "system",
);

// 2. A reactive state for the OS-level color scheme preference.
// This will automatically update if the user changes their OS theme.
let systemPrefersDark = $state(false);

// 3. A derived state that computes the *effective* theme. This is the single
// source of truth for what theme is currently active.
const isDark = $derived(
	themePreference === "dark" ||
		(themePreference === "system" && systemPrefersDark),
);

// --- Side Effects ---

// This effect runs whenever `isDark` changes, applying the correct
// class to the root <html> element to trigger CSS changes.
$effect(() => {
	// Ensure this only runs in the browser
	if (typeof document !== "undefined") {
		document.documentElement.classList.toggle("dark", isDark);
	}
});

// This effect synchronizes the user's choice with localStorage.
$effect(() => {
	if (themePreference === "system") {
		// If the user is on the system theme, we don't need a stored value.
		localStorage.removeItem("theme");
	} else {
		// Otherwise, save their explicit choice.
		localStorage.setItem("theme", themePreference);
	}
});

// --- Lifecycle ---

// We use onMount to safely access browser-only APIs like window.matchMedia.
onMount(() => {
	const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

	// Set the initial value
	systemPrefersDark = mediaQuery.matches;

	// Listen for changes in the OS theme
	const listener = (e: MediaQueryListEvent) => {
		systemPrefersDark = e.matches;
	};
	mediaQuery.addEventListener("change", listener);

	// Cleanup the listener when the component is destroyed
	return () => {
		mediaQuery.removeEventListener("change", listener);
	};
});

// --- Event Handlers ---

function toggleTheme() {
	// When the user clicks, we explicitly set their preference.
	// This moves them away from the 'system' default.
	themePreference = isDark ? "light" : "dark";
}
</script>

<button
	onclick={toggleTheme}
	class="cursor-pointer text-black dark:text-white transition-colors"
	aria-label="Switch to {isDark ? 'light' : 'dark'} theme"
>
	<!--
    The icon's rotation is controlled by the `isDark` state.
    - When `isDark` is false (light theme), `rotate-180` is applied.
    - `transition-transform` and `duration-300` create a smooth animation.
  -->
	<TablerBrightnessFilled
		class="size-6 transition-transform duration-300 {isDark ? '' : 'rotate-180'}"
	/>
</button>
