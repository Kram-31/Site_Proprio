import { defineCollection, z } from 'astro:content';

const tattoos = defineCollection({
    type: 'content', // v2.5+ can use 'content' for md/mdx
    schema: ({ image }) => z.object({
        title: z.string(),
        image: image(),
        gallery: z.array(image()).optional(),
        tags: z.array(z.string()),
        status: z.enum(['done', 'flash']),
        publishedDate: z.date(),
    }),
});

const guests = defineCollection({
    type: 'data', // JSON/YAML
    schema: z.object({
        city: z.string(),
        dates: z.string(),
        link: z.string().url().optional(),
    }),
});

// Singleton in Keystatic usually maps to a single file in a collection or a specific data file.
// Keystatic 'globalInfo' path: 'src/content/global/info'
// This means it's likely a JSON/YAML file at 'src/content/global/info.json' or .yaml
// So we define a 'global' collection of type 'data'.

const global = defineCollection({
    type: 'data',
    schema: z.object({
        bookingStatus: z.enum(['open', 'closed']),
        announcement: z.string().optional(),
        instagram: z.string().url(),
    })
});

export const collections = {
    tattoos,
    guests,
    global,
};
