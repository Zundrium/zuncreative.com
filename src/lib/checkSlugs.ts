
import { getCollection } from 'astro:content';

export async function checkSlugs() {
    const blog = await getCollection('blog');
    console.log('Blog Slugs:', blog.map(p => p.slug));

    const showcase = await getCollection('showcase');
    console.log('Showcase Slugs:', showcase.map(p => p.slug));
}

checkSlugs();
