<script module lang="ts">
const social_images: any = import.meta.glob(
	["../assets/images/**/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}"],
	{
		eager: true,
		query: {
			enhanced: true,
			format: "jpeg",
			w: "1200",
			h: "630",
		},
	},
);

const domain = import.meta.env.VITE_DOMAIN;

const get_social_image = (desired_image: string) => {
	return `https://${domain}${social_images[`../assets${desired_image}`].default.img.src}`;
};
</script>

<script lang="ts">
import { formatDateToISO8601 } from "$lib/utils/formatDate";
import type { SeoHeadProps } from "$lib/utils/types";

const domain = import.meta.env.VITE_DOMAIN;

export let props: SeoHeadProps;

if (!props.datePublished) {
	props.datePublished = new Date().toISOString();
}

if (!props.dateModified) {
	props.dateModified = new Date().toISOString();
}
</script>

<svelte:head>
	<title>{props.title}</title>
	<meta name="description" content={props.description} />
	<meta name="keywords" content={props.keywords} />

	<link rel="canonical" href="https://{domain}/{props.slug}" />

	<meta property="og:type" content={props.type.toLowerCase()} />
	<meta property="og:title" content={props.title} />
	<meta property="og:description" content={props.description} />
	<meta property="og:image" content={get_social_image(props.thumbnail)} />
	<meta property="og:image:type" content="image/jpeg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	{@html `<script type="application/ld+json"> 
{
"@context": "https://schema.org",
"@type": "${props.type}",
"headline": "${props.title}",
"keywords": "${props.keywords}",
"inLanguage": "nl-NL",
"image": "${get_social_image(props.thumbnail)}",
"genre": "3D Web Development",
"url": "https://${domain}/${props.slug}",
"description": "${props.description}",
"author": {
"@type": "Organization", 
"name": "${domain}",
"url": "https://${domain}"
},
"datePublished": "${formatDateToISO8601(props.datePublished!)}",
"dateModified": "${formatDateToISO8601(props.dateModified!)}",
"mainEntityOfPage": {
"@type": "WebPage",
"@id": "https://${domain}/${props.slug}"
}
} 
</script>`}
</svelte:head>
