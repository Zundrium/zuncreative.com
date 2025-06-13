
<script lang="ts">
import MaterialSymbolsClose from "~icons/material-symbols/close";
import { onMount } from "svelte";
import { availableLanguageTags, languageTag } from "$lib/paraglide/runtime";
import Button from "./Button.svelte";
import Paragraph from "../typography/Paragraph.svelte";

// --- Configuration ---
const defaultLanguageTag = "nl"; // <-- The language that has NO prefix in the URL.
const languageNames: Record<string, string> = {
	en: "English",
	nl: "Dutch",
};
// ---------------------

const LOCAL_STORAGE_KEY = "language_suggestion_dismissed";

let showBanner = false;
let preferredLanguageTag: string | undefined = undefined;
let switchToUrl = "#";

onMount(() => {
	const isDismissed = localStorage.getItem(LOCAL_STORAGE_KEY) === "true";
	if (isDismissed) return;

	const browserLang = navigator.language?.split("-")[0];
	if (!browserLang) return;

	const currentLang = languageTag();
	const isAvailable = (availableLanguageTags as readonly string[]).includes(
		browserLang,
	);

	if (browserLang !== currentLang && isAvailable) {
		preferredLanguageTag = browserLang;
		showBanner = true;

		// --- NEW URL LOGIC ---
		// We calculate the URL here, inside onMount, once we know we need it.
		const currentPath = window.location.pathname;

		if (currentLang === defaultLanguageTag) {
			// We are on the default site (e.g., '/about') and need to switch to a prefixed one (e.g., '/en/about').
			// We need to prepend the language tag.
			// This handles both the root ('/') and subpages ('/about').
			switchToUrl = `/${preferredLanguageTag}${currentPath}`;
		} else {
			// We are on a prefixed site (e.g., '/en/about') and need to switch to another one.
			// This could be back to the default one or to another prefixed one.
			const newPath = currentPath.replace(
				`/${currentLang}`,
				preferredLanguageTag === defaultLanguageTag
					? ""
					: `/${preferredLanguageTag}`,
			);
			// Ensure root path is '/' instead of an empty string
			switchToUrl = newPath || "/";
		}
	}
});

function handleDismiss() {
	showBanner = false;
	localStorage.setItem(LOCAL_STORAGE_KEY, "true");
}

$: preferredLanguageName = preferredLanguageTag
	? languageNames[preferredLanguageTag]
	: "";
</script>

{#if showBanner && preferredLanguageTag}
	<div
		class="relative z-10 w-full flex items-center justify-center bg-orange-300 dark:bg-orange-700 text-black dark:text-white"
	>
		<div class="container flex items-center justify-center gap-2 lg:gap-6 px-6 py-4">
			<Paragraph size="sm" class="w-1/2 lg:w-auto">
				Your browser is set to {preferredLanguageName}. Would you like to switch to the {preferredLanguageName} version?
			</Paragraph>

			<Button
				class="flex-grow"
				href={switchToUrl}
				data-sveltekit-reload
			>
				Switch to {preferredLanguageName}
			</Button>

			<Button
				style="text"
				click={handleDismiss} >
				<MaterialSymbolsClose />
			</Button>
		</div>
	</div>
{/if}
