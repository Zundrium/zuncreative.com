import { paraglide } from "@inlang/paraglide-sveltekit/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import Icons from "unplugin-icons/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	mode: "production",
	plugins: [
		sveltekit(),
		tailwindcss(),
		enhancedImages(),
		Icons({
			compiler: "svelte",
		}),
		paraglide({
			project: "./project.inlang",
			outdir: "./src/lib/paraglide",
		}),
		visualizer({
			emitFile: true,
			filename: "stats.html",
		}),
	],
});
