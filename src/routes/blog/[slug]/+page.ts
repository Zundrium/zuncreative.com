import { loadMarkdownFile, loadMarkdownFiles } from "$lib/utils/markdown";
import { error } from "@sveltejs/kit";
import { languageTag } from "$lib/paraglide/runtime";

export const prerender = true;

export async function entries() {
	const pages = await loadMarkdownFiles("blogposts", languageTag());
	const routes = pages.map((page) => ({
		slug: page.slug,
	}));
	return routes;
}

export const load = async ({ params }) => {
	const { slug } = params;

	const post = await loadMarkdownFile("blogposts", languageTag(), slug);

	if (!post) {
		error(404, {
			message: "Not found",
		});
	}

	return {
		post,
		posts: await loadMarkdownFiles("blogposts", languageTag(), 4),
	};
};
