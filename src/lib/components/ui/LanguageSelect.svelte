<script lang="ts">
    import { page } from "$app/stores";
    import { i18n } from "$lib/i18n";
    import { availableLanguageTags, languageTag } from "$lib/paraglide/runtime";
    import { onMount } from "svelte";

    let clientLanguageTag: string | null = null;

    onMount(() => {
        clientLanguageTag = languageTag();
    });

    let isDropdownOpen = false;

    function toggleDropdown() {
        isDropdownOpen = !isDropdownOpen;
    }

    function handleClickOutside(event: MouseEvent) {
        const dropdown = event.target as HTMLElement;
        if (!dropdown.closest(".language-dropdown")) {
            isDropdownOpen = false;
        }
    }
</script>

<svelte:window onclick={handleClickOutside} />

{#if clientLanguageTag}
    <div class="language-dropdown relative">
        <button
            class="flex uppercase items-center w-full px-4 py-2 bg-white"
            onclick={toggleDropdown}
        >
            <img
                src="/svg/flags/{clientLanguageTag}.svg"
                alt="{clientLanguageTag} flag"
                class="size-5 mr-2"
            />
            <span>{clientLanguageTag}</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-5 transform {isDropdownOpen ? 'rotate-180' : ''}"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                />
            </svg>
        </button>

        {#if isDropdownOpen}
            <ul
                class="absolute z-10 w-full bg-white border rounded shadow-lg flex flex-col"
            >
                {#each availableLanguageTags as lang}
                    <li>
                        <a
                            class="px-4 py-2 uppercase flex items-center w-full h-full hover:bg-slate-100 cursor-pointer {lang ===
                            clientLanguageTag
                                ? 'bg-slate-200'
                                : ''}"
                            href={i18n.route($page.url.pathname)}
                            hreflang={lang}
                            aria-current={lang === languageTag()
                                ? "page"
                                : undefined}
                        >
                            <img
                                src="/svg/flags/{lang}.svg"
                                alt="{lang} flag"
                                class="size-5 mr-2"
                            />
                            {lang}
                        </a>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
{/if}
