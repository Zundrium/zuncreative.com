import { loadMarkdownFiles } from "$lib/utils/markdown";
import { languageTag } from "$lib/paraglide/runtime";

export async function load({ parent }) {
	const { posts, showcaseItems } = await parent();

	// Optionally do something specific for the page
	return { posts, showcaseItems };
}

export const prerender = true;
