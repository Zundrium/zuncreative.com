import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        description: z.string(),
        publish_date: z.coerce.date(),
        modify_date: z.coerce.date().optional(),
        keywords: z.string().transform(str => str.split(',').map(s => s.trim())).optional().default(''),
        header_image: image().optional(),
        header_image_position: z.string().optional(),
    }),
});

const textpages = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        publish_date: z.coerce.date(),
        modify_date: z.coerce.date().optional(),
        keywords: z.string().optional(),
    }),
});

const showcase = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        description: z.string(),
        publish_date: z.coerce.date(),
        order: z.number().optional(),
        keywords: z.string().transform(str => str.split(',').map(s => s.trim())).optional().default(''),
        mobile: z.boolean().optional(),
        featured: z.boolean().optional(),
        header_image: image().optional(),
        external_url: z.string().optional(),
        video: z.string().optional(),
        partner_brand: z.string().optional(),
        gallery: z.array(image()).optional(),
    }),
});

export const collections = {
    blog,
    textpages,
    showcase,
};
