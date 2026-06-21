# Compendium Ingest & Open5e Gotchas

How the SRD compendium is built, and the data/toolchain traps discovered the hard
way. **Read this before touching `src/compendium/`, `scripts/ingest-srd.ts`, or the
stat-block UI** — most of these are non-obvious and will be repeated otherwise.

## The ingest

- `npm run ingest:srd` fetches the full **Open5e v2** `srd-2024` set, transforms it
  via the mappers in `src/compendium/open5e.ts`, and writes static JSON to
  `public/compendium/srd-creatures.json` / `srd-spells.json` (331 creatures, 339
  spells, 0 mapping errors as of writing).
- The app **never calls Open5e live** — it fetches the bundled JSON on demand
  (`src/compendium/srd.ts`), not into the JS bundle. Pull once, clean, seed.
- Licensing: ingesting SRD content triggers the CC-BY obligation — keep WotC's
  attribution in `CREDITS.md`. **CC-BY only; never the OGL.** See
  `docs/content-licensing.md`.

## Open5e v2 data gotchas (srd-2024)

1. **`armor_detail` is broken** — it returns `"natural armor"` for **all 331
   creatures** (even the AC-15 Bandit Captain). It is *not real data*. We do **not**
   map armor type. Don't re-add it from this field.
2. **Creature actions are partly prose.** Attack actions carry a structured
   `attacks[]` (`to_hit_mod`, `reach`, `range`, `damage_die_*`). **Save actions are
   prose** — parsed at ingest by `parseSave()` (ability/DC/on-save/failure damage).
   This ingest-time parsing is acceptable; runtime prose parsing is not.
3. **Single-damage type quirk:** for a one-damage attack the type lands in
   `extra_damage_type` with `extra_damage_die_count: null`. Treat it as the primary
   type (handled in `attackDamage`).
4. **Saves:** `saving_throws_all` lists **all six** abilities (= the actual bonus).
   We keep only **proficient** saves (bonus ≠ ability modifier) so the stat block is
   accurate; `saveBonus()` falls back to the ability mod for the rest.
   **Skills:** `skill_bonuses` is already the proficient subset — map it directly
   (snake_case → camelCase, e.g. `animal_handling` → `animalHandling`).
5. **Action order:** the `actions[]` array is **not** in stat-block order. Sort by
   `order_in_statblock` (so Multiattack comes first).
6. **Recharge** lives in `usage_limits` (`{ type: 'RECHARGE_ON_ROLL', param: 5 }` →
   Recharge 5–6; `PER_DAY` → N/Day). It is **not** in `armor_detail`-style fields and
   is easy to miss — it matters for the roller, so it's mapped onto `Action.recharge`.
7. **Action types:** `ACTION`, `BONUS_ACTION`, `REACTION`, `LEGENDARY_ACTION`,
   `LAIR_ACTION`. Partition them (a mapper that keeps only `ACTION` drops bonus
   actions, reactions, and legendary actions — an early bug here).
8. **Legendary:** there is **no per-round budget** in the data — default to 3
   (`DEFAULT_LEGENDARY_PER_ROUND`). A creature is "Legendary" iff it has legendary
   actions (no flag); the UI shows a badge on that basis. The **per-action cost**
   *is* exposed (`actions[].legendary_action_cost`, e.g. an action costing 2 of the
   round's budget) — we don't map it yet, but it's there if per-action legendary
   cost tracking is added later. Only the per-round budget is missing.
9. **Traits** are a separate `traits[]` (`{ name, desc }`), not in `actions`.
10. **Spellcasting is an action with markdown** (`**At Will:**`, bullet lists) — it
    is *not* a structured spellcasting block in this set. Render markdown
    (`react-markdown`), don't show raw asterisks.
11. **Languages:** `languages.data[].name` (fallback: split `languages.as_string`).
    **Resistances/immunities:** under `resistances_and_immunities`
    (`damage_resistances`, `damage_immunities`, `damage_vulnerabilities`,
    `condition_immunities`, each `[{ name }]`).
12. **XP:** `experience_points` is correct (use it); shown as "CR 16 (15,000 XP)".
13. **Document keys** are `srd-2024` (SRD 5.2) and `srd-2014` (SRD 5.1) — **not**
    the old v1 `wotc-srd`. `document.key` → our `source`/`edition`.
14. **Spells are not prose-only in the feed.** v2 carries structured spell
    mechanics — `damage_roll` (e.g. `"8d6"`), `damage_types`, `saving_throw_ability`,
    `attack_roll`, `concentration`, and `casting_options[]` (per-slot-level upcast
    variants, each with its own `damage_roll`). The current mapper keeps only
    display metadata + prose `text` (`mapOpen5eSpell`); the mechanics fields are
    available for a future **rollable-spell** feature. Note the **save DC is *not* a
    spell field** — it comes from the caster (a monster's `spellcasting.saveDc`, or
    DM-entered for a PC, since a PC's DC depends on a build we deliberately don't
    know). The on-save rule (half/none) lives in `desc` prose, not a clean field —
    parse at ingest (like creature save actions) or have the DM confirm it.
15. **Lair actions: there are none, and that's correct.** Open5e exposes **0**
    `LAIR_ACTION` entries — across `srd-2024`, `srd-2014`, and every third-party
    document (verified over 3,500 creatures), and the legacy v1 API + dnd5eapi.co
    carry no lair fields either. Two reasons: lair actions were **never in the SRD**
    (any edition) — they're full-Monster-Manual content — and the **2024 ruleset
    removed lair actions as a mechanic** (folded into normal/legendary actions). So
    for 2024-first content there is nothing to ingest and nothing missing. The schema
    (`Creature.lairActions`), the ingest (`actionsOfType('LAIR_ACTION')`), and the
    stat-block "Lair Actions" section stay in place but render empty. Lair actions
    only become relevant if we add **5.0 (2014)** or **Kobold Press** content, and
    even then only as prose (no clean structured source) — see the count-20 TODO in
    `docs/specs/initiative-loop-rules.md`. The DM-authored custom-creature form is the
    escape hatch in the meantime. (No CC-BY/OGL service exposes structured lair
    actions; only D&D Beyond and 5e.tools have them, and neither is license-clean.)

## Fetching raw data while investigating

- **`WebFetch` summarizes and refuses verbatim legal/long text** (it has a quote
  cap). To inspect real records or pull the OGL/attribution verbatim, fetch the raw
  JSON yourself (Node `fetch` or `curl`).
- **Open5e 403s the default Python/script User-Agent** — send a browser-ish
  `User-Agent` header.

## Toolchain notes (also bit us)

- **TypeScript is `~5.7`** — `erasableSyntaxOnly` is a **5.8** tsconfig option;
  removing it fixed the build. Check the TS version before using newer options.
- **Node 24 runs `.ts` directly** (type stripping) — `scripts/ingest-srd.ts` is run
  with plain `node`.
- **ESLint:** the `no-empty-object-type` rule flags the `string & {}` autocomplete
  trick (so `ContentSource` is a plain `string`). `scripts/` is ignored from lint
  (it handles untyped external JSON).
- **react-markdown adds ~40 KB gz** to the main bundle — lazy-loading the Compendium
  view would keep it out of the initial load (open follow-up).
- **Tailwind v4** dark mode is class-based via `@custom-variant dark (&:where(.dark, .dark *))`
  in `src/index.css`, forced default by `<html class="dark">`.

## Process gotcha (agent self-harm)

When verifying a signed commit with a throwaway commit, **capture `HEAD` first** and
`reset --hard` to that sha — not `HEAD~1`. If the throwaway commit *fails to create*
(e.g. signing not yet working), `reset --hard HEAD~1` rewinds a **real** commit. This
happened once and had to be recovered from the reflog.
