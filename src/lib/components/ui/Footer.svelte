
<script lang="ts">
import Paragraph from "$lib/components/typography/Paragraph.svelte";
import DarkAndLightSwitch from "$lib/components/ui/DarkAndLightSwitch.svelte";

import MdiFacebook from "~icons/mdi/facebook";
import MdiTwitter from "~icons/mdi/twitter";
import MdiInstagram from "~icons/mdi/instagram";
import MdiLinkedin from "~icons/mdi/linkedin";
import MdiPhone from "~icons/mdi/phone";
import MdiEmail from "~icons/mdi/email";

const socialLinks = [
	{ icon: MdiFacebook, name: "Facebook", href: "https://facebook.com" },
	{ icon: MdiTwitter, name: "Twitter", href: "https://twitter.com" },
	{ icon: MdiInstagram, name: "Instagram", href: "https://instagram.com" },
	{ icon: MdiLinkedin, name: "LinkedIn", href: "https://linkedin.com" },
];

const columnLinks = [
	{
		title: "Company",
		links: [
			{ name: "About", href: "/" },
			{ name: "Careers", href: "/" },
		],
	},
	{
		title: "Resources",
		links: [
			{ name: "Blog", href: "/blog" },
			{ name: "Support", href: "/" },
		],
	},
	{
		title: "Legal",
		links: [
			{ name: "Terms", href: "/" },
			{ name: "Privacy", href: "/" },
		],
	},
];

// Compute the current year once
const year = new Date().getFullYear();
</script>

<footer class="text-black dark:text-white flex flex-col items-center bg-slate-50 dark:bg-white/5">
  <div class="w-full flex flex-col items-center px-4 py-12 lg:py-24">
    <div class="container px-4 flex-1">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {#each columnLinks as column}
          <div class="flex flex-col gap-4">
            <span class="font-bold">{column.title}</span>
            <ul class="flex flex-col gap-2 text-slate-700 dark:text-slate-400">
              {#each column.links as link}
                <li>
                  <a href={link.href}>{link.name}</a>
                </li>
              {/each}
            </ul>
          </div>
        {/each}
        <address class="flex flex-col gap-8">
          <a href="/" class="font-bold text-3xl" aria-label="Home">Temp</a>
          <div class="flex flex-col gap-4 text-slate-700 dark:text-slate-400">
            <Paragraph size="sm">
              1234 Street Name<br />City, NL
            </Paragraph>
            <a href="mailto:test@test.com" class="hover:underline flex items-center gap-2">
              <MdiEmail class="size-4" />
              test@test.com
            </a>
            <a href="tel:+316665658" class="hover:underline flex items-center gap-2">
              <MdiPhone class="size-4" />
              +31 6 665 658
            </a>
          </div>
          <ul class="h-full flex gap-3 lg:gap-6 items-center">
            {#each socialLinks as socialLink}
              <li>
                <a
                  href={socialLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={socialLink.name}
                >
                  <svelte:component this={socialLink.icon} class="size-6" />
                </a>
              </li>
            {/each}
          </ul>
        </address>
      </div>
    </div>
  </div>
  <div class="halfcontainer bg-white dark:bg-black w-full flex items-center justify-between text-sm text-slate-700 dark:text-slate-400 gap-4 lg:gap-8 p-4 lg:px-12 rounded-t-4xl">
    <div>&copy; {year} All rights reserved.</div>
    <div>
      <DarkAndLightSwitch />
    </div>
    <nav aria-label="Legal">
      <ul class="flex gap-4 lg:gap-8 items-center">
        <li>
          <a href="/">Privacy</a>
        </li>
        <li>
          <a href="/">
            Terms <span class="hidden lg:inline-block">&amp; conditions</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
  <div class="w-full bg-white dark:bg-black h-10 lg:h-20"></div>
</footer>

