---
title: Attacks & damage
description: Roll a creature's attack from its stat block, apply the damage, and let OpenFray handle resistances, immunities, and critical hits.
---

When a creature attacks, you roll it from its stat block and OpenFray does the rest: the
to-hit roll against the target's armor class, the damage, and any resistance or immunity
the target has. This page walks through one attack from start to finish.

Players roll their own attacks — this is for the creatures OpenFray has the numbers for.
For a player, you enter the result yourself.

## Rolling an attack

1. Click the attacking creature in the tracker to select it. Its stat block fills the
   middle column.
2. In the stat block, click the **name of the attack** — _Bite_, _Longsword_, _Fire
   Breath_. The attack box opens.
3. Pick the **target** from the chips at the top.
4. Click **Roll attack**. OpenFray rolls a d20, adds the attack's bonus, and shows the
   total against the target's armor class: **Hit** or **Miss**.

<!-- TODO screenshot: attack-resolve.png — the attack box mid-resolve, target picked, Hit shown, damage field and Apply. Highlight: target chip, the "N vs AC X · Hit" line, Damage field, Apply button. Uncomment the line below once captured. -->
<!-- ![The attack box with a target picked, the to-hit result reading Hit, the rolled damage, and the Apply button outlined in red.](../../../assets/screens/attack-resolve.png) -->

**Roll attack** becomes **Reroll** after the first roll, so you can roll again if you need
to.

## Advantage and disadvantage

Above the roll button, the **Roll** setting is **Normal**, **Advantage**, or
**Disadvantage**. Set it before you roll.

<!-- TODO screenshot: attack-advantage.png — the Roll toggle in the attack box. Highlight: Normal / Advantage / Disadvantage. -->

<!-- ![The Roll setting in the attack box, with Normal, Advantage and Disadvantage outlined in red.](../../../assets/screens/attack-advantage.png) -->

This combines with any advantage or disadvantage already on the board from
[effects](/docs/fight/effects/) — one of each cancels out. So if the target has an effect
that grants attackers advantage, you can leave this on **Normal** and still roll with
advantage.

## Critical hits

A natural 20 is a **Critical hit!** and a natural 1 is a **Miss (nat 1)**. How much a crit
adds to the damage follows your campaign's [crit rule](/docs/library/campaigns/#house-rules).

A **melee** hit on a **prone or unconscious** target is a critical automatically — the box
shows _(auto-crit — Unconscious target)_ so you know why.

## Damage

After a hit, OpenFray rolls the attack's damage and shows it as a pill for each damage type.

1. Check the **Damage** field — it's filled in with the rolled total, and you can edit it.
2. Click **Apply to _{target}_** to take the damage off the target's hit points.

Damage is never applied until you press that button. On a miss the button is dimmed; you
can still apply if you mean to (adjust the number first).

If the attack also lands a condition — a bite that grabs, a stinger that poisons — the box
offers to apply it to the target in the same step.

## Resistance, immunity, and vulnerability

OpenFray knows a creature's defenses from its stat block and works them into the damage for
you:

- **Resistance** halves the damage of that type;
- **Immunity** takes it to zero;
- **Vulnerability** doubles it.

Each damage pill shows the type and the final amount, with a label like _resisted_ when a
defense changed it. A **player's** resistances aren't on a sheet OpenFray can read, so for
a player you adjust the **Damage** field yourself before applying.

## Casting an attack spell

An attack-roll spell (_Fire Bolt_, _Chromatic Orb_) uses this same box. Cast it from a
creature's stat block and its attack bonus is filled in. Cast it from **Cast spell**
without naming a caster — for a player's spell — and you type the **Spell attack bonus**
yourself. See [Spells](/docs/fight/spells/).
