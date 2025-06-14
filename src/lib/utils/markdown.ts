import type { MarkdownTextfile } from "$lib/utils/types";
import matter from "front-matter";
import { marked } from "marked";
import hljs from "highlight.js";

// Setup marked for syntax highlighting
marked.setOptions({
	async: true,
	highlight: async (code: string, lang: string) => {
		if (lang && hljs.getLanguage(lang)) {
			return hljs.highlight(code, { language: lang }).value;
		}
		return code;
	},
});

// Load all markdown files (deferred)
const allMarkdown = import.meta.glob("/src/lib/assets/**/*.md", {
	as: "raw",
});

// Parse .md file content into usable post data
export async function parseMarkdownContent(
	fileContent: string,
	slug: string,
): Promise<MarkdownTextfile | null> {
	try {
		const fm = matter<any>(fileContent);
		const metadata = fm.attributes ?? {};
		const html = (await marked.parse(fm.body)) as string;

		return {
			title: metadata.title,
			publish_date: metadata.publish_date,
			modify_date: metadata.modify_date,
			description: metadata.description,
			slug,
			keywords:
				metadata.keywords?.toLowerCase().replace(/\s/g, "").split(",") ?? [],
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
		console.error("Error parsing markdown content:", err);
		return null;
	}
}

// Load .md files for a specific category & language
export async function loadMarkdownFiles(
	category: string,
	language: string,
	limit?: number,
): Promise<MarkdownTextfile[]> {
	const markdownFiles: MarkdownTextfile[] = [];

	for (const path in allMarkdown) {
		// Expect structure: /src/lib/assets/{category}/{language}/{slug}.md
		const relativePath = path.replace("/src/lib/assets/", ""); // e.g. showcaseitems/en/my-post.md
		const parts = relativePath.split("/");

		if (parts.length !== 3) continue;

		const [cat, lang, filename] = parts;

		if (cat !== category || lang !== language || !filename.endsWith(".md")) {
			continue;
		}

		const slug = filename.replace(/\.md$/, "");
		const fileContent = await allMarkdown[path](); // Deferred loading
		const parsed = await parseMarkdownContent(fileContent, slug);
		if (parsed) markdownFiles.push(parsed);
	}

	// Sort by publish date
	markdownFiles.sort(
		(a, b) =>
			new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime(),
	);

	return limit ? markdownFiles.slice(0, limit) : markdownFiles;
}

export async function loadMarkdownFile(
	category: string,
	language: string,
	slug: string,
): Promise<MarkdownTextfile | null> {
	// Construct the expected path based on the structure.
	// e.g., /src/lib/assets/blog/en/my-first-post.md
	const expectedPath = `/src/lib/assets/${category}/${language}/${slug}.md`;

	// Check if this path exists in our glob import.
	if (!(expectedPath in allMarkdown)) {
		return null; // File not found
	}

	// If the path exists, call the deferred loader function.
	const fileContent = await allMarkdown[expectedPath]();
	const parsed = await parseMarkdownContent(fileContent, slug);

	return parsed;
}
