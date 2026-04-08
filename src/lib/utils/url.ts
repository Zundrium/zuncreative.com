export function getPostUrl(slug: string): string {
    const [lang, ...rest] = slug.split('/');
    const cleanSlug = rest.join('/');
    if (lang === 'en') {
        return `/blog/${cleanSlug}`;
    } else {
        return `/${lang}/blog/${cleanSlug}`;
    }
}

export function getShowcaseUrl(slug: string): string {
    const [lang, ...rest] = slug.split('/');
    const cleanSlug = rest.join('/');
    if (lang === 'en') {
        return `/showcase/${cleanSlug}`;
    } else {
        return `/${lang}/showcase/${cleanSlug}`;
    }
}

export function getTextPageUrl(slug: string): string {
    const [lang, ...rest] = slug.split('/');
    const cleanSlug = rest.join('/');
    if (lang === 'en') {
        return `/${cleanSlug}`;
    } else {
        return `/${lang}/${cleanSlug}`;
    }
}
