# Initiative Loop — Edge-Case Rules

These are the rules the loop enforces. Each is written as table behavior first,
then the state implication. Decide them here so `activeIndex`, round/turn ticks,
and effect durations never have to change shape later.

The loop owns three pieces of state: `round` (int), `activeIndex` (int into the
ordered list), and `combatants[]` (sorted by initiative desc, ties broken by Dex
then a stable tiebreak). **Every rule below must keep `activeIndex` pointing at
the same creature it pointed at before the list mutated** — that's the whole game.

---

## 1. Identity, not position

`activeIndex` is a convenience, but turn ownership is by **combatantId**.
Any mutation that reorders the list must re-find the active creature by id and
reset `activeIndex` to its new position. Never advance by raw index across a
mutation. This single discipline prevents 90% of "whose turn is it?" bugs.

---

## 2. Adding a combatant mid-combat

**Table:** a reinforcement arrives on round 3.

- Prompt for initiative (roll or manual). Insert into sorted position.
- **If inserted before `activeIndex`:** the active creature shifted down one;
  re-find by id, bump `activeIndex`. The new creature acts **next round** (its
  initiative already passed this round) unless its initiative is later in the
  current round than the active creature — then it acts this round.
- Rule of thumb the code enforces: a creature added this round acts this round
  **only if** its initiative < the active creature's initiative (i.e. still
  upcoming in the current pass).

---

## 3. Dead but not removed

**Table:** the ogre drops. It might get revived. Don't delete it.

- HP 0 → status `down` (PCs) or `dead` (monsters, by default). Stays in list.
- **Turn skipping:** "Next turn" skips any `dead`/`down` creature automatically,
  but it remains visible, greyed, in initiative order.
- Revivify / healing above 0 → status back to `active`, no re-roll of initiative,
  same slot in order.
- Its Effects: `outgoing` effects it was projecting (e.g. an aura) clear on death;
  `incoming` effects on it are kept but irrelevant while dead. (Cheap to keep,
  avoids losing state on revive.)
- **Monster death while concentrating** → its concentration breaks immediately;
  any effects whose `source` is this creature and whose duration is
  `untilSourceTurn` resolve now (they'll never get another turn) — clear them.

---

## 4. Removing a combatant

**Table:** fled the scene, or summoned creature expires.

- Hard remove from list (distinct from death). Re-find active by id, fix index.
- If the **removed creature is the active one**, advance to the next valid
  creature *before* removing, so `activeIndex` lands correctly.
- Cascade: clear all Effects where `source` == removed id. A debuff with no
  caster left is gone.

---

## 5. Delay / Ready

**Table:** "I hold my action until the door opens."

- Phase 1 minimum: **manual reorder.** Let the DM drag a creature to a new slot
  in the order. `initiative` value updates to sit between its new neighbors.
- A readied action that triggers out of turn: DM just rolls it ad hoc (the dice
  engine doesn't care whose "turn" it is). No special state needed in phase 1.
- Don't model the full readied-trigger system now; drag-to-reorder covers it.

---

## 6. Duplicate monsters

**Table:** four goblins.

- Each is its own Combatant with its own `combatantId`, auto-labelled A/B/C/D.
- **Individual initiative or shared?** Offer both at add-time: "roll once for the
  group" (all share one initiative, sit adjacent) or "roll each." Default to
  shared for speed; DMs split them rarely.
- **Individual HP** always — roll `hpFormula` per goblin or use the average.
  Their resource state (slots, recharge) is independent.

---

## 7. The turn-advance sequence (exact order)

This order matters because Effects tick relative to turns. On **"Next turn"**:

```
1. END the ending creature's turn:
   a. tick down its `rounds`-duration effects/conditions; clear those hitting 0
   b. resolve its `saveEnds` conditions (roll the save, clear on success)
   c. reset its legendaryRemaining = perRound
2. ADVANCE activeIndex to next non-dead/non-removed creature (by id walk)
3. IF the pointer wrapped past the end of the list:
   a. round++
   b. fire lair actions (initiative count 20 slot) — NOT BUILT yet, and moot for
      2024 content: the 2024 Monster Manual removed lair actions as a mechanic
      (folded into normal/legendary actions), and the SRD never carried them, so
      no SRD creature has any. Keep this step as a TODO for when 5.0 (2014) and
      Kobold Press content arrive, where lair actions still exist. See
      `docs/compendium-ingest.md`.
4. START the new active creature's turn:
   a. clear/resolve effects keyed to "start of this creature's turn"
   b. resolve `untilSourceTurn` effects whose source == new active creature
      (e.g. Reckless Attack advantage on the barbarian ends as his turn begins)
   c. roll recharge dice for its limitedUse abilities (Recharge 5–6 → available?)
```

> The subtle one is 4b. "Until the start of the source's next turn" is the most
> common D&D duration, and it resolves when that creature *becomes active*, not
> when it finishes. Tick it at START, not END.

---

## 8. Round 0 / starting combat

- Rolling initiative builds the order; combat starts at `round 1`, `activeIndex`
  at the top of the list.
- Surprise (phase 1 minimum): let the DM mark creatures "surprised" → they're
  skipped on round 1 only, via a one-round `skipTurn` effect. Don't overbuild.

---

## 9. Initiative ties

- Break by Dex score, then PCs before monsters (common house rule; make it a
  setting later), then stable insertion order. Deterministic so reordering is
  never surprising.

---

## What this guarantees

- `activeIndex` is always re-derived from the active `combatantId` after any
  list mutation → no lost turns.
- Every effect duration type (`rounds`, `untilSourceTurn`, `saveEnds`,
  `consumeOnRoll`, `manual`) has exactly one well-defined moment it's evaluated.
- Death is non-destructive; revive is free.
- The dice engine can be built next against a loop whose ticks won't move.
```
