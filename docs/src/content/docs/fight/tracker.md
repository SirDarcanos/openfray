---
title: The tracker & rows
description: The three columns of the combat console, what each row in the initiative tracker shows, and how to change a creature's hit points.
keywords:
  - DnD 5e initiative tracker
  - Dungeons and Dragons 5e combat tracker
  - 5e hit point tracker
  - combat console layout
---

The **tracker** is the left column of the console: the list of everyone in the fight, in
initiative order. It's the column you watch. This page covers what a row shows, and how to
change hit points.

## Reading a row

Every row in the tracker holds the four things you check most often: initiative, name, hit
points, and armor class. Any effects on the creature show as badges under its name.

![One tracker row, with its initiative, name, hit points and armor class outlined in red and labeled.](../../../assets/screens/tracker-row.png)

During a fight, the creature whose turn it is glows, and its stat block fills the middle of
the screen. Click any row to select that creature and act on it.

A creature you've chosen to keep off the shared [player view](/docs/fight/player-view/) is
tagged **Hidden**, so you can see at a glance which ones your table can't. Creatures simply
waiting for the fight to start aren't tagged. They reach your players' screen on their own
when you press **Begin**.

## Changing hit points

Click a creature's current hit points to change them. You can:

- type a **number** to set the total outright — `24`;
- type **`+5`** to heal by that much;
- type **`-8`** to deal that much damage.

Current hit points change color as a creature gets hurt, so you can spot a badly wounded
one at a glance. Temporary hit points are counted separately and consumed first when damaging a combatant.

![Three tracker rows with current hit points tinted by wound level: red at 1/5, green at full, and amber at 18/23.](../../../assets/screens/tracker-row-hp-colors.png)

:::tip[Damage from a player]
Typing `-8` is the quick way to apply damage from a player to a creature. When a creature
attacks, [resolve the attack](/docs/fight/attacks/) instead. OpenFray rolls the damage,
applies resistances, and takes the hit points off for you.
:::

## Rearranging the order

Once a fight is running, you can drag a row to a new spot in the initiative order, for a
held action, or to fix a number you typed wrong. See
[Encounters & initiative](/docs/fight/encounters/#rearranging-the-order).

![A combatant being dragged by its six-dot handle to a new spot in the initiative order during a fight.](../../../assets/screens/reorder-combatants.gif)
