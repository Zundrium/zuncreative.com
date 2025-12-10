// @ts-check
import { defineConfig } from 'astro/config';
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://zuncreative.com',
  i18n: {
    defaultLocale: "en",
    locales: ["en", "nl"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  integrations: [sitemap()],
  vite: {
    plugins: [
      paraglideVitePlugin({
        project: "./project.inlang",
        outdir: "./src/paraglide",
      }),
      tailwindcss(),
      Icons({ compiler: 'astro' })
    ]
  }
});