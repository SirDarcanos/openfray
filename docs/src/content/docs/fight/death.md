---
title: Death & dying
description: What happens when a creature drops to 0 hit points — death saves for players, and how OpenFray tracks who is down, dead, or stable.
---

When a creature reaches 0 hit points it doesn't leave the fight. A foe is marked dead; a
player character drops unconscious and starts rolling death saves. This page covers both,
and how a downed character comes back.

## Down, dead, and back again

Every combatant is **active**, **unconscious**, or **dead**. Nothing is ever deleted: a
downed or dead creature stays in the initiative order, grayed out and skipped, so it's
right there if it's brought back.

- A **creature** (a foe or a quick add) at 0 hit points is marked **dead**.
- A **player character** at 0 is marked **unconscious**, and OpenFray starts tracking their
  death saves.

Healing a character above 0 wakes them: their status goes back to active, the death-save
tally clears, and they keep their place in the order — no re-rolling initiative.

## Death saves

A downed player's row is tagged **Unconscious** and grows a set of pips — successes on one
line, failures on the other — so the tally is visible without opening anything.

![A tracker row for a downed player, tagged Unconscious, with the Saves and Fails pips outlined in red.](../../../assets/screens/death-save-row.png)

Select the character and their controls grow three buttons.

![The death save controls, with Save and Fail outlined in red alongside Roll death save.](../../../assets/screens/death-saves.png)

- **Save** and **Fail** record what the player rolled. This is the normal path: the player
  rolls their own die, and you tap what happened.
- **Roll death save** is the fallback for when they can't roll — OpenFray rolls it and
  records the result for you.

Once the tally resolves, OpenFray stops asking. A stabilized character keeps a **Stable**
tag on their row; a dead one grays out in the order. Either way, they stay in the list, in
their own initiative slot.

## What OpenFray applies for you

Four things happen on their own during a fight, so nothing is missed mid-combat:

| When                                  | OpenFray does this                                               |
| ------------------------------------- | ---------------------------------------------------------------- |
| You deal damage to a downed character | Records a failure with the damage                                |
| That damage came from a melee hit     | Records it as a critical — two failures                          |
| **Roll death save** comes up 20       | Puts them back on their feet at 1 hit point and clears the tally |
| **Roll death save** comes up 1        | Records two failures                                             |

Damaging a **stable** character clears their successes before applying the failure, so the
row goes straight back to dying rather than quietly staying stable.

:::note[Coming later]
A shared screen for players, where you choose what each side sees, is planned but not built
yet. See [Creatures & players](/docs/fight/combatants/#hiding-things-from-players).
:::
