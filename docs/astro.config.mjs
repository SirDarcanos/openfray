// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Load Fathom in production builds only (`astro build`), never on the dev server / localhost.
const isProd = process.argv.includes('build');
const fathomHead = isProd
  ? [
      {
        tag: /** @type {const} */ ('script'),
        attrs: {
          src: 'https://cdn.usefathom.com/script.js',
          'data-site': 'CZDKZIAS',
          defer: true,
        },
      },
    ]
  : [];

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
      // Fathom analytics — privacy-friendly, cookieless (same site id as the console
      // and marketing site), production only. The CSP in site/public/_headers already
      // allows cdn.usefathom.com across the whole deploy, including /docs.
      head: fathomHead,
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
            { label: 'Your account & what’s saved', link: '/account/' },
          ],
        },
        {
          label: 'Combatants',
          items: [
            { label: 'Creatures, players & quick adds', link: '/fight/combatants/' },
            { label: 'The tracker & rows', link: '/fight/tracker/' },
            { label: 'Death & dying', link: '/fight/death/' },
          ],
        },
        {
          label: 'Running a fight',
          items: [
            { label: 'Encounters & initiative', link: '/fight/encounters/' },
            { label: 'Attacks & damage', link: '/fight/attacks/' },
            { label: 'Saving throws', link: '/fight/saves/' },
            { label: 'Effects & conditions', link: '/fight/effects/' },
            { label: 'Concentration', link: '/fight/concentration/' },
            { label: 'Creature resources', link: '/fight/resources/' },
            { label: 'Spells', link: '/fight/spells/' },
            { label: 'Rests & clearing the board', link: '/fight/rests/' },
            { label: 'End of the fight', link: '/fight/recap/' },
          ],
        },
        {
          label: 'Your library',
          items: [
            { label: 'The compendium', link: '/library/compendium/' },
            { label: 'Build your own creatures & spells', link: '/library/making-your-own/' },
            { label: 'Campaigns & house rules', link: '/library/campaigns/' },
            { label: 'The importer', link: '/library/importer/' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'The stat block', link: '/reference/stat-block/' },
            { label: 'Dice & roll formulas', link: '/reference/dice/' },
            { label: 'The game log', link: '/reference/game-log/' },
            { label: 'Settings & appearance', link: '/reference/settings/' },
          ],
        },
        // The console and the marketing site live outside /docs. Starlight prefixes
        // `base` onto root-relative sidebar links, so these have to be full URLs.
        {
          label: 'OpenFray',
          items: [
            { label: 'Open the console', link: 'https://openfray.app/console/' },
            { label: 'Open the website', link: 'https://openfray.app/' },
          ],
        },
      ],
    }),
  ],
});
