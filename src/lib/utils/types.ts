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
	keywords: string[];
	gallery?: string[];
	header_image: string;
	header_image_position: string;
	external_url?: string;
	html: string;
	video?: string;
	mobile?: boolean;
	featured?: boolean;
	partner_brand?: string;
}
