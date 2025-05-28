<script lang="ts">
//import "@fontsource-variable/inter";
//import "@fontsource-variable/dm-sans";
//import "@fontsource-variable/red-hat-display";

import "@fontsource-variable/noto-serif";
import "@fontsource-variable/noto-sans";
import "@fontsource-variable/noto-sans-display";
import "@fontsource-variable/noto-serif-display";

//import "@fontsource-variable/instrument-sans";
//import "@fontsource/instrument-serif";

import "../../src/lib/assets/styles/global.css";

import { i18n } from "$lib/i18n";
import Navbar from "$lib/components/ui/Navbar.svelte";
import Footer from "$lib/components/ui/Footer.svelte";
import { ParaglideJS } from "@inlang/paraglide-sveltekit";
let { children } = $props();
</script>

<ParaglideJS {i18n}>
	<Navbar />
	{@render children()}
	<Footer />
</ParaglideJS>
