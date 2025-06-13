
<script lang="ts">
import { viewportParallaxImage } from "$lib/utils/viewportSwitchClass";

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

const imageMetaPromise = import(`../../assets${src}?enhanced&w=1280;640;250`);
const lqipPromise = import(`../../assets${src}?enhanced&lqip`);

export let parallax: boolean = false;
$: parallaxAction = parallax ? viewportParallaxImage : undefined;
</script>

<div class={classes} {...$$props}>
	<div class="w-full h-full relative" use:parallaxAction={parallax} >
		{#await lqipPromise then lqip}
		<enhanced:img
			loading="lazy"
			class="w-full h-full object-cover"
			src={lqip.default}
			sizes={imageSizes}
			{alt}
		/>
		{/await}
		{#await imageMetaPromise then imageMeta}
		<enhanced:img
			loading="lazy"
			class="absolute top-0 left-0 right-0 bottom-0 h-full w-full object-cover z-10"
			src={imageMeta.default}
			sizes={imageSizes}
			{alt}
		/>
		{/await}
	</div>
</div>