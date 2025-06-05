export async function load({ parent }) {
	const { posts, showcaseItems } = await parent();

	return { posts, showcaseItems };
}

export const prerender = true;
