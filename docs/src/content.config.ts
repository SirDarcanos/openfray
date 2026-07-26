import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    // `keywords` is an optional per-page list the SEO Head component folds into the
    // page's <meta name="keywords">, on top of the site-wide defaults.
    schema: docsSchema({
      extend: z.object({
        keywords: z.array(z.string()).optional(),
      }),
    }),
  }),
};
