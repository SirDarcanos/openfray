---
title: The tracker & rows
description: The three columns of the console, what each row in the tracker shows, and how to change a creature's hit points.
---

The **tracker** is the left column of the console — the list of everyone in the fight, in
the order they act. It's the column you watch. This page covers how the console is laid
out, what a row shows, and how to change hit points.

## The console at a glance

The console is one screen, split into three columns. Everything you need during a fight is
on it — nothing important is hidden in a menu.

![The OpenFray console during a fight, with five areas outlined in red and numbered one to five.](../../../assets/screens/layout.png)

1. **The tracker.** Everyone in the fight, in the order they act, with hit points, armor
   class, and any conditions on them. This is the column you watch.
2. **The stat block.** Everything about whoever you clicked on — abilities, attacks, and
   spells. Click an attack here to roll it. See [The stat block](/docs/reference/stat-block/).
3. **Controls and the log.** Buttons for the creature you've selected — apply an effect,
   concentrate, use a reaction — and below them a running list of what has happened.
4. **The top bar.** Adding creatures and players, group saves, casting a spell, rests, and
   the switch between the console and the compendium.
5. **The bottom bar.** Dice you can roll by hand, the fight's timers, and — when you're
   signed in — which campaign you're running.

## Reading a row

Every row in the tracker holds the four things you check most often: initiative, name, hit
points, and armor class. Any effects on the creature show as badges under its name.

![One tracker row, with its initiative, name, hit points and armor class outlined in red and labeled.](../../../assets/screens/tracker-row.png)

During a fight, the creature whose turn it is glows, and its stat block fills the middle of
the screen. Click any row to select that creature and act on it.

## Changing hit points

Click a creature's current hit points to change them. You can:

- type a **number** to set the total outright — `24`;
- type **`+5`** to heal by that much;
- type **`-8`** to deal that much damage.

Current hit points change color as a creature gets hurt, so you can spot a badly wounded
one at a glance. Temporary hit points are counted separately and used up first.

:::tip[Damage from an attack is easier]
Typing `-8` is the quick way to apply damage you've worked out elsewhere. When a creature
attacks, [resolve the attack](/docs/fight/attacks/) instead — OpenFray rolls the damage,
applies resistances, and takes the hit points off for you.
:::

## Rearranging the order

Once a fight is running, you can drag a row to a new spot in the initiative order — for a
held action, or to fix a number you typed wrong. See
[Encounters & initiative](/docs/fight/encounters/#rearranging-the-order).
