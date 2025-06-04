<script>
import { onMount } from "svelte";

export let slugHash;
export let penTitle = "";
export let user = "";
export let height = 300;
export let defaultTab = "html,result";
export let theme = "default";
export let editable = false;

let mounted = false;

onMount(() => {
	// Load CodePen embed script if not already loaded
	if (!window.__CPEmbed) {
		const script = document.createElement("script");
		script.src = "https://public.codepenassets.com/embed/index.js";
		script.async = true;
		document.head.appendChild(script);
	}
	mounted = true;
});
</script>

{#if mounted}
  <p 
    class="codepen" 
    data-height={height}
    data-default-tab={defaultTab}
    data-slug-hash={slugHash}
    data-pen-title={penTitle}
    data-user={user}
    data-theme-id={theme}
    data-editable={editable}
  >
    <span>
      See the Pen 
      <a href="https://codepen.io/{user}/pen/{slugHash}">{penTitle}</a> 
      by {user} (<a href="https://codepen.io/{user}">@{user}</a>)
      on <a href="https://codepen.io">CodePen</a>.
    </span>
  </p>
{/if}
