# Content Licensing — Instructions for the Build Agent

**Audience:** the AI agent (and maintainer) implementing OpenFray's compendium and
attribution. This tells you which licenses govern the **game content** and exactly
what to do about them. It does **not** cover the project's own code license
(AGPL-3.0) — that's separate; see [`README`](../README.md) / [`LICENSE`](../LICENSE).

> ⚠️ **Not legal advice.** These are implementation instructions based on WotC's
> public statements and the license texts. For anything commercial, escalate to a
> human / lawyer before relying on this.

## The decision (already made — do not re-litigate)

**Use CC-BY-4.0 for ALL game content. Do not use the OGL for anything.**

Every piece of SRD content OpenFray ingests is attributed under **Creative Commons
Attribution 4.0 International (CC-BY-4.0)**. The Open Game License (OGL) is **not
used by this project, in any version.**

### Why (so you don't "helpfully" reintroduce the OGL)

- **SRD 5.2** (the 2024 / 5.5e content — Open5e `srd-2024`) is released by WotC under
  **CC-BY-4.0 only**. There is no OGL option for it and no OGL decision to make. This
  is the bulk of our content.
- **SRD 5.1** (the 2014 / 5.0 content — Open5e `srd-2014`), if we ingest it, is
  **dual-licensed** (OGL 1.0a *or* CC-BY-4.0). Dual-licensed means a user picks **one**
  license and complies with that one — not both. We elect **CC-BY-4.0** for this
  content too, so the entire compendium sits under a single, consistent license and we
  never invoke the OGL.
- **"OGL 1.1" and "OGL 1.2" do not exist** as usable licenses — abandoned drafts from
  the 2023 controversy. The only real OGL is 1.0a, and we still don't use it. If you
  ever find yourself reaching for OGL boilerplate (a "Section 15" copyright chain,
  "Product Identity" declarations, etc.), **stop** — that means something has gone
  wrong; we are CC-BY-only.

**Net rule:** SRD content (5.1 and 5.2) → CC-BY-4.0. OGL → never. Third-party content
(e.g. Kobold Press) → its own license, honored separately (see below).

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

### Task 4 — Do NOT do these
- Do **not** add OGL text, a "Section 15," or "Product Identity" declarations.
- Do **not** ingest WotC content excluded from the SRD (Beholder, Mind Flayer,
  Displacer Beast, etc.) — it is not under CC-BY and we have no license to it.
  SRD-only for WotC content; everything else comes from third-party open sources or
  the user's own custom entries.
- Do **not** paraphrase or omit the required attribution wording WotC specifies — use
  it as given.
- Do **not** treat third-party (Kobold Press, etc.) content as CC-BY by default —
  honor each source's actual license. If a source is OGL-only, **flag it to the
  maintainer** rather than reintroducing the OGL.

---

## Verification checklist (before the compendium ships)

- [ ] `CREDITS.md` exists with SRD 5.2 attribution (CC-BY-4.0 + license link +
      "changes made"), using WotC's exact attribution string.
- [ ] If 5.1 ingested: its CC-BY-4.0 attribution present; OGL not referenced.
- [ ] Each third-party source ingested has its own license honored and credited.
- [ ] In-app About/Credits screen shows content attribution + CC-BY link.
- [ ] App footer has BOTH: a "Source" link (AGPL §13, → repo) and access to the
      content credits (CC-BY).
- [ ] No OGL boilerplate anywhere in the repo or app.
- [ ] No SRD-excluded WotC IP (beholders et al.) present in ingested data.

If any item is unclear or a third-party license looks ambiguous, **flag it to the
maintainer rather than guessing** — licensing mistakes are cheap to prevent and
expensive to fix.
