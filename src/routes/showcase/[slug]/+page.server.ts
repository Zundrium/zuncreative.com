import {
	loadMarkdownFile,
	loadMarkdownFiles,
} from "$lib/utils/markdown.server";
import { error } from "@sveltejs/kit";
import { languageTag } from "$lib/paraglide/runtime";

export const prerender = true;

export async function entries() {
	const pages = await loadMarkdownFiles("showcaseitems", languageTag());
	const routes = pages.map((page) => ({
		slug: page.slug,
	}));
	return routes;
}

export const load = async ({ params }) => {
	let { slug } = params;

	const item = await loadMarkdownFile("showcaseitems", languageTag(), slug);

	if (!item) {
		error(404, {
			message: "Not found",
		});
	}

	return {
		item,
		showcaseItems: await loadMarkdownFiles("showcaseitems", languageTag()),
	};
};
