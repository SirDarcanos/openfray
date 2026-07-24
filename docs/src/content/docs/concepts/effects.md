---
title: Effects & conditions
description: How OpenFray tracks conditions, advantage and disadvantage, bonuses, reminders, and effects that a saving throw ends.
---

During a fight, little things pile up: this creature is frightened, that one has
advantage, someone is blessed. OpenFray keeps track of all of it. Every one of these is
an **effect**, and they all work the same way.

## The kinds of effect

Whatever spell or ability caused it, what lands on a creature is always one of these:

| Kind                                  | Examples                                         |
| ------------------------------------- | ------------------------------------------------ |
| **A condition**                       | Prone, Frightened, Paralyzed, Poisoned           |
| **Attacks against it have advantage** | Faerie Fire, attacking a prone creature in melee |
| **Its own rolls have disadvantage**   | Vicious Mockery, Bane                            |
| **A bonus or penalty**                | Bless (+1d4), Bane (−1d4), +2 to armor class     |
| **A reminder**                        | a note to yourself, like "Hex: +1d6 on a hit"    |
| **Ends on a save**                    | something a saving throw shakes off              |

Conditions are just one kind of effect, so there's only one thing to learn. You tell
OpenFray what happened; it remembers it and works it into the right rolls.

## Adding an effect

Click a creature, then click **Apply effect**. Everything is in one box:

![The Apply effect box, with its duration, condition, modifier and reminder sections outlined in red and numbered one to four.](../../../assets/screens/apply-effect.png)

1. **How long it lasts.** Pick this first and it applies to everything you add here — a
   number of rounds, until the caster's next turn, until a save ends it, or until you
   clear it yourself.
2. **A condition.** Tap Prone, Grappled, Frightened, and so on. Tap it again to take it
   off.
3. **A bonus or penalty.** Choose advantage, disadvantage, or a number; what it applies
   to (attacks, saves, checks, or everything); and whether it's on the creature's own
   rolls or on rolls made against it. OpenFray writes out what you built in plain
   English before you apply it.
4. **A reminder.** For anything that doesn't fit the boxes above, type yourself a note.

You can apply several effects without closing the box. **Done** closes it.

Many spells add their effect for you — see [Spells](/docs/concepts/spells/).

## Where effects show up

Each effect shows as a small **badge** under the creature's name in the tracker — just
the name, so the row stays easy to read at a glance.

![A tracker row for an Ogre with a Frightened badge under its name, outlined in red.](../../../assets/screens/effect-badge.png)

The details live in the **Applied effects** list, in the controls beside the stat block.
There, each effect shows how it ends and carries its own buttons.

![The Applied effects list showing "Frightened · DEX save DC 10" with Roll save and Clear buttons, outlined in red.](../../../assets/screens/applied-effects.png)

- **Clear** removes it.
- For an effect that ends on a save, **Roll save** rolls it, and the line shows the
  ability and number needed.

## How long effects last

Every effect knows when it ends, and the Applied effects list tells you:

- effects that last a number of **rounds** count down and show what's left ("10 rounds
  left"); once that's more than about ten minutes, it shows the time instead ("1 hour
  left");
- **ends on a save** shows the ability and number, like `WIS save DC 15`;
- some clear the next time the creature rolls (Vicious Mockery);
- some clear when the creature that caused them takes its next turn;
- the rest stay until you clear them, and keep the spell's own wording where OpenFray
  can't count it down ("8 hours").

### Effects a saving throw ends

Some effects hang on until the creature makes a saving throw — a paralysis, an ongoing
burn. Each one gets **its own** save: two effects that happen to need the same number
still roll separately, because they came from different sources. On a creature's turn,
OpenFray rolls these for you, at the start or end of the turn as you chose. For a player,
use **Roll save** to record their roll, or just **Clear** it when they pass.

## Concentration

Mark a creature as **concentrating**, and add the spell's name if you like. Since
concentration is what keeps a spell going, **ending it removes that spell's effects from
everyone at once** — break the caster's concentration on Bless and all three allies lose
it together. Concentration also drops on its own when its timer runs out, and a creature
can be asked to make a concentration check when it takes damage.
