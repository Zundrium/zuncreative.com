import * as runtime from "$lib/paraglide/runtime";
import { createI18n } from "@inlang/paraglide-sveltekit";
import {
	availableLanguageTags,
	sourceLanguageTag,
} from "$lib/paraglide/runtime";

// TODO: Implement localized urls
// Generate a clear list based on slug attributes from markdown files 'blogposts' / 'textpages'
//
//export const i18n = createI18n(runtime, {
//	pathnames: {
//		"/about" : {
//			en: "/about",
//			de: "/uber-uns",
//			fr: "/a-propos",
//		},
//	}
//
//})

export const i18n = createI18n(runtime);
