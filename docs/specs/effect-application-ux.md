# Applying Effects — Fast, Not a Character Sheet

## The line we will not cross

**We track consequences on the board, never abilities on a sheet.**

The DM does not tell the app "this fighter is a Battle Master with Trip Attack."
The DM tells the app "this goblin is now Prone." The player's sheet/DDB is the
source of truth for what they *can* do; we are the scratchpad for what *happened*
and what we have to *remember*.

This single rule is what stops the Effect system from exploding. A sorcerer has
dozens of metamagic + spell combos — we model zero of them. We only ever model
the handful of *board states* they produce: a condition, an advantage/disadvantage
flag, a flat modifier, or a plain text reminder. There are only ~6 shapes of
consequence in all of 5e, no matter how many class features exist.

---

## Every effect is one of 6 shapes

No matter the class feature, what lands on the board is always one of these:

| Shape | Example causes | Data |
|---|---|---|
| **Condition** | Trip→Prone, Grappler→Grappled, Hold Person→Paralyzed | a named condition |
| **Disadvantage on it** | Vicious Mockery, Trip (its attacks), Bane | `outgoing disadvantage` |
| **Advantage against it** | Faerie Fire, Reckless, prone (melee), Menacing | `incoming advantage` |
| **Flat bonus/penalty** | Bless +1d4, Bane −1d4, Bardic Inspiration | `flatBonus ±` |
| **Marked / reminder** | Hunter's Mark, Hex, Hexblade's Curse, "Sharpshooter this turn" | `note only` |
| **Ongoing damage / save-ends** | Ensnaring Strike, Ear-Splitting, persistent fire | `saveEnds` + note |

The Effect schema we already designed expresses all six. So the UI's whole job is
to let the DM pick "which creature + which shape" as fast as possible.

---

## The interaction: a quick-apply sheet, not a form

Tapping any combatant opens a radial/quick bar with the **conditions and the
~6 shapes as one-tap chips**. The flow for the three nightmare examples:

- **Barbarian Reckless Attack:** tap barbarian → "Adv against" chip → done.
  (one tap on the creature, one chip). Auto-expires start of his next turn.
- **Vicious Mockery on goblin:** tap goblin → "Disadv on next attack" chip → done.
  Auto-consumes when the goblin attacks.
- **Battle Master Trip on ogre:** tap ogre → "Prone" condition chip → done.

The chips are ordered by table frequency (Prone, Grappled, Frightened, Restrained,
Adv-against, Disadv-on, Bless, then "More…"). The long tail lives behind "More…"
and a free-text "Custom reminder" that's always one tap away — because you will
never enumerate every class feature, and you shouldn't try.

### Custom reminder is the escape hatch

For anything weird ("Hexblade's Curse: +prof to damage, crit on 19-20 vs this
target"), the DM types a short note → it's a `note-only` Effect with a chosen
duration. The app reminds; the DM adjudicates. **Never try to mechanize the
long tail.** A reminder badge that says "Hex: +1d6 necrotic" is enough — the DM
adds the d6 when they roll. Trying to auto-apply every feature is the road back
to character-sheet management.

---

## Duration is picked from presets, not typed

Effects need an end condition, but typing durations is slow. Offer 4 chips:

- **"This turn / next attack"** → `consumeOnRoll` or end of current turn
- **"Until my next turn"** (source-relative) → `untilSourceTurn`
- **"1 minute / 10 rounds"** → `rounds`
- **"Save ends"** → prompts ability + DC once
- **"Manual"** (until I clear it) → default fallback

Most chips carry a *default* duration so the DM usually picks nothing:
Reckless = untilSourceTurn, Vicious Mockery = consumeOnRoll, Bless = 10 rounds,
Prone = manual. The DM only touches duration when it's unusual.

---

## Source attribution without sheets

When the DM applies an effect, the app asks "from whom?" *only if it matters*
(i.e. duration is `untilSourceTurn` or the effect is concentration-linked).
Otherwise it skips the question. Picking a source is one tap on a combatant —
not a sheet lookup. This keeps Hunter's Mark / concentration links working
without ever knowing the ranger's build.

---

## Concentration ties in here, free

If the applied effect came from a spell, one optional toggle: "concentration."
If on, it links to the caster's single concentration slot — applying a second
concentration effect from the same caster prompts "drop Hunter's Mark?" The DM
never tracks this on a sheet; the board does it.

---

## Why this scales to 4 players + 6 monsters

- Adding an effect is **1 creature tap + 1 chip** (+ optional duration). Sub-2s.
- The DM is transcribing what players announce, at the speed they announce it.
- Badges on each row mean the board *shows* the current relational state, so the
  DM offloads memory to the screen instead of holding it in their head.
- Zero class knowledge in the app → no combinatorial explosion. Six shapes,
  however many features exist.

---

## What we deliberately do NOT build

- No class/subclass feature lists.
- No "cast spell" buttons for PCs (that's their sheet/DDB).
- No resource tracking for PCs beyond what the DM chooses to jot.
- No attempt to know what any ability *does* — only what it *leaves on the board*.

The test for any future feature: **does it require knowing a PC's build?**
If yes, it's out of scope — it belongs on their sheet.
```
