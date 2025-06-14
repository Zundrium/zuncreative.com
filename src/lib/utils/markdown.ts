import type { MarkdownTextfile } from "$lib/utils/types";
import matter from "front-matter";
import { marked } from "marked";
import hljs from "highlight.js";

// Setup marked options for syntax highlighting
marked.setOptions({
	async: true,
	highlight: async (code, lang) => {
		if (hljs.getLanguage(lang)) {
			return hljs.highlight(code, { language: lang }).value;
		}

		return hljs.highlightAuto(code).value;
	},
});

// Import all markdown files under src/lib/assets (eagerly for sync access)
const allMarkdownFiles = import.meta.glob("/src/lib/assets/**/*.md", {
	as: "raw",
	eager: true,
});

// Parses frontmatter + markdown with highlighting
async function parseMarkdownContent(
	fileContent: string,
	slug: string,
): Promise<MarkdownTextfile | null> {
	try {
		const fm = matter<any>(fileContent);
		const metadata = fm.attributes || {};

		const html = (await marked.parse(fm.body)) as string;

		return {
			title: metadata.title,
			publish_date: metadata.publish_date,
			modify_date: metadata.modify_date,
			description: metadata.description,
			slug,
			keywords:
				typeof metadata.keywords === "string"
					? metadata.keywords.toLowerCase().replace(/\s/g, "").split(",")
					: [],
			header_image: metadata.header_image,
			header_image_position: metadata.header_image_position,
			mobile: metadata.mobile,
			featured: metadata.featured,
			video: metadata.video,
			external_url: metadata.external_url,
			gallery: metadata.gallery,
			partner_brand: metadata.partner_brand,
			html,
		};
	} catch (err) {
		console.error("Error parsing markdown:", slug, err);
		return null;
	}
}

/**
 * Load all markdown files in a specific category and language
 */
export async function loadMarkdownFiles(
	category: string,
	language: string,
	limit?: number,
): Promise<MarkdownTextfile[]> {
	const markdownFiles: MarkdownTextfile[] = [];

	for (const path in allMarkdownFiles) {
		// Normalize path and extract folder names and filename
		const relativePath = path.replace("/src/lib/assets/", "");
		const parts = relativePath.split("/");

		if (parts.length !== 3) continue;

		const [cat, lang, filename] = parts;

		if (cat !== category || lang !== language || !filename.endsWith(".md"))
			continue;

		const slug = filename.replace(".md", "");
		const fileContent = allMarkdownFiles[path] as string;

		const parsed = await parseMarkdownContent(fileContent, slug);
		if (parsed) markdownFiles.push(parsed);
	}

	// Sort by publish_date (descending)
	markdownFiles.sort(
		(a, b) =>
			new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime(),
	);

	// Apply limit if specified
	return limit ? markdownFiles.slice(0, limit) : markdownFiles;
}

/**
 * Load a single markdown file by slug
 */
export async function loadMarkdownFile(
	category: string,
	language: string,
	slug: string,
): Promise<MarkdownTextfile | undefined> {
	const path = `/src/lib/assets/${category}/${language}/${slug}.md`;

	const fileContent = allMarkdownFiles[path] as string | undefined;
	if (!fileContent) return undefined;

	return (await parseMarkdownContent(fileContent, slug)) || undefined;
}
