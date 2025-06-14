import { loadMarkdownFiles } from "$lib/utils/markdown";
import { languageTag } from "$lib/paraglide/runtime";

export async function load() {
	return { posts: await loadMarkdownFiles("blogposts", languageTag()) };
}

export const prerender = true;
