import { defineCollection, z } from 'astro:content';

const tattoos = defineCollection({
    type: 'content', // v2.5+ can use 'content' for md/mdx
    schema: ({ image }) => z.object({
        title: z.string(),
        image: image(),
        gallery: z.array(image()).optional(),
        tags: z.array(z.string()),
        status: z.enum(['done', 'flash']),
        publishedDate: z.coerce.date(),
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

const clients = defineCollection({
    type: 'data',
    schema: z.object({
        name: z.string().optional(), // Slug is usually the ID, but Keystatic saves 'name' field too if configured
        email: z.string().email(),
        status: z.enum(['new', 'deposit', 'booked', 'done', 'cancelled']),
        project: z.string(),
        appointmentDate: z.string().or(z.date()).transform((str) => new Date(str)), // Keystatic dates are strings
        notes: z.string().optional(),
    }).strict()
});

export const collections = {
    tattoos,
    guests,
    global,
    clients,
};
