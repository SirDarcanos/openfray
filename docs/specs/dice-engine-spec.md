# Dice Engine — Randomness, Mechanics, and UX

## Part 1 — Randomness done right

### Goal
Not "true" randomness — **unbiased, uniform, and unpredictable to a human**, with
enough transparency that players trust it. Casino-grade is overkill; statistically
flat and auditable is the bar.

### Rules
1. **Entropy source: the platform CSPRNG.** Browser → `crypto.getRandomValues()`
   into a `Uint32Array`. Not `Math.random()` (spec allows low-quality PRNGs;
   you don't control the quality across engines).
2. **Reject modulo bias.** Never `value % sides`. To roll 1..N:
   ```js
   function rollDie(sides) {
     const max = Math.floor(0xFFFFFFFF / sides) * sides; // largest unbiased ceiling
     const buf = new Uint32Array(1);
     let x;
     do { crypto.getRandomValues(buf); x = buf[0]; } while (x >= max);
     return (x % sides) + 1;
   }
   ```
   The reject-and-redraw loop is what makes every face exactly equally likely.
3. **One draw per die.** Roll 4d6 = four independent `rollDie(6)` calls. Never
   derive multiple dice from one random number.
4. **No "anti-streak" / "feels fair" tampering.** Real dice clump. A generator
   that suppresses repeats is detectably non-uniform over a campaign and destroys
   trust when noticed. Be honestly flat.
5. **Trust through transparency, not through fudging** (see UX §roll log).

### Optional, later: provable fairness
If players ever doubt it, you can add a seed + hash audit trail (commit to a
hashed seed before the session, reveal after) so rolls are verifiable. Not phase 1,
but the architecture (a single `roll()` chokepoint) leaves the door open.

---

## Part 2 — Engine mechanics

### One chokepoint
Everything routes through one function. Presets, manual box, mass save, monster
attacks — all call this. That's also where effect-awareness and the log live.

```js
roll(formula, ctx)
// formula: "1d20+7", "2d6+4", "4d6kh3", "1d20adv+5"
// ctx: { rollerId?, targetId?, kind?: "attack"|"save"|"check"|"damage"|"raw" }
```

### Formula grammar
```
NdM                standard
NdM+K / -K         modifier
1d20adv  1d20dis   advantage / disadvantage (roll 2 d20, keep hi/lo)
NdMkhX  NdMklX     keep highest / lowest X (stats, some abilities)
NdM!               exploding (optional, homebrew)
+1d4               additive sub-roll (Bless), composes with the above
" fire" etc.       trailing word = damage type tag (metadata, not math)
```

### Effect-aware resolution (the differentiator)
When `ctx.kind` is attack/save/check and `rollerId`/`targetId` are present:
1. Gather `outgoing` effects on roller + `incoming` effects on target whose
   `applies` matches the roll kind.
2. **Net the adv/disadv:** any number of advantage sources + any number of
   disadvantage sources = at most one step each way; one of each **cancels to a
   straight roll** (5e rule). Result records *why*.
3. **Inject flatBonus effects** into the formula (Bless → append `+1d4`).
4. Roll. **Consume** `consumeOnRoll` effects that fired. Return result + an
   `applied[]` list naming each effect that touched the roll.

### Result object (drives both UI and log)
```jsonc
{
  "formula": "1d20adv+7",
  "kind": "attack",
  "dice": [{ "sides": 20, "results": [4, 18], "kept": 18 }],
  "modifier": 7,
  "subRolls": [{ "label": "Bless", "formula": "1d4", "results": [3], "total": 3 }],
  "total": 28,
  "crit": true,                 // nat 20 on a d20 attack
  "fumble": false,              // nat 1
  "advantageState": "advantage",
  "applied": [                  // transparency: what modified this roll & why
    { "source": "Reckless Attack", "effect": "advantage" },
    { "source": "Bless", "effect": "+1d4 (3)" }
  ]
}
```

### Crit handling
Crit doubles **dice, not modifiers**. On a crit attack, the follow-up damage roll
doubles dice count (`2d10+8` → `4d10+8`). The engine flags `crit`; the damage call
reads it. Keep the rule in one place.

---

## Part 3 — HI / UX

The dice UX has three jobs: **be fast**, **be readable mid-combat**, **be trusted**.

### A. Rolling from the stat block (the 90% path)
- Each Action renders as a tappable chip: **"Bite +14"**. Tap → rolls to-hit
  instantly, result appears inline on the stat block.
- If it hits (DM eyeballs vs target AC, or app compares if AC known), a **"roll
  damage"** affordance is right there showing `2d10+8 + 2d6 fire`. Tap → damage.
- Adv/disadv auto-applied from effects shows as a small badge on the result
  ("ADV — Reckless Attack") so the DM sees *why* and can override with one tap.
- **Never make the DM type a formula for a monster's own action.** The stat block
  is the dice tray.

### B. The manual / quick-roll bar (the 10% path)
- Always-visible compact input: type `2d8+3`, or tap **d20 d12 d10 d8 d6 d4 d100**
  quick buttons. Long-press a die = roll with adv/disadv.
- For skill checks/saves of a *creature*: tap the creature → its saves/skills are
  chips (from its schema) → tap to roll. PCs usually roll their own, so the DM
  rarely needs this for players.

### C. Result rendering (readability)
- **Big total, small detail.** The total is the largest thing on screen; the
  breakdown (individual dice, modifiers, sub-rolls) sits beneath in small type.
- **Show both dice on adv/disadv**, dim the discarded one — players want to see
  the 18 it kept *and* the 4 it dropped.
- **Crit = green flourish, fumble = red.** Instant read across the table.
- Damage results carry their **type tag** as a colored pill (fire/piercing) so
  applying resistances is eyeball-fast.

### D. The roll log (this is what creates trust)
- A scrollable, timestamped feed of every roll with full breakdown and the
  `applied[]` reasons. "Why did that have advantage?" is answerable in one glance.
- **Visible, honest history defeats the 'this RNG is rigged' complaint** far
  better than tampering with the dice would. When a player feels unlucky, you
  scroll the log: the dice were flat, they just rolled badly. Transparency is the
  trust mechanism.
- Optional later: per-die histogram ("your d20 distribution this session") — fun,
  and it visibly demonstrates uniformity.

### E. Mass-save rendering (reuse)
The group-save resolution list (from the tracker plan) is just N save-rolls
rendered as a pass/fail table — same result objects, same components. Build the
single result renderer well and the mass-save UI is mostly free.

### Speed budget
- Monster attack: **1 tap** (chip) → result. Damage: **1 more tap**.
- Manual roll: **1 tap** (quick die) or type-and-enter.
- No confirmation dialogs on rolls. Rolls are cheap and re-rollable; never gate
  them behind a modal.
```
