// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// The OpenFray handbook. Built separately (like the app under /console) and merged
// into dist/docs by scripts/assemble-site.mjs, so it lives at openfray.app/docs
// without touching the custom marketing homepage. `base` prefixes every route.
export default defineConfig({
  site: 'https://openfray.app',
  base: '/docs',
  server: { port: 4322 },
  integrations: [
    starlight({
      title: 'OpenFray Docs',
      description:
        'How OpenFray works — the DnD 5e combat console for Game Masters: encounters, effects, spells, the compendium, campaigns, and dice.',
      logo: {
        src: './src/assets/mark.svg',
        alt: 'OpenFray',
      },
      customCss: ['./src/styles/theme.css'],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/SirDarcanos/openfray',
        },
      ],
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Overview', link: '/' },
            { label: 'Getting started', link: '/getting-started/' },
          ],
        },
        {
          label: 'Core concepts',
          items: [
            { label: 'Encounters & initiative', link: '/concepts/encounters/' },
            { label: 'Creatures & players', link: '/concepts/combatants/' },
            { label: 'Effects & conditions', link: '/concepts/effects/' },
            { label: 'Spells', link: '/concepts/spells/' },
            { label: 'The compendium', link: '/concepts/compendium/' },
            { label: 'Campaigns & house rules', link: '/concepts/campaigns/' },
            { label: 'Dice', link: '/concepts/dice/' },
          ],
        },
        {
          label: 'Tools',
          items: [{ label: 'The importer', link: '/importer/' }],
        },
        // The console and the marketing site live outside /docs. Starlight prefixes
        // `base` onto root-relative sidebar links, so these have to be full URLs.
        {
          label: 'OpenFray',
          items: [
            { label: 'Open the console', link: 'https://openfray.app/console/' },
            { label: 'openfray.app', link: 'https://openfray.app/' },
          ],
        },
      ],
    }),
  ],
});
