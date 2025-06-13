import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "@sveltejs/adapter-static";

const config = {
	preprocess: [vitePreprocess()],
	kit: {
		prerender: {
			handleHttpError: ({ status, path, referrer }) => {
				if (status === 404) {
					console.warn(
						`Prerender warning: ${status} at ${path} (linked from ${referrer}).`,
					);
					return;
				} else {
					throw new Error(
						`Prerender error: ${status} at ${path} (linked from ${referrer}).`,
					);
				}
			},
			handleMissingId: ({ status, path, referrer }) => {
				// console.warn(
				// 	`Prerender warning: ${status} at ${path} (linked from ${referrer}).`,
				// );
			},
		},
		adapter: adapter({
			fallback: "404.html",
			pages: "dist",
			assets: "dist",
		}),
	},

	extensions: [".svelte", ".md"],
};

export default config;
