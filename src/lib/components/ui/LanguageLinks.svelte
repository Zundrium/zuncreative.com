<script lang="ts">
import { page } from "$app/stores";
import { i18n } from "$lib/i18n";
import { availableLanguageTags, languageTag } from "$lib/paraglide/runtime";
import { onMount } from "svelte";

let clientLanguageTag: string | null = null;

onMount(() => {
	clientLanguageTag = languageTag();
});
</script>

{#if clientLanguageTag}
    <ul class="flex flex-row gap-6 lg:gap-4">
        {#each availableLanguageTags as lang}
            <li>
                <a
                    class="cursor-pointer"
                    href={i18n.route($page.url.pathname)}
                    hreflang={lang}
                    aria-current={lang === languageTag() ? "page" : undefined}
                >
                    <img
                        src="/svg/flags/{lang}.svg"
                        alt="{lang} flag"
                        class="w-6 lg:w-4 lg:h-3"
                    />
                </a>
            </li>
        {/each}
    </ul>
{/if}
