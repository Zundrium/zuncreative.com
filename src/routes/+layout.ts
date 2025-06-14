export const prerender = true;
export const ssr = true;
import { loadMarkdownFiles } from "$lib/utils/markdown.server";
import { languageTag } from "$lib/paraglide/runtime";

export async function load() {
	return {
		posts: await loadMarkdownFiles("blogposts", languageTag()),
		showcaseItems: await loadMarkdownFiles("showcaseitems", languageTag()),
	};
}
