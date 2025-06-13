import { paraglide } from "@inlang/paraglide-sveltekit/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import Icons from "unplugin-icons/vite";
import tailwindcss from "@tailwindcss/vite";

const preloadCss = () => {
  return {
    name: 'sveltekit-css-preload',
    // We need to run this *after* SvelteKit has done its own transformations
    // to inject the initial <link rel="stylesheet"> tags.
    enforce: 'post',

    transformIndexHtml(html) {
      // Find all <link rel="stylesheet"> tags that have an href.
      // This regex is designed to be simple and effective for Vite's output.
      const stylesheetRegex = /<link rel="stylesheet" [^>]*href="([^"]+)"[^>]*>/g;

      const preloadedHtml = html.replace(stylesheetRegex, (match, href) => {
        // 'match' is the full <link> tag, e.g., <link rel="stylesheet" href="/_app/immutable/assets/app.1234.css">
        // 'href' is the captured URL part, e.g., /_app/immutable/assets/app.1234.css

        // 1. Create the <link rel="preload"> tag
        const preloadLink = `<link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'">`;

        // 2. Create the <noscript> fallback
        // The original tag ('match') is a perfect fallback for non-JS users.
        const noscriptFallback = `<noscript>${match}</noscript>`;

        // 3. Return the combined new tags
        return `${preloadLink}\n${noscriptFallback}`;
      });

      return preloadedHtml;
    },
  };
};

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
		process.env.NODE_ENV === 'production' && preloadCss()
	],
});
