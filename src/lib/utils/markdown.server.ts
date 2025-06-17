import { readdir, readFile } from "fs/promises";
import { join } from "path";
import type { MarkdownTextfile } from "$lib/utils/types";
import { compile as svelteCompile } from "svelte/compiler";
import matter from "gray-matter";
import markdownit from "markdown-it";
import hljs from "highlight.js"; // https://highlightjs.org

async function parseMarkdownFromFile(
	filePath: string,
	slug: string,
): Promise<MarkdownTextfile | null> {
	try {
		const fileContent = await readFile(filePath, "utf-8");

		const result: any = matter(fileContent);

		if (!result || !result.data) {
			console.error(`Failed to preprocess markdown: ${filePath}`);
			return null;
		}

		const metadata: any = result.data || {};

		if (!metadata) {
			console.error(`No frontmatter found: ${filePath}`);
		}

		const md = markdownit({
			html: true,
			highlight: function (str: string, lang: string) {
				if (lang && hljs.getLanguage(lang)) {
					try {
						return (
							'<pre><code class="hljs">' +
							hljs.highlight(str, { language: lang, ignoreIllegals: true })
								.value +
							"</code></pre>"
						);
					} catch (__) {}
				}

				return (
					'<pre><code class="hljs">' +
					md.utils.escapeHtml(str) +
					"</code></pre>"
				);
			},
		});

		const html = md.render(result.content);

		return {
			title: metadata.title,
			publish_date: metadata.publish_date,
			modify_date: metadata.modify_date,
			description: metadata.description,
			slug: slug,
			keywords:
				metadata.keywords?.toLowerCase().replace(/\s/g, "").split(",") || [],
			header_image: metadata.header_image,
			header_image_position: metadata.header_image_position,
			mobile: metadata.mobile,
			featured: metadata.featured,
			video: metadata.video,
			external_url: metadata.external_url,
			gallery: metadata.gallery,
			partner_brand: metadata.partner_brand,
			html: html,
		};
	} catch (error) {
		console.error(`Error parsing markdown file ${filePath}:`, error);
		return null;
	}
}

export async function loadMarkdownFiles(
	category: string,
	language: string,
	limit?: number,
): Promise<MarkdownTextfile[]> {
	const markdownFiles: MarkdownTextfile[] = [];

	try {
		const assetsPath = join(
			process.cwd(),
			"src",
			"lib",
			"assets",
			category,
			language,
		);
		const files = await readdir(assetsPath);

		for (const file of files) {
			if (file.endsWith(".md")) {
				const filePath = join(assetsPath, file);
				const slug = file.replace(".md", "");
				const markdownFile = await parseMarkdownFromFile(filePath, slug);
				if (markdownFile) {
					markdownFiles.push(markdownFile);
				}
			}
		}
	} catch (error) {
		console.error(
			`Error loading markdown files for ${category}/${language}:`,
			error,
		);
		return [];
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
	try {
		const filePath = join(
			process.cwd(),
			"src",
			"lib",
			"assets",
			category,
			language,
			`${slug}.md`,
		);
		return await parseMarkdownFromFile(filePath, slug);
	} catch (error) {
		console.error(`Error loading markdown file ${slug}:`, error);
		return undefined;
	}
}
