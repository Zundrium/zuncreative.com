<script lang="ts">
import MdiArrowDown from "~icons/mdi/arrow-down";

let element: HTMLElement;

function onclick() {
	window.scrollTo({
		left: 0,
		top: element.offsetTop + element.clientHeight,
		behavior: "smooth",
	});
}
</script>

<button
	bind:this={element}
	aria-label="Scroll to next section"
	{onclick}
	class="cursor-pointer absolute bottom-0 size-14 lg:size-20 pt-2 lg:pt-4 flex items-center justify-center z-20 text-white bg-white dark:bg-black rounded-t-full"
>
	<MdiArrowDown
		class="size-6 lg:size-8 animate-bounce text-black dark:text-white"
	/>
</button>
