# OpenFray — Project Plan

*A free, open-source DnD 5e combat tracker for Game Masters.*
*(5.5e/2024-first, with 5.0 support.) — openfray.app*

This is the authoritative plan. Six companion specs go deeper on each subsystem;
they're listed at the end and referenced inline. Read this first.

**Name:** OpenFray. **Domains:** `openfray.app` (canonical) + `openfray.com`
(redirect), registered via Cloudflare. **GitHub org (to claim):** `openfray`.
The "Open" signals open-source (AGPL); "Fray" signals combat, not dice — keeping
clear of the saturated dice-roller naming space. Namespaces cleanly for a future
standalone dice package (`@openfray/dice`).

---


## 1. What this is (and what it isn't)

A fast, browser-based **combat console** for GMs running DnD 5.5e at the table.
Not "another initiative tracker" — the differentiator is everything the existing
tools (Improved Initiative, D&D Beyond's tracker, Roll20) do poorly or not at all:

**The product is:** a quick scratchpad for what's happening in a fight — turn
order, monster resources, conditions, and the relational state between combatants
(who has advantage on whom, who's debuffed) — with dice and an SRD reference
hanging off it.

**The product is NOT a character-sheet manager.** The single most important
scoping rule, applied everywhere: *we track what happens at the table — plus the
reference a GM keeps on hand — never the rules engine behind a character.* The
player's sheet / D&D Beyond owns what a character can do and computes it; we own
what just happened, what must be remembered, and the facts a GM jots for reference.
Every feature is tested against one question — **does this require knowing a PC's
build (the app modeling, deriving from, or running class/level/features/spells)?
If yes, it's out of scope.**

### The validated gaps we're filling
- **Monster resource tracking** — spell slots, legendary actions, lair actions,
  recharge / once-per-day abilities. D&D Beyond has never added this for monsters
  despite years of requests; GMs resort to browser extensions and console scripts.
- **Relational combat state** — "advantage against the barbarian (Reckless)",
  "disadvantage on the goblin's next attack (Vicious Mockery)" — tracked as
  first-class, reminded automatically.
- **Mass saves** — roll a whole group's saves at once (Fireball), see who passes,
  apply split damage in one tap.
- **Easy custom creatures** — a real form, not Improved Initiative's raw JSON.
- **Trustworthy dice** — provably uniform, with a transparent roll log.

---

## 2. Scope: phases

### Phase 1 — single-GM, single-device tracker (the build target)
The spine plus differentiators, no multiplayer:
- Initiative loop (turn/round, durations, lair actions)
- HP / damage / heal
- Monster resources: spell slots, legendary, lair, limited-use / recharge
- Concentration tracking
- Conditions + **Effects** (adv/disadv, debuffs, reminders) — badge reminders
  minimum; auto-application if time
- **Mass save** flow
- Dice engine (stat-block presets + manual), effect-aware
- SRD 5.2 compendium (spells, monsters, features) + custom-creature/spell form
- Anonymous use (SRD + players, ephemeral) and sign-up (everything persists)

**Ship-it line:** a better tracker than anything available exists by the time
dice rolling works. Mass save + effect-awareness are the features that make GMs
switch.

### Phase 2 — shared player view
A read-only screen players can see (turn order, conditions, "Bloodied" not exact
HP). Designed *into* the data model now (per-field visibility flags exist from day
one) but **not built** in phase 1. Requires the realtime layer — which is the same
infrastructure that gives the GM's own phone live sync (see §3a). The player view
is then a small increment on top: the realtime broadcast plus a visibility filter.

### Later / optional, never core
- D&D Beyond / Roll20 import — best-effort convenience only. **No public API
  exists** for either (a WotC licensing matter), so this is a browser-extension
  or manual-paste affair, fragile and legally gray. The SRD compendium + a great
  custom-creature form carry the real load. Never bet the product on import.

---

## 3. Architecture — the holding ideas

```
┌─────────────────────────────────────────────────────────┐
│  Browser (web app)                                       │
│  ┌───────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Initiative    │  │ Dice engine  │  │ Compendium   │   │
│  │ loop + state  │◄─┤ (1 chokepoint│  │ (SRD, read)  │   │
│  │               │  │  effect-aware│  │              │   │
│  └───────┬───────┘  └──────────────┘  └──────────────┘   │
│          │ reads/writes                                  │
│  ┌───────▼──────────────────────────────────────────┐   │
│  │ Encounter state (one object): round, activeIndex, │   │
│  │ combatants[] w/ HP, resources, effects, conditions│   │
│  └───────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────┘
                       │ (signed-up only)
              ┌────────▼─────────┐
              │ Postgres + JSONB │  hosted (Supabase/Neon)
              │ users, creatures,│  + Auth, + RLS,
              │ spells, players, │  + realtime (phase 2)
              │ campaigns,       │
              │ encounters       │
              └──────────────────┘
```

### The four ideas that hold it together
1. **One Creature schema** for monsters, NPCs, and the compendium. Library
   creatures are read-only templates; combat instantiates them into mutable
   **Combatants**. Mechanics live in structured fields, prose lives in `text` —
   never parse your own stat blocks. → *schema spec*
2. **The Effect** — one abstraction for conditions, advantage/disadvantage, flat
   modifiers, and reminders. There are only ~6 shapes of consequence in all of
   5e, however many class features exist; we model the 6, never the features.
   `direction: incoming|outgoing` captures both "adv against me" and "I roll at
   disadv" with one field. → *effect-UX spec*
3. **One dice chokepoint.** Every roll routes through `roll(formula, ctx)` — that's
   where randomness, effect-awareness, and the trust-building log all live.
   → *dice spec*
4. **Identity-as-ownership from day one.** Every persisted row carries `owner_id`;
   Row-Level Security enforces isolation. Encounter state is one autosaved JSONB
   blob, so "reopen mid-fight next week" is free. → *storage spec*

### The loop discipline that prevents the worst bugs
Turn ownership is by `combatantId`, never by array index. Any list mutation
re-derives `activeIndex` from the active creature's id. Effects keyed to "start of
source's next turn" tick at **start**, not end. → *loop-rules spec*

---

## 3a. Tech stack & platform — DECISIONS

### Language: TypeScript, end to end
The product is defined by a few intricate shared JSON shapes (Creature, Combatant,
Effect, Encounter) that flow DB → dice engine → UI → (phase 2) network. TypeScript
on every layer means those shapes are defined **once** as types and checked
everywhere; rename an Effect field and the compiler lists every break. For a solo
dev maintaining a fiddly state machine (turn order, effect-duration timing), the
type-checker is effectively a second pair of hands — and it catches exactly the
bugs this domain is most exposed to (misnamed slot keys, effects ticking at the
wrong moment). Plain JS forfeits that where it's most valuable; a non-JS backend
forces a second type system and a manual client/server contract where the shapes
can drift. The app is browser-resident anyway (dice need `crypto.getRandomValues()`
client-side; state and `sessionStorage` live in the browser), so TS everywhere
means one language, one set of types, no translation layer.

**Stack the plan implies:**
- **Frontend:** React (Vite), Tailwind for the tap-heavy, glanceable UI.
- **Backend/DB:** hosted Postgres with built-in auth + RLS + realtime — Supabase
  fits all four needs and keeps the phase-2 player view in one place. Phase 1 may
  need almost no server code (client talks to Supabase under RLS). Server logic, if
  needed later, stays in-language via Next.js or a small Node service.
- **Dice:** isolated TypeScript module behind one `roll()` — a candidate to publish
  standalone (MIT) for "audit our randomness" credibility, since it isn't the
  product.

### Platform: tablet/desktop-first, phone as companion — NOT mobile-first
Running a fight is a dense, glanceable control-panel task (stat block + turn order
+ resources + quick-apply chips visible together) that wants horizontal space, and
it happens when the GM's attention is most divided. So:
- **Primary device = tablet landscape (~1024px+) and desktop.** The canonical
  multi-panel combat console. This is what to wireframe first.
- **Phone = companion**, a deliberately reduced experience (reference: stat blocks,
  compendium, glance at initiative, quick rolls) — *not* a cramped full console.
- **Methodology is tablet-first, scale up to desktop, scale phone down to a
  graceful subset** — *not* mobile-first. Mobile-first optimizes the screen the GM
  rarely runs combat on, then expands phone compromises into the space where the
  real work happens. Make the phone not-broken; don't sink solo-dev effort into
  making the full console excellent at 375px.

### Multi-device: independent reference now (Option B), live sync later (A/C)
The phone companion shows reference data from the GM's own account (compendium,
saved creatures) as **independent read access** — it does **not** mirror the live
in-progress fight in phase 1. Reasoning: what the phone is actually for ("see
blocks, compendium") is reference, which needs no sync; the expensive part —
phone reflecting the *live* encounter state across devices — is the **same
realtime infrastructure as the phase-2 player view** (GM-on-phone is just the
player view with no visibility filter). So we don't build it twice or early:
ship cheap independent reference now, and live multi-device sync arrives *with*
the player view, where the GM's phone gets it "for free."

**The one constraint this implies** (already satisfied): encounter state stays
**broadcast-ready** — stored as one autosaved JSONB blob — so making it
server-synced later is a capability addition, not a re-architecture.

### Rendering model: local-first SPA, not server-read-through
The app feels like a single-page app with no hard refresh — but the snappiness
comes from **local state, not the realtime layer**. Three distinct things, often
conflated:
1. **SPA / no hard refresh** — free from React client-side routing; views swap in
   place, live encounter persists in memory across them.
2. **Instant updates from the GM's own actions** — local React state mutation +
   re-render; no network round-trip in the hot path. This is what makes it feel
   instant, and it's phase-1, easy.
3. **Cross-device/user realtime** — the only piece that's actual infrastructure
   (Supabase realtime subscription); deferred to phase 2.

**The pattern is local-first:** mutate an in-memory store, render immediately,
persist to Postgres in the **background** (debounced autosave). The UI never reads
*through* the server — putting a round-trip in front of every dice roll / condition
toggle would feel laggy, the opposite of the goal. Keep the whole live encounter in
one client-side store (React state, or Zustand if it grows) as the session's source
of truth; persistence is a background effect, not a gatekeeper. Phase-2 realtime
then layers on cleanly because "merge a remote change into the store" is the same
operation as "apply a local change" — build it server-read-through instead and
you'd re-architect for both speed and realtime later.

### Hosting — DECISIONS
A web app has two things to host; they live in different places.

- **Frontend (static React/Vite bundle): Cloudflare Pages or Vercel — ~$0.**
  Compiles to static files on a CDN; free tiers cover a niche tool comfortably,
  deploy on git push, HTTPS + domain included. Cloudflare Pages = most generous
  bandwidth; Vercel = smoothest if moving to Next.js later. Effectively free
  indefinitely at this scale.
- **Backend/DB: Supabase free tier** (Postgres + auth + RLS + realtime). As of
  June 2026: 500 MB database, 50K monthly active users, 5 GB egress, unlimited API
  requests within limits, and **a max of 2 active projects** (so free dev/staging/prod
  as separate projects isn't possible — branch/seed within one). Fits a small
  community tool for a long time. *(Confirm current numbers at supabase.com/pricing
  — Supabase has changed these several times.)*
- **Two free chores that make the free tier behave like paid**, both falling out
  of decisions already made:
  - *Keep-alive:* free projects pause after 7 days of inactivity (data survives,
    project goes offline until restored). A **GitHub Actions scheduled ping** keeps
    it awake — free on a public repo, which ours is (AGPL). ~20 min setup. Solves
    the one bad first-impression failure mode (a skipped session or two → paused
    backend).
  - *Backups:* free tier has **no automatic backups** (a bigger risk than the
    500 MB cap). A scheduled job dumping daily Postgres backups to cheap object
    storage covers it at ~$0. Set up early — GMs care about their custom creatures.
- **Cost model: $0 until real traffic.** Upgrade trigger is *limits*, not the
  pause — Supabase **Pro at $25/mo** when hitting ~40K MAU, ~400 MB+ database, or
  needing managed backups/support. Pro now bundles **daily backups (7-day
  retention)** + $10/mo compute credit. That's a "got popular" problem worth having.
- **No lock-in:** Supabase is standard Postgres underneath; if it ever stops
  fitting, data + schema move to Neon / Railway / Fly.io / managed Postgres with no
  rewrite. The JSONB-blob design keeps it portable.

**Not used: headless WordPress.** Considered and rejected — wrong data shape. WP
suits editorial/content sites (author-and-display); this app is relational, live,
transactional, multi-tenant state with a realtime requirement. WP has no RLS
equivalent, no realtime layer, and puts PHP + a request cycle in the hot path of
the most latency-sensitive interaction. Even the compendium (the most
content-shaped part) shares the one Creature/Spell schema, so housing it in WP
would split data across two systems. Postgres/Supabase stays unified.

---

## 4. Data & persistence decisions

- **Real database: yes — Postgres with JSONB.** Half relational (ownership,
  references), half document (nested stat blocks). JSONB stores the whole creature
  / encounter object in one column with real foreign keys around it.
- **Shipped vs. user content:** SRD seeded with `owner_id NULL` (read-only, shared
  by all); custom content is the same schema with an `owner_id`.
- **Snapshot, don't reference:** combat copies a creature's data into the encounter
  so editing a template never mutates an in-progress fight.
- **Multi-tenant isolation via Row-Level Security from commit one** — the one
  thing genuinely painful to retrofit.
- **Hosted Postgres (Supabase / Neon)** so auth, RLS, and phase-2 realtime come
  from one place.

Full table definitions in the *storage spec*.

### Editions & sources (5.0 / 5.5 / Kobold Press / custom)

The app supports content from multiple editions and sources through **one schema
and one front-end representation (5.5-styled)**. Editions differ only in *values*
within the same fields (a die size, a bonus), so there is nothing edition-specific
to model structurally. Three small fields carry it:

- `source` — e.g. `"srd"`, `"kobold-press-tob"`, `"custom"`.
- `edition` — `"5.0" | "5.5"` (metadata + display selection; no logic branches on
  it).
- intra-source **identity key** — stable, meaningful **only within a single
  source**, assigned at import time for controlled content.

**Edition is a campaign-level setting**, not a per-creature/per-block choice. The
GM sets it in campaign settings (and may flip it occasionally). The app reads it as
ambient context when deciding what to surface. There is **no live on-block edition
toggle** — edition is a campaign decision, not a combat-time one.

**Display rule:** for a given entity, show the campaign's selected edition *if it
exists for that entity*; otherwise show whatever edition does exist. Availability
beats edition-purity — never hide a creature just because it's only in the other
edition.

> **As built (2026-06):** compendium content surfacing is keyed to a **per-account
> "content libraries" toggle** (`user_settings`, default 5.2-only), not to the campaign's
> `edition` field — see the content-libraries work in `local/HANDOFF.md`. The compendium
> badges each entry's edition (`5.5`/`5.0`) and filters by the enabled libraries. The
> campaign `edition` field now only labels the campaign itself. This supersedes the
> campaign-driven display rule above; the rule is kept for design context.

**Grouping ("same creature, two editions") happens ONLY within a single source**,
over content we control (SRD imports), where we assign the identity key by hand and
know the answer. The match rule is: *same source + same identity key + differing
edition*. Cross-source matching never runs — the SRD goblin and the Kobold Press
goblin are **different entities**, never reconciled, because they're different
sources. This tight scoping is what makes grouping reliable instead of fragile
name-matching.

**User / HB / custom content is NEVER grouped or matched** — full stop. Every
custom creature is an independent entity with its own id, no matter how identical.
Three user-added "Goblin"s are three goblins. Grouping logic only ever executes
inside controlled SRD imports; user content never enters that codepath, so nothing
can misfire over it. (Safety is "we never match user content," not "we match it
carefully.")

**Duplicate detection is separate from grouping, and advisory only.** A cheap,
name-based check at save time may warn "you already have a 'Goblin' — add anyway?"
to catch *accidental* double-adds. It is **non-binding and leaves no trace**:
"warn, then forget." If the user proceeds, they get a second fully-independent row
with no link and no memory of the near-match. The warning must never link, merge,
dedup, or influence anything downstream — the moment it does, it has quietly
reinvented the grouping that's banned for user content.

Spells follow the identical model (e.g. Suggestion 5.0 vs 5.5): independent,
edition-tagged rows, grouped only within a source, surfaced by the campaign's
edition setting.

### Verified facts (checked June 2026) — data source, content boundary, licensing

**Data source: Open5e API, v2.** Confirmed to carry both editions: the 2024/5.5
content under document key `srd-2024` (~330 creatures, ~339 spells) and the 2014/5.1
content under `srd-2014` (titled "SRD 5.1"). *(The old v1 key `wotc-srd` no longer
applies — on v2 the 2014 SRD is `srd-2014`.)* It also aggregates third-party
publishers (Kobold Press, Green Ronin) under their own open licenses.
- **Open5e's `document.key` field IS our `source` + `edition`.** Every entry is
  already tagged with its origin document; we ingest that field rather than
  inventing tagging. `srd-2024` / `srd-2014` → our SRD editions; the entry slug
  (e.g. `fireball`) → our within-source identity key; a Kobold Press document →
  a distinct `source`, which *automatically* makes it a separate, never-matched
  entity per our rule. The data structure validates the editions/sources design.
- **Use v2, not v1** — v1 is being deprecated and may degrade.
- **Ingest once into our own DB, don't call live.** Open5e's srd-2024 data has had
  real bugs actively being fixed (CreatureAction data, spellcasting markdown,
  spell omissions). Pull, **spot-check a sample against our schema, clean as
  needed**, then seed. This both insulates us from their regressions and matches
  the seed-SRD approach already in the plan. Tag the SRD version ingested
  (5.2 / 5.2.1…) for later updates.

**Content boundary (permanent, legal — not fixable):** SRD 5.2 deliberately
**excludes** iconic monsters (Beholder, Mind Flayer, Displacer Beast, etc.),
some classes (Artificer), and species (Aasimar) as protected WotC IP. Implication:
the compendium will be missing famous creatures by law, which makes the
**custom-creature form and Kobold Press import central, not nice-to-haves** — for
many GMs they're how the SRD-forbidden boss gets added. Also note some SRD content
was **renamed** to avoid trademarks (functionally identical); ingest the renamed
forms as-is, don't "correct" them.

**Licensing / attribution (an obligation, distinct from our AGPL):**
- **Policy: CC-BY-4.0 for ALL game content; the OGL is never used, in any version.**
  Full build-agent instructions in [`content-licensing.md`](content-licensing.md);
  attributions live in `CREDITS.md` (+ an in-app About/Credits screen).
- SRD 5.2 (`srd-2024`) is released under **CC-BY-4.0 only** — irrevocable, no OGL
  option, no decision to make. This is the bulk of the content.
- SRD 5.1 (`srd-2014`), if ingested, is **dual-licensed** (OGL-1.0a *or* CC-BY-4.0).
  Dual-licensed means you pick **one** — **we elect CC-BY-4.0**, so the whole
  compendium sits under one consistent license and the OGL is never invoked.
- CC-BY is **not** "no strings": wherever SRD content is used we must credit WotC
  (their exact attribution string, title, licensor), **link the license**, **state
  that changes were made** (we reformat into our schema), and **not imply
  endorsement**.
- Third-party content (e.g. Kobold Press) is honored under **its own license**,
  checked and recorded per source before ingest — **never assumed CC-BY**. Do not add
  OGL boilerplate (Section 15 / Product Identity); if a source is OGL-only, **flag it
  to the maintainer** rather than reintroducing the OGL.
- **Never ingest WotC content excluded from the SRD** (Beholder, Mind Flayer,
  Displacer Beast, …) — it isn't under CC-BY and we have no license to it.
- This content licensing (governs the *data*) is **separate from** the project's
  AGPL (governs the *code*). Both apply.

---

## 5. Identity model: two tiers

There are exactly two account states; "signup" is the transition, not a third
state.

**Anonymous** — browse read-only SRD, run encounters with SRD monsters, add
players. *All state is client-side and ephemeral* (memory + `sessionStorage`,
never the DB). Dies on tab close, by design. No `owner_id`, no rows, nothing to
clean up or migrate.

**Signed-up** — everything persists: custom creatures/spells, players,
in-progress encounters, cross-device. `owner_id` + RLS applies. Hosted auth;
never hand-roll credentials.

**Why anon data is deliberately ephemeral:** persisting it would force
orphaned-row cleanup, a fiddly anonymous→permanent merge migration, storage bloat,
and false durability promises. Wiping by default deletes all of that. Signup
becomes a clean upgrade with **nothing to migrate**.

**Avoiding silent loss (the one refinement):** keep anon state in `sessionStorage`
(tab-scoped, survives accidental reload/crash, still never hits the DB — *not*
`localStorage`, which would reintroduce durability headaches) and fire a
`beforeunload` warning so loss is *chosen*, never a silent gut-punch mid-fight.

**Conversion lever:** the impending loss of an anon user's players + in-progress
encounter is the best prompt-to-sign-up moment — which is exactly why anon users
get players: they must feel the value before being asked to commit.

---

## 6. Randomness & trust

Goal is not "true" randomness but **unbiased, uniform, unpredictable-to-a-human**,
with enough transparency that players trust it.

- **CSPRNG** (`crypto.getRandomValues()`), not `Math.random()`.
- **Reject modulo bias** with a redraw loop — every die face exactly equally
  likely.
- **No "anti-streak" tampering** — real dice clump; suppressing repeats is *more*
  detectably rigged over a campaign and destroys trust.
- **Trust comes from a transparent roll log**, not from fudging — a timestamped
  feed showing every roll's breakdown and *why* each modifier applied answers
  "is this rigged?" honestly. Optional later: a commit-reveal seed audit trail.

Details and the formula grammar in the *dice spec*.

---

## 7. Licensing & sustainability — DECISION

**License: AGPL-3.0. Funding: donations (GitHub Sponsors / Ko-fi). No ads.**

### Rationale
The goal is "mostly for myself, and for the community to cover costs" — a
passion project, not a business. That settles it:

- **Open-source, because** the monetization-protection arguments for closed /
  source-available licensing don't apply when there's no revenue to protect. The
  TTRPG-tool community funds projects like this through donations, not ads;
  contributors lighten a solo dev's load; and open code lets anyone audit the
  dice RNG (real, free credibility for the trust problem).
- **AGPL specifically, because the obligation trigger must match the delivery
  model.** This is a hosted web app:
  - *Apache/MIT* permit closed commercial forks entirely — fails "improvements
    should flow back."
  - *GPL* requires sharing source on **distribution**, but a web app is never
    distributed (users interact over a network), so GPL's copyleft never fires —
    the **"SaaS loophole."**
  - *AGPL* closes that hole: interacting with a modified version **over a
    network** triggers the source-sharing obligation. It's the only one of the
    three whose trigger matches how the software is actually used.
- **No ads, because** they're thin revenue on an ad-averse audience *and* they
  sour the goodwill that drives donations. A visible "here's what hosting costs,
  here's the tip jar" outperforms ads in this community.

### What AGPL does and doesn't do for the stated wants
- *"People can use it"* → ✓ fully open.
- *"Recognition"* → ✓ guaranteed — every OSS license requires keeping attribution;
  stripping the author's name violates the license regardless.
- *"Not free-riders monetizing my unchanged work with nothing back"* → ✓ deterred,
  not banned. AGPL can't forbid commercial use (no open-source license can) but it
  makes the free-rider play unrewarding: a commercial host must publish their
  changes and keep attribution, and anyone can use the free original anyway. For
  the *specific* grievance — "unchanged copy, monetized, gives nothing back" —
  AGPL removes the incentive at the planning stage.

### Honest limitations (accepted)
- **A license is standing, not surveillance.** AGPL gives the *right* to act on a
  violation found; it does not detect or prevent them. Enforcement is reactive and,
  for a niche tool, almost never needed — the community surfaces egregious cases.
  Don't invest in detection (scanners, watermarking, phone-home); it's
  disproportionate to the risk and sours the vibe.
- **AGPL deters some corporate adoption** (some companies ban AGPL deps). For a
  community GM tool that's a feature, not a bug.
- One cheap, passive, community-friendly nod to recognition: a tasteful
  *"built by [you] — source at [link]"* in the app footer. Not DRM; just travels
  with copies and reinforces attribution.

### Contribution setup (from the first public commit)
- `LICENSE` (AGPL-3.0), `README`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`.
- **No CLA.** A Contributor License Agreement (which grants the project rights to
  relicense later) adds a signup wall that deters casual contributors, and its
  only benefit — unilateral future relicensing — is moot here since there's no
  monetization plan. Skipping it keeps contributing frictionless.
- **Optional DCO** (`Signed-off-by:` via `git commit -s`) instead — a lightweight
  certification that a contributor has the right to submit their code, no
  agreement to sign. Plenty of protection for a project like this; the Linux
  kernel uses exactly this.

---

## 8. Build order (phase 1)

1. **Schema** — Creature + Action + Effect, locked together. Nothing works without
   it.
2. **Encounter + Combatant + initiative loop** — turn/round ticks per the loop
   rules.
3. **Resource tracking** — HP/damage/heal; spell slots, legendary, lair,
   limited-use/recharge.
4. **Conditions + Effects as one system** — badges/reminders on combatant rows.
5. **Dice engine** — presets + manual, CSPRNG + bias rejection, roll log.
6. **Effect-aware rolling** — auto adv/disadv resolution (upgrade of #5).
7. **Mass save** — group resolution flow (reuses the dice result renderer).
8. **SRD compendium + custom-creature/spell form** — Open5e JSON seeded into the
   schema.
9. **Concentration auto-checks** — wired into damage + mass save.
10. **Identity** — anonymous (ephemeral) + sign-up (persist), RLS on.

Through #5 you have something better than what exists. #6–7 are the
differentiators. #8–10 make it pleasant to live in and persistent.

### Recommended starting stack
See §3a for the full reasoning. In brief: **TypeScript everywhere**; **React +
Vite + Tailwind** frontend designed **tablet/desktop-first** (phone = reduced
companion); **hosted Postgres + auth + RLS + realtime** (Supabase) as backend;
dice as an **isolated `roll()` module** (candidate to open standalone under MIT for
randomness-audit credibility).

---

## 9. The decisions, in one place

| Question | Decision |
|---|---|
| What is it | 5.5e GM combat console; scratchpad not character sheet |
| Name | **OpenFray** — `openfray.app` (canonical) + `openfray.com` (redirect) |
| Hard scope rule | Never requires knowing a PC's build |
| Language | **TypeScript, end to end** |
| Frontend | **React + Vite + Tailwind** |
| Backend/DB | **Hosted Postgres + auth + RLS + realtime (Supabase)** |
| Frontend hosting | **Cloudflare Pages or Vercel (static bundle), ~$0** |
| Backend hosting | **Supabase free tier; Pro ($25/mo) only when limits hit** |
| Free-tier chores | **GitHub Actions keep-alive ping + scheduled daily backups** |
| Rendering model | **Local-first SPA; background autosave, never read-through** |
| Headless WordPress | **Rejected — wrong data shape (relational/live, not editorial)** |
| Primary platform | **Tablet landscape + desktop; tablet-first, NOT mobile-first** |
| Phone | **Companion (reference): independent read access, not live combat** |
| Multi-device sync | **Deferred to phase 2, shared with player-view realtime layer** |
| Phase 1 | Single-GM tracker + differentiators, no multiplayer |
| Player view | Designed in now (visibility flags), built in phase 2 |
| DDB/Roll20 import | Optional, best-effort, never core (no public API) |
| Compendium | SRD via Open5e, one shared schema, 5.5-styled rendering |
| Data source | Open5e **v2** API; `srd-2024` + `srd-2014`; ingest once, clean, seed |
| Content gap | SRD excludes Beholder/Mind Flayer/etc. → custom form is central |
| Content license | **CC-BY-4.0 for ALL game content; OGL never used.** SRD 5.2 = CC-BY-only; `srd-2014` dual-licensed → elect CC-BY; 3rd-party honored under its own license, never assumed CC-BY |
| License artifacts | `CREDITS.md` (attributions) + `docs/content-licensing.md` (build-agent instructions) |
| Excluded IP | Never ingest SRD-excluded WotC IP (Beholder, Mind Flayer, …) — not CC-BY |
| Editions | `edition` field, per-block; **per-account content-libraries toggle** picks which surfaces (as built — superseded the campaign-level plan; campaign `edition` only labels the campaign) |
| Sources | `source` field; SRD, Kobold Press, custom — never cross-matched |
| Edition grouping | Within one source only, import-assigned key; never user content |
| Duplicate handling | Advisory name warning only; "warn then forget", no linking |
| Effects | One abstraction, ~6 consequence shapes, `direction` field |
| Dice randomness | CSPRNG + modulo-bias rejection; no anti-streak fudging |
| Dice trust | Transparent roll log, not tampering |
| Database | Postgres + JSONB, hosted (Supabase/Neon) |
| Multi-tenant | `owner_id` + Row-Level Security from commit one |
| Combat state | One autosaved JSONB blob per encounter |
| Creatures in combat | Snapshot, don't reference |
| Identity | Two tiers: anon (ephemeral) + signed-up (persists) |
| Anon storage | `sessionStorage` + `beforeunload` warning; never the DB |
| License | **AGPL-3.0** |
| Funding | **Donations (Sponsors/Ko-fi); no ads** |
| CLA | **None** (optional DCO sign-off) |

---

## Companion specs (the detail)

1. `combat-console-schema.md` — Creature / Action / Spellcasting / LimitedUse,
   Combatant, PC, Encounter shapes.
2. `phase1-tracker-plan.md` — the Effect concept, mass save, adv/disadv handling,
   phase-1 build order.
3. `initiative-loop-rules.md` — every turn/round edge case as an explicit rule.
4. `effect-application-ux.md` — the 6 consequence shapes, quick-apply chips,
   "don't become a character sheet."
5. `dice-engine-spec.md` — randomness, formula grammar, effect-aware resolution,
   HI/UX.
6. `data-storage-architecture.md` — tables, JSONB strategy, RLS, two-tier
   identity.
7. `compendium-ingest.md` — how the SRD is ingested from Open5e v2, plus the data
   and toolchain **gotchas** (broken `armor_detail`, prose save actions,
   `order_in_statblock`, recharge, proficient-saves filter, …). Read before
   touching the compendium/ingest.
