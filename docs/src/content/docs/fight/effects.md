---
title: Effects & conditions
description: How OpenFray tracks Dungeons and Dragons 5e conditions, advantage and disadvantage, bonuses, reminders, and effects that a saving throw ends.
keywords:
  - Dungeons and Dragons 5e conditions
  - DnD 5e status effects tracker
  - 5e advantage and disadvantage
  - condition and effect tracker
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

Click the creature in the tracker, then click **Apply effect** in the controls beside its
stat block. Everything happens in one box, and it stays open while you work — so you can
put several things on the same creature before closing it.

![The Apply effect box with its duration, reminder, condition and bonus-or-penalty sections outlined in red and numbered one to four.](../../../assets/screens/apply-effect.png)

**1. Set how long it lasts.** This setting applies to everything you add while the box is open, so start here:

| Choice                      | Use it for                                                                                                                                                  |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1 round** … **24 hours**  | anything with a stated duration — a spell, a potion                                                                                                         |
| **This turn / next attack** | something used up by the next roll (Vicious Mockery)                                                                                                        |
| **Save ends**               | something the creature can shake off — it then asks which save, the number to beat, and whether it's rolled at the start or the end of that creature's turn |
| **Until removed**           | you'll clear it yourself when the story says so                                                                                                             |

Change it later and everything you've already added in this box changes with it — so
it's fine to tap a condition first and pick the duration after.

**2. Set a reminder.** Type in a short note. OpenFray shows it in the **tracker row** for that combatant and reminds you; you decide what it does.

**3. Apply a codition.** Optionally, add a condition. These are toggles: the ones already on the creature are highlighted, and tapping one again takes it off.

**4. Add a bonus or penalty.** _What_ it does (advantage, disadvantage, or a number),
_what it applies to_ (attack rolls, saving throws, ability checks, or everything),
and _whose rolls_ (the combatant's own, or rolls made against it). Give it a name, like
Bless or Reckless, so you recognize it on the board later. OpenFray spells out what
you've built in plain English.

![The Modifier builder in the Apply effect box: an Effect and Applies-to dropdown, an On choice, a Label field, and a plain-English summary line.](../../../assets/screens/add-bous-penalty-effect.png)

**5. Save the effect.** Click on **Apply** to add the effect, its conditions, and modifiers to the combatant.

:::tip[Casting a spell?]{icon="pen"}
If you are casting a spell, use the **Cast spell** flow instead. It already applies
all the conditions, modifiers, and timers for you. This box is for everything else
that OpenFray doesn't already know about. See [Spells](/docs/fight/spells/).
:::

### Two examples

#### Reckless Attack

The barbarian's player announces it. There's no spell to cast and nothing on any stat
block — but for the rest of the round, attacks against them land more easily, and that's
the sort of thing you'll otherwise forget by the time the enemy swings.

![The Apply effect box set up for Reckless: Advantage on attack rolls made against it, with the summary line text.](../../../assets/screens/example-reckless.png)

1. Click the player's character, then **Apply effect**.
2. **Duration → 1 round**, so it clears itself when their turn comes round again.
3. Click on **Add a bonus or penatly** to add the modifier.
4. Set the **Effect** to **Advantage**, **Applies to** to **Attack rolls** and **On** to **Rolls made against it**.
5. Set the label to **Reckless attack**, so the badge on their row says why.
6. Click **Apply**.

Now when the a creature swings at them, OpenFray rolls with advantage on its own, shows both
dice, and names _Reckless attack_ as the reason.

### Something you just made up

A creature throws a flask of oil on a player and they are now covered in oil. There's no condition for that and no spell involved —
you just don't want to forget it two rounds from now.

![The Apply effect box with a free-text reminder typed into the Reminder field.](../../../assets/screens/example-reminder.png)

1. Click on the player, then **Apply effect**.
2. **Duration → Until removed**, because it ends when the story says so.
3. Type the note in **Reminder** and press **Apply**.

It becomes a badge on their row like any other effect. OpenFray shows the reminder and
keeps it in front of you until you clear it, but it doesn't apply any effect for you — a
reminder is a note, and you decide what it means.

## Where effects show up

Each effect and reminder shows as a small **badge** under the combatants's name in the tracker — just
the name, so the row stays easy to read at a glance.

![A tracker row for an Ogre with its Frightened badge outlined in red and labeled as an effect on the creature.](../../../assets/screens/effect-badge.png)

The details live in the **Applied effects** list, in the controls beside the stat block.
There, each effect shows how it ends and carries its own buttons.

![The Applied effects list showing "Frightened · DEX save DC 10" with Roll save and Clear buttons, outlined in red.](../../../assets/screens/applied-effects.png)

- **Clear** removes it.
- For an effect that ends on a save, **Roll save** rolls it, and the line shows the
  ability and number needed.
- **Clear effects** removes all the applied effects at once.

## How long effects last

Every effect knows when it ends, and the **Applied effects** list tells you:

- effects that last a number of **rounds** count down and show what's left ("10 rounds
  left"); if it's more than about ten minutes, it shows the time instead ("1 hour
  left");
- **ends on a save** shows the ability and number, like `WIS save DC 15 (EoT)`;
- some clear the next time the creature rolls (Vicious Mockery);
- some clear when the creature that caused them takes its next turn;
- the rest stay until you clear them, and keep the spell's own wording where OpenFray
  can't count it down ("8 hours").

### Effects a saving throw ends

Some effects hang on until the creature makes a saving throw — a paralysis, an ongoing
burn. Each one gets **its own** save: two effects that happen to need the same save and DC
still roll separately. On a creature's turn,
OpenFray rolls these for you, at the start or end of the turn as you chose. For a player,
use **Roll save** to record their roll, or just **Clear** it when they pass.

## Concentration

A spell that a creature has to concentrate on is a special case: ending the concentration
clears the spell's effects everywhere at once. That has its own page —
[Concentration](/docs/fight/concentration/).
