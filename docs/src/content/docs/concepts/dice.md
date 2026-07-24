---
title: Dice
description: Fair, honest dice you can check — every roll shown in the log, with no fudging.
---

For a fight to feel fair, the dice have to be fair — and everyone has to be able to see
how they landed. OpenFray does both.

## Fair rolls

OpenFray uses your browser's built-in random generator, the same secure kind used for
things like passwords. Every number is equally likely, every time.

:::note[No "lucky" dice]
Some apps quietly nudge the dice so your luck "feels" more even — fewer long streaks of
bad rolls. OpenFray never does that. Real dice have streaks, and so do these. What you
roll is what you get.
:::

## Every roll is written down

Every roll — attacks, saves, checks, damage, initiative — goes through the same place and
is written into the **log** on the right. Nothing is rolled in secret. You can also roll
anything by hand from the bar along the bottom: type a formula like `2d6+3`, or tap a
die.

![The dice bar at the bottom of the screen and a log entry reading "1d20 [18] +2", both outlined in red.](../../../assets/screens/dice-log.png)

Each entry shows the dice that were rolled, in brackets, and what was added to them — so
"is that right?" is answered by looking, not arguing. **View all** opens the full history
of the fight, grouped by round.

## Rolls know about effects

Because rolls and [effects](/docs/concepts/effects/) work together, whatever is on a
creature is worked in for you:

- **advantage and disadvantage** from conditions and effects are applied, and the log
  shows both dice;
- **bonuses and penalties** (Bless's +1d4, Bane's −1d4) are added and shown;
- **critical hits** follow your campaign's [crit rule](/docs/concepts/campaigns/#house-rules);
- a creature's **saves** include its bonuses, plus things like Magic Resistance and
  Evasion.

## Players roll their own

OpenFray rolls for creatures because it has their numbers. It never rolls a player's
attack or save — those belong to the player, and you type in the result. See
[Creatures & players](/docs/concepts/combatants/#players).
