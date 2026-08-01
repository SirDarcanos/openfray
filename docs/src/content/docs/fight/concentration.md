---
title: Concentration
description: Track Dungeons and Dragons 5e spell concentration — mark a creature as concentrating, clear its effects everywhere when concentration ends, and handle the check when it takes damage.
keywords:
  - Dungeons and Dragons 5e concentration
  - DnD 5e concentration tracker
  - 5e concentration check
  - spell concentration
---

Some spells last only while their caster keeps **concentration** — and hold it until the
caster is distracted, drops it, or takes enough damage to break it. OpenFray tracks who is
concentrating on what, and clears the spell's effects everywhere the moment concentration
ends.

## Marking a creature as concentrating

In the controls beside a creature's stat block, click **Concentrate**. You can add the
spell's name and, if you like, how long it lasts. Casting a concentration spell from
[Cast spell](/docs/fight/spells/), or from a creature's stat block, starts this for you
with the timer already counting — as soon as the spell lands on someone. A spell every
target shrugs off leaves nothing to hold on to, so nobody is marked as concentrating.

![The Concentrate control in use, with the game log recording a creature starting and ending concentration.](../../../assets/screens/set-concentration.gif)

## Ending concentration

Concentration is what keeps a spell going, so **ending it removes that spell's effects
from everyone at once**. Break the caster's concentration on _Bless_ and all three blessed
allies lose it together — you don't clear each one by hand.

Concentration also drops on its own when its timer runs out.

## The check after damage

When a creature that's concentrating takes damage, it has to make a Constitution save to
hold on. OpenFray works out the DC — **10, or half the damage taken, whichever is higher** —
and prompts you on the creature's row:

- **Maintained** — the save succeeded; concentration holds.
- **Broken** — the save failed; concentration ends, and the spell's effects clear.
- **Roll CON save** — for a creature, OpenFray rolls the save for you. A player rolls their
  own, and you tap **Maintained** or **Broken**.

Breaking concentration this way clears the spell's effects just like ending it by hand.

![The concentration-check prompt reading "Concentration — DC 10" with Maintained, Broken, and Roll CON save buttons in the controls.](../../../assets/screens/keep-concentration.png)
