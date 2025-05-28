import type { SvelteComponent } from 'svelte';

export interface SeoHeadProps {
	title: string;
	description: string;
	keywords: string;
	slug: string;
	thumbnail: string;
	type: "Article" | "WebPage" | "BlogPosting" | "Blog";
	datePublished?: string;
	dateModified?: string;
}

export interface MarkdownTextfile {
	title: string;
	publish_date: string;
	modify_date: string;
	description: string;
	slug: string;
	keywords: string;
	header_image: string;
	header_image_position: string;
	component: ConstructorOfATypedSvelteComponent;
}
