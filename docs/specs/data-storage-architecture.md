# Data Storage & Persistence

## The core distinction: shipped content vs. user content

These have opposite needs, so store them differently.

| | **Shipped (SRD)** | **User-created** |
|---|---|---|
| Source | SRD 5.2, you author it | DMs at runtime |
| Changes | Only when you ship an update | Constantly |
| Owner | Everyone, read-only | One user, private |
| Volume | Fixed (~few hundred items) | Grows per user |
| Where | Bundled / seeded, read-only | Database, per-user |

The Creature/Spell **schema is identical** for both (that was the point of one
schema). Only `source` and ownership differ. A user's custom monster is just a
Creature with `source: "custom"` and an `ownerId`.

---

## Do we use a real database? Yes.

LocalStorage / IndexedDB alone fails the moment a DM wants their stuff on a second
device, or you add the player view (which needs a server anyway). Plan for a real
DB from day one even if phase 1 is single-device — the schema below works for both.

### Recommended shape: Postgres (relational + JSONB)

Postgres is the sweet spot here because your data is **half relational, half
document**:

- *Relational* part: users own creatures, encounters reference creatures,
  campaigns group encounters. Foreign keys and "list everything I own" queries.
- *Document* part: a stat block is a deep nested object (actions, spellcasting,
  limited-use). You do **not** want 8 join tables to reconstruct one monster.

Postgres `JSONB` lets you store the whole Creature/Spell object as a document in
one column **and** keep real foreign keys + indexes around it. Best of both.

> A hosted Postgres (Supabase, Neon, RDS) also gives you auth + realtime
> subscriptions for free later — directly useful for the phase-2 player view.

---

## Schema (tables)

```sql
users
  id              uuid pk
  email           text unique
  created_at      timestamptz

-- user-created creatures (monsters + NPCs). SRD ones are seeded with owner_id NULL.
creatures
  id              uuid pk
  owner_id        uuid fk users  null   -- NULL = shipped SRD, readable by all
  source          text                  -- 'srd-5.2' | 'custom' | 'ddb-import'
  name            text
  data            jsonb                  -- the full Creature object from the schema
  created_at      timestamptz
  updated_at      timestamptz
  index (owner_id), index (name)

spells
  id              uuid pk
  owner_id        uuid fk users  null
  source          text
  name            text
  data            jsonb
  index (owner_id)

players                      -- PCs the DM tracks (lightweight, not full sheets)
  id              uuid pk
  owner_id        uuid fk users not null
  campaign_id     uuid fk campaigns null
  data            jsonb       -- name, ac, hp, passivePerception, etc.

campaigns
  id              uuid pk
  owner_id        uuid fk users not null
  name            text

encounters
  id              uuid pk
  owner_id        uuid fk users not null
  campaign_id     uuid fk campaigns null
  name            text
  state           jsonb       -- the live Encounter object: round, activeIndex,
                              -- combatants[] (instantiated, with all live state)
  status          text        -- 'draft' | 'running' | 'done'
  updated_at      timestamptz
```

### Why `combatants` live inside `encounters.state` as JSONB

A combatant is a *snapshot instance* of a creature plus volatile combat state
(current HP, slots used, active effects). It is not a row you query across
encounters. Storing the whole encounter state as one JSONB blob means:
- saving combat progress = one row update (trivial autosave)
- no schema churn when you add a new effect field
- the encounter loads as a single object the front end can run directly

The tradeoff — you can't SQL-query "all combatants that are frightened across all
encounters" — is something you never need.

---

## Multi-tenant: the boundary you must get right early

Every user-owned row carries `owner_id`. **Every query filters on it.** With
hosted Postgres (e.g. Supabase) use **Row-Level Security** so the database itself
enforces "you can only read/write your own rows (plus SRD rows where owner_id is
NULL)." This is the one thing genuinely painful to retrofit — bolt-on tenant
isolation after launch is how data leaks happen. Turn RLS on from commit one.

A user sees: all SRD content (owner_id NULL) ∪ their own content. Never anyone
else's. Different DMs are fully isolated.

---

## How the lifecycle actually works

- **Custom monster:** DM fills the form → INSERT into `creatures` with their
  `owner_id`, `source:'custom'`. Appears in their library beside SRD monsters
  forever, across sessions and devices.
- **Adding to combat:** copy the creature's `data` into the encounter's
  `state.combatants[]` as an instance. **Snapshot, don't reference** — if the DM
  later edits the template, the in-progress fight shouldn't mutate. (Store
  `creatureId` too, for "open the source stat block," but combat reads the copy.)
- **Between sessions:** the encounter row persists with `status:'running'` and its
  full `state`. Reopen next week → load the JSONB → exactly where you left off,
  mid-round, effects and all.
- **Between DMs:** isolation by `owner_id` + RLS. Optional future sharing
  (publish a monster, share an encounter) is an explicit grant table later — but
  default is private.

---

## Phase 1 pragmatics

- Even single-device phase 1: use the hosted Postgres now. Auth + cross-device +
  the future player view all need it, and starting on IndexedDB means a migration.
- **Autosave the encounter** on every mutation (debounced) — DMs will close the
  tab mid-fight. The single-JSONB-blob design makes this one cheap UPSERT.
- Seed SRD content via a migration script that loads Open5e JSON → `creatures`
  / `spells` with `owner_id NULL`. Re-runnable when you update SRD data.

---

## Identity model: two tiers, anonymous is ephemeral

There are exactly **two** account states. "Signup" is the transition between
them, not a third state.

### Tier 1 — Anonymous (no account, no database writes)
- Can: browse the read-only **SRD compendium**, run encounters with SRD monsters,
  and **add players** (the one piece of custom data they get).
- Cannot: create custom monsters/spells, or persist anything.
- **All state is client-side and ephemeral** — held in memory + `sessionStorage`,
  never written to the database. No `owner_id`, no rows, nothing for the backend
  to own, clean up, or migrate.
- Dies when the tab/window closes. By design.

### Tier 2 — Signed-up (real account)
- Everything persists: custom creatures/spells, players, in-progress encounters,
  cross-device. This is where `owner_id` + Row-Level Security applies.
- Created via hosted auth (e.g. Supabase Auth) — email/password or social login.
  Don't hand-roll credential storage.

### Why anonymous data is deliberately NOT preserved
Persisting anon data server-side would force: orphaned-row cleanup jobs, an
anonymous→permanent **merge migration** on signup (genuinely fiddly), storage
bloat from abandoned sessions, and false durability promises that generate
support pain when a browser token vanishes. Making anon state ephemeral deletes
all of that. Signup becomes a clean upgrade with **nothing to migrate** — from
that moment forward, the user's stuff persists; there's no past anon data to
reconcile.

### Avoiding silent data loss (the one refinement)
"Lost on tab close" must be *chosen*, never a silent surprise mid-fight:
- Keep live state in memory + **`sessionStorage`** (tab-scoped, clears on close)
  as crash/reload insurance. Still client-only, still ephemeral, still never
  touches the DB — so it preserves the "no durable anon data" principle while
  surviving an accidental refresh.
- Use **`sessionStorage`, not `localStorage`** — the latter would persist across
  sessions and reintroduce exactly the durability headache we're avoiding.
- Fire a **`beforeunload` warning** when an anon user has unsaved work
  ("Your session isn't saved — sign up to keep it"). Loss is opt-in, not silent.

### Conversion lever
The impending loss of an anon user's **players + in-progress encounter** is the
single best prompt-to-signup moment — they've felt the value, and signup is what
keeps it. That's why anon users get players (not a gated feature): they need to
experience the payoff before being asked to commit.

---

## Summary answers

- **Real database?** Yes, Postgres with JSONB.
- **Custom content between sessions?** Rows in `creatures`/`spells` keyed to
  `owner_id`; persist indefinitely.
- **Players?** `players` table, lightweight JSONB, owned by the DM.
- **Between different DMs?** `owner_id` + Row-Level Security = full isolation;
  SRD content shared read-only via `owner_id NULL`.
- **In-progress combat?** The whole encounter state is one JSONB row, autosaved
  (for signed-up users; ephemeral in `sessionStorage` for anon).
- **Sign up or not?** Two tiers. Anonymous = SRD + players, ephemeral, no DB
  writes. Signed-up = everything persists. No third state; signup is the
  transition, and there's no anon data to migrate across it.
```
