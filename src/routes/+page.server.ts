export const prerender = true;

import { loadMarkdownFiles } from "$lib/utils/markdown.server";
import { languageTag } from "$lib/paraglide/runtime";

export async function load() {
	const lang = languageTag();

	const [posts, showcaseItems] = await Promise.all([
		loadMarkdownFiles("blogposts", lang, 4),
		loadMarkdownFiles("showcaseitems", lang),
	]);

	return {
		posts,
		showcaseItems,
	};
}
