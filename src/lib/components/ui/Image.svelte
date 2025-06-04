
<script module lang="ts">
import { viewportParallaxImage } from "$lib/utils/viewportSwitchClass";

const images: Record<string, any> = import.meta.glob(
	["../../assets/images/**/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}"],
	{
		eager: true,
		query: {
			enhanced: true,
			w: "1280;1024;640;400;250",
		},
	},
);

const lqips: Record<string, any> = import.meta.glob(
	["../../assets/images/**/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}"],
	{
		eager: true,
		query: {
			enhanced: true,
			w: "16",
			inline: true,
		},
	},
);

const getHighResImageSrc = (desired_image: string) => {
	const image = images[`../../assets${desired_image}`];
	if (!image) {
		throw new Error(
			`High-resolution image not found for path: ../../assets${desired_image}. Available images: ${Object.keys(images).join(", ")}`,
		);
	}
	return image.default;
};

const getLqipSrc = (desired_image: string) => {
	const lqip = lqips[`../../assets${desired_image}`];
	if (!lqip) {
		throw new Error(
			`LQIP image not found for path: ../../assets${desired_image}. Available images: ${Object.keys(lqips).join(", ")}`,
		);
	}
	return lqip.default;
};
</script>

<script lang="ts">
let classes: string = "";
export { classes as class };

export let thumb: boolean | null = null;
const thumbSizes =
	"(min-width: 1280px) 400px, (min-width: 768px) 300px, (min-width: 640px) 250px";
export let sizes =
	"(min-width: 1536px) 1536px, (min-width: 1280px) 1280px, (min-width: 1024px) 1024px, (min-width: 768px) 768px, (min-width: 640px) 640px";

$: imageSizes = thumb ? thumbSizes : sizes;
export let src;
export let alt = "";

const lqipSrc = getLqipSrc(src);
const fullSrc = getHighResImageSrc(src);

export let parallax: boolean = false;
$: parallaxAction = parallax ? viewportParallaxImage : undefined;
</script>

<div class={classes} {...$$props}>
	<div class="w-full h-full relative" use:parallaxAction={parallax} >
		<enhanced:img
			loading="lazy"
			class="w-full h-full object-cover"
			src={lqipSrc}
			sizes={imageSizes}
			{alt}
		/>
		<enhanced:img
			loading="lazy"
			class="absolute top-0 left-0 right-0 bottom-0 h-full w-full object-cover z-10"
			src={fullSrc}
			sizes={imageSizes}
			{alt}
		/>
	</div>
</div>
