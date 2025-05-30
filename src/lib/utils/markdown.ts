import type { MarkdownTextfile } from "$lib/utils/types";

const modules: any = import.meta.glob(["../assets/**/*.md"]);

async function parseMarkdown(
	file: any,
	slug: string = "",
): Promise<MarkdownTextfile> {
	const fileContents = await file();
	return {
		title: fileContents.metadata.title,
		publish_date: fileContents.metadata.publish_date,
		modify_date: fileContents.metadata.modify_date,
		description: fileContents.metadata.description,
		slug: slug,
		keywords: fileContents.metadata.keywords,
		header_image: fileContents.metadata.header_image,
		header_image_position: fileContents.metadata.header_image_position,
		mobile: fileContents.metadata.mobile,
		featured: fileContents.metadata.featured,
		component: fileContents.default,
	};
}

export async function loadMarkdownFiles(
	category: string,
	language: string,
	limit?: number,
): Promise<MarkdownTextfile[]> {
	const markdownFiles: MarkdownTextfile[] = [];

	for (const filePath of Object.keys(modules)) {
		if (!filePath.includes(category) || !filePath.includes(language)) {
			continue;
		}
		const file = modules[filePath];
		markdownFiles.push(
			await parseMarkdown(file, filePath.split("/").pop()!.split(".")[0]),
		);
	}

	markdownFiles.sort(
		(a, b) =>
			new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime(),
	);

	if (limit) {
		return markdownFiles.slice(0, limit);
	}
	return markdownFiles;
}

export async function loadMarkdownFile(
	category: string,
	language: string,
	slug: string,
): Promise<MarkdownTextfile | undefined> {
	const filePath = `../assets/${category}/${language}/${slug}.md`;

	if (filePath in modules) {
		const file = modules[filePath];
		return await parseMarkdown(file, slug);
	}
	return undefined;
}
