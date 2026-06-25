# Content Licensing — Instructions for the Build Agent

**Audience:** the AI agent (and maintainer) implementing OpenFray's compendium and
attribution. This tells you which licenses govern the **game content** and exactly
what to do about them. It does **not** cover the project's own code license
(AGPL-3.0) — that's separate; see [`README`](../README.md) / [`LICENSE`](../LICENSE).

> ⚠️ **Not legal advice.** These are implementation instructions based on WotC's
> public statements and the license texts. For anything commercial, escalate to a
> human / lawyer before relying on this.

## The decision (already made — do not re-litigate)

**Honor each source's actual license, preferring CC-BY > ORC > OGL.** Never assume
CC-BY for content that isn't offered under it.

- **WotC SRD content (5.1 and 5.2)** is used under **CC-BY-4.0**. SRD 5.2 is CC-BY-only;
  SRD 5.1 is dual-licensed (OGL 1.0a *or* CC-BY-4.0) and we elect CC-BY. **We never apply
  the OGL to WotC SRD content** — we have CC-BY there and prefer it.
- **Third-party content (e.g. Kobold Press)** is honored under **its own license, never
  assumed CC-BY**: **ORC** where a title offers it, otherwise **OGL 1.0a**. Most Tome of
  Beasts volumes are OGL 1.0a; newer Kobold Press titles use ORC.

### Why the preference order (CC-BY > ORC > OGL)

CC-BY is the lightest (credit + license link + note changes). ORC is similar but with a
Reserved-Material concept. The OGL is the heaviest: it carries a verbatim **Section 15**
copyright chain, requires the **full license text** to travel with the content, and
splits a book into **Open Game Content** (usable) vs **Product Identity** (not). So when
a source offers more than one, take the lightest. Don't reach for the OGL out of habit —
only use it for a source that's *only* OGL.

**Net rule:** WotC SRD → CC-BY-4.0 (never OGL). Third-party → its own license, ORC over
OGL when both are offered, never assumed CC-BY. Using a source under the OGL pulls in all
of the OGL's obligations (below) — only its declared Open Game Content, the full license
text, and the Section 15 chain.

## What CC-BY-4.0 actually requires (real obligations — do them)

Choosing CC-BY is not "no strings." Wherever we use SRD content we must:

1. **Give appropriate credit** to the creator (Wizards of the Coast), including the
   title of the work and the author/licensor as they've designated.
2. **Provide a link to the license** (the CC-BY-4.0 deed / legal text).
3. **Indicate if changes were made** — we do make changes (reformatting, restructuring
   into our schema, editing), so we must state that.
4. **Not imply endorsement** by WotC of OpenFray.

For a software app, an **in-app attribution/about screen + a `CREDITS.md` file** is the
standard, accepted way to satisfy these.

---

## Tasks

### Task 1 — `CREDITS.md` at the repo root
Holds the content attributions (CC-BY for SRD; third-party per their own license).
When you ingest, fill in **WotC's exact specified attribution string** for each SRD
version verbatim — do not paraphrase. Already scaffolded; see [`/CREDITS.md`](../CREDITS.md).

### Task 2 — In-app attribution surface
An About/Credits screen, reachable from a footer link, displaying the same
attributions. **Must exist before the compendium ships to users.** It can link out to
`CREDITS.md` / the repo, but the credit to WotC + the CC-BY link must be reachable
in-app. This is **separate** from the AGPL §13 "Source" link (which points to the code
repo). The app needs **both**: a "Source" link (AGPL, for the code) and a content
attribution (CC-BY, for the SRD data). Don't conflate them.

### Task 3 — Per-source tagging at ingestion (build step 8)
Every creature/spell already carries `source` and `edition` (see
[`AGENTS.md`](../AGENTS.md) / schema). Ensure each record's `source` is specific enough
to drive correct attribution (e.g. `srd-5.2`, `srd-5.1`, `kobold-press-tob`) so credits
can be generated/verified from the data rather than by hand.

### Task 4 — Using a source under the OGL (third-party only)

When a third-party source is **OGL-only** (e.g. Tome of Beasts 1–3), the OGL is now
permitted — but it has real obligations, all of which must be met:

- **Ship only that book's declared Open Game Content.** Read the book's OGC/Product
  Identity declaration (usually a legal page near the front) and take *only* what it
  designates as Open Game Content. Drop everything declared Product Identity — artwork,
  sidebars, trade dress, "fiction"/story/background, and any entity the book lists as PI.
  (Example: ToB 3 declares monster *names, descriptions, statistics, and abilities* as
  OGC, but the Animal Lords / Archangels / Archdevils / Demon Lords / Fey Ladies / Fey
  Lords / Fiend Lords as entirely PI — those creatures are excluded wholesale.)
- **Reproduce the full OGL 1.0a text** in `CREDITS.md` and the in-app credits.
- **Carry the verbatim Section 15 copyright chain** from that book — every upstream
  copyright line, unaltered, plus our own.
- **Designate our own Open Game Content** and keep the source's copyright notice.
- Prefer **ORC** over OGL when a title offers both; never use the OGL for WotC SRD.

### Task 5 — Do NOT do these
- Do **not** ingest WotC content excluded from the SRD (Beholder, Mind Flayer,
  Displacer Beast, etc.) — it is not licensed to us under CC-BY or anything else.
  SRD-only for WotC content; everything else comes from third-party open sources or
  the user's own custom entries.
- Do **not** ship a third-party source's **Product Identity** (art, fiction, PI names,
  sidebars) — only its declared Open Game Content / Licensed Material.
- Do **not** paraphrase or omit the required attribution wording a source specifies
  (WotC's CC-BY string, an OGL Section 15 line) — reproduce it verbatim.
- Do **not** assume a third-party source is CC-BY. If its license is unclear, **flag it
  to the maintainer** rather than guessing.

---

## Verification checklist (before the compendium ships)

- [ ] `CREDITS.md` carries the correct attribution **per source**: WotC's exact CC-BY
      string for SRD; the full OGL text + verbatim Section 15 chain for any OGL source;
      the ORC notice for any ORC source.
- [ ] WotC SRD attribution uses WotC's exact string, with "changes made" stated.
- [ ] Each third-party source ingested is under its declared license, with only its
      Open Game Content / Licensed Material present — no Product Identity.
- [ ] In-app About/Credits screen shows the per-source content attribution + license.
- [ ] App footer has BOTH: a "Source" link (AGPL §13, → repo) and access to the
      content credits.
- [ ] No SRD-excluded WotC IP (beholders et al.) present in ingested data.

If any item is unclear or a third-party license looks ambiguous, **flag it to the
maintainer rather than guessing** — licensing mistakes are cheap to prevent and
expensive to fix.
