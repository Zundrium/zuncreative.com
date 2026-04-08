import { createSitemap } from "svelte-sitemap/src/index.js";

const domain = import.meta.env.VITE_DOMAIN;

createSitemap(domain, { debug: false, ignore: ["**/404**"], outDir: "dist" });

