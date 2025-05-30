import { loadMarkdownFiles } from "$lib/utils/markdown";
import { languageTag } from "$lib/paraglide/runtime";

export async function load() {
	return {
		posts: await loadMarkdownFiles("blogposts", languageTag()),
		showcaseItems: await loadMarkdownFiles("showcaseitems", languageTag()),
	};
}

export const prerender = true;
