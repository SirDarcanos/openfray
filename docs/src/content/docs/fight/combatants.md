---
title: Creatures, players & quick adds
description: The three kinds of thing you can add to a fight, what OpenFray tracks for each, and how it names duplicates.
---

Everyone in a fight is added in one of three ways. The difference is how much OpenFray
knows about them, not how they take their turn.

## The three kinds

### Creatures

Click **Add creature** to pick one from the [compendium](/docs/library/compendium/). You
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

### Throwaway creatures

**Quick add** drops in something you're inventing on the spot and won't reuse — just a
name, hit points, and armor class. Mark it a foe to group it with the other foes.

## What each row shows

Once a combatant is on the board, the tracker row shows their initiative, name, hit points,
and armor class, and you change hit points right there. See
[The tracker & rows](/docs/fight/tracker/). When a creature drops to 0, see
[Death & dying](/docs/fight/death/).

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
