# Phase 1 — The Tracker (definitive plan)

**Mindset:** build single-DM, single-device. Design every shape so the player
view can be added later **without migration** — visibility flags exist now, they
just aren't rendered yet.

**Phase 1 scope (the spine):**
initiative loop · HP/damage/heal · spell slots + legendary + lair + limited-use ·
concentration · conditions with durations · **active effects (adv/disadv + debuffs)** ·
**mass save** · dice (presets + manual) · SRD creature library + custom-creature form.

**Explicitly NOT phase 1:** realtime player view, DDB/Roll20 import. Schema
supports both; we don't build them yet.

---

## The unifying idea: combat is relational

The new requests (Reckless Attack, Vicious Mockery, mass save) aren't per-creature
facts — they're **relationships and modifiers that the dice engine consults at
roll time.** So the tracker has one new first-class concept beyond the schema doc:
the **Effect**. Get this in now; it's painful to retrofit.

---

## Effect (new — attach to a Combatant)

An Effect is anything that should change a future roll or remind the DM of
something. Conditions become a *kind* of Effect, so there's one system, not two.

```jsonc
{
  "id": "uuid",
  "name": "Vicious Mockery",
  "icon": "debuff",                  // for the badge on the combatant row
  "source": "uuid-of-bard",          // who caused it (for "until source's next turn")

  // WHAT IT DOES MECHANICALLY (engine reads this; null = reminder-only)
  "modifier": {
    "applies": "attackRolls",        // attackRolls | savingThrows | abilityChecks | ac | "all"
    "mode": "disadvantage",          // advantage | disadvantage | flatBonus
    "value": null,                   // for flatBonus, e.g. -2
    "direction": "outgoing"          // outgoing = this creature's own rolls
                                     // incoming = rolls made AGAINST this creature
  },

  // WHEN IT ENDS
  "duration": {
    "type": "consumeOnRoll",         // consumeOnRoll | rounds | untilSourceTurn | saveEnds | manual
    "rounds": null,                  // for type:rounds
    "save": null                     // for saveEnds: { ability, dc }
  },

  "note": "Disadvantage on next attack roll"   // always shown to DM as a reminder
}
```

### How the three new cases map to Effects

| Player does… | Effect on whom | modifier | duration |
|---|---|---|---|
| Barbarian Reckless Attack | on the **barbarian** | `{applies:attackRolls, mode:advantage, direction:incoming}` | `untilSourceTurn` |
| Vicious Mockery | on the **target** | `{applies:attackRolls, mode:disadvantage, direction:outgoing}` | `consumeOnRoll` |
| Faerie Fire, "I have advantage on it" | on the **target** | `{applies:attackRolls, mode:advantage, direction:incoming}` | `rounds` |
| Bless (+1d4) | on the **ally** | `{applies:"all", mode:flatBonus, value:"1d4"}` | `rounds` |

> **Direction is the trick.** `incoming` advantage on the barbarian means: when
> *anyone* rolls an attack *against* the barbarian, the engine grants advantage.
> `outgoing` disadvantage on a mocked goblin means: when *the goblin* attacks,
> disadvantage. One field captures both Reckless Attack and Vicious Mockery.

### Phase-1 rendering: badge first, automation second

- **MVP (must):** every Effect shows as a badge on the combatant row with its
  `note`. Tap the combatant → see the list → the DM is *reminded*. This alone
  beats every existing tracker.
- **Magic (should, if time):** when the DM rolls an attack/save, the engine scans
  the roller's `outgoing` effects **and** the target's `incoming` effects,
  auto-resolves net advantage/disadvantage (one of each cancels), and pre-selects
  it in the dice prompt. `consumeOnRoll` effects auto-clear after firing.

Even if you ship only the badge in phase 1, the data is already shaped for the
automation, so it's a UI upgrade later, not a migration.

---

## Mass save (the Fireball flow)

Self-contained. Reads `saves` / ability mods already on each Combatant.

```
1. DM taps "Group Save"
2. Multi-select combatants (checkbox on each row)
3. Enter: ability (DEX), DC (15), on-save rule (half | none | negates)
4. App rolls a SEPARATE d20 per creature + that creature's save bonus
   → shows list:   Goblin A   d20(7)+2  =  9   FAIL
                   Goblin B   d20(16)+2 = 18   SAVE
                   Ogre       d20(11)+0 = 11   FAIL
   → ALSO folds in any 'savingThrows' Effects (Bless +1d4, disadvantage, etc.)
5. DM types ONE damage number (player tells them: "24 fire")
6. Apply → failures take 24, saves take 12 (per on-save rule), in one tap
7. Auto-trigger concentration checks on any damaged concentrator
```

Output is a reusable "resolution list" component — you'll want the same
pass/fail UI for single-target saves too.

---

## Initiative loop (the actual spine)

State: `round`, `activeIndex`, ordered `combatants[]`.

**On "Next turn":**
1. Resolve end-of-turn duration ticks for the creature whose turn is ending
   (decrement `rounds` effects/conditions; clear expired; reset its
   `legendaryRemaining` to `perRound`).
2. Advance `activeIndex`; if it wraps, `round++` and fire **lair actions** on
   initiative count 20.
3. Re-evaluate `untilSourceTurn` effects whose `source` is the new active creature
   (e.g. Reckless Attack advantage drops when the barbarian's turn comes round).

**Edge cases to decide now (cheap now, expensive later):**
- Adding a combatant mid-combat (where in order? what initiative?)
- Removing/dead combatants — skip turn but keep in list (revivify happens)
- Duplicate monsters auto-labelled A/B/C and rolled with individual HP
- Delaying / readied actions — at minimum, manual re-order of the turn list
- A creature dying while concentrating → its concentration effects clear

---

## Dice engine — now effect-aware

Same formula grammar as the schema doc, plus: a roll **takes the roller and
(optional) target** so it can consult Effects.

```
roll(formula, { rollerId, targetId, kind })
  → gather outgoing effects on roller + incoming effects on target
  → net advantage/disadvantage (adv + disadv = straight roll)
  → apply flatBonus effects (Bless adds +1d4 to the formula)
  → roll, consume any consumeOnRoll effects, return result + what was applied
```

The result object should say **why** it rolled with advantage ("Reckless Attack")
so the DM trusts it and can override.

---

## Phase 1 build order

1. Creature + Action + **Effect** schema (lock all three together)
2. Encounter + Combatant; the initiative loop with turn/round ticks
3. HP / damage / heal; spell slots, legendary, lair, limited-use, recharge
4. Conditions + Effects as one system; **badges/reminders on rows**
5. Dice engine (presets + manual)
6. **Effect-aware rolling** (auto adv/disadv) — upgrade of #5
7. **Mass save** resolution flow
8. SRD 5.2 library + custom-creature form
9. Concentration auto-checks wired into damage + mass save

Ship-it line: through #5 you have a better tracker than what exists. #6–7 are
the differentiators. #8–9 make it pleasant to live in.
```
