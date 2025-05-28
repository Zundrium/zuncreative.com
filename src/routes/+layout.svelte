<script lang="ts">
import { onMount } from "svelte";
import "@fontsource-variable/noto-serif";
import "@fontsource-variable/noto-sans";
import "@fontsource-variable/noto-sans-display";
import "@fontsource-variable/noto-serif-display";
import "../../src/lib/assets/styles/global.css";

import { i18n } from "$lib/i18n";
import Navbar from "$lib/components/ui/Navbar.svelte";
import Footer from "$lib/components/ui/Footer.svelte";
import { ParaglideJS } from "@inlang/paraglide-sveltekit";
let { children } = $props();

import Lenis from "lenis";
let lenis: Lenis;

onMount(() => {
	lenis = new Lenis({
		autoRaf: true,
	});
});
</script>

<ParaglideJS {i18n}>
	<Navbar />
	{@render children()}
	<Footer />
</ParaglideJS>
