---
title: Creatures & players
description: The three kinds of thing you can add to a fight — creatures, players, and quick creatures — and what OpenFray tracks for each.
---

Everyone in a fight is added in one of three ways. The difference is how much OpenFray
knows about them, not how they take their turn.

## The three kinds

### Creatures

Click **Add creature** to pick one from the [compendium](/docs/concepts/compendium/). You
get the whole creature: its abilities, attacks, reactions, legendary actions, and spells.
OpenFray rolls its dice for you, because it has all the numbers.

When you add a creature, OpenFray takes its own copy. Editing the creature in the library
later won't touch one already in a fight, and damage or spells used in a fight won't
change the library.

### Players

Players roll their own dice, so a player character stays simple — just what you, the Game
Master, want to see on the board:

- always: name, armor class, hit points, and conditions;
- if you want: ability scores, senses, speed, damage the character resists or is immune
  to, languages, and notes.

OpenFray never rolls a player's attacks or saves. Wherever it would roll for a creature,
you type in what the player rolled instead.

### Quick creatures

**Quick add** drops in something you're inventing on the spot and won't reuse — just a
name, hit points, and armor class. Mark it a foe to keep it with the enemies.

## Reading a row

Every row in the tracker holds the four things you check most often.

![One tracker row, with its initiative, name, hit points and armor class outlined in red and labelled.](../../../assets/screens/tracker-row.png)

Click the hit points to set a new number, or to add or remove some — type `+5` to heal or
`-8` to damage. Current hit points change colour as a creature gets hurt, so you can spot
a badly wounded one at a glance. Temporary hit points are counted separately and used up
first.

## Down, dead, and back again

Everyone is **active**, **unconscious**, or **dead**. Nothing is ever deleted: down and
dead creatures stay in the order, greyed out and skipped, so they're right there if
they're brought back. A downed player gets death-save buttons on their row.

## Copies and renaming

Add the same creature twice and the second is named **Goblin 2** for you — that's just a
number to tell them apart, so its stat block still says _Goblin_. If you rename one
yourself, it shows your name with the real one after it (_Snik (Goblin)_), so you always
know what it actually is.

## Hiding things from players

:::note[Coming later]
This isn't in OpenFray yet — it's planned for a future update.
:::

Later, OpenFray will have a screen players can look at, and each creature will let you
choose what they see: its name, its hit points (the exact number, just _bloodied_, or
nothing), its conditions, and its armor class.
