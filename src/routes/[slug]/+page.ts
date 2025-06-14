import {
	loadMarkdownFile,
	loadMarkdownFiles,
} from "$lib/utils/markdown.server";
import { error } from "@sveltejs/kit";
import { languageTag } from "$lib/paraglide/runtime";

export const prerender = true;

export async function entries() {
	const pages = await loadMarkdownFiles("textpages", languageTag());
	const routes = pages.map((page) => ({
		slug: page.slug,
	}));
	return routes;
}

export const load = async ({ params }) => {
	const { slug } = params;
	const textpage = await loadMarkdownFile("textpages", languageTag(), slug);

	if (!textpage) {
		error(404, {
			message: "Not found",
		});
	}
	return textpage;
};
