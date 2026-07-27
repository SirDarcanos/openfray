---
title: Build your own creatures & spells
description: Make a Dungeons and Dragons 5e creature or spell that isn't in the books, and keep it in your own library alongside the built-in ones.
keywords:
  - custom Dungeons and Dragons 5e creatures
  - homebrew DnD 5e monsters
  - build a 5e spell
  - custom stat block
---

The built-in books don't have everything — some famous creatures aren't in the Core
Rules at all, and your table has its own homebrew creations. With OpenFray's homebrew
content editor you can build your own, and they sit in your library next to the built-in
ones, ready to drop into any fight.

:::note[Sign in required]
Homebrew creations are stored in your account. This requires you to sign in with a free
Google or Discord account.
:::

Both editors live in the [compendium](/docs/library/compendium/): open the
**Creatures** or **Spells** tab and use the create button.

## Creating a homebrew creature

The form is a whole stat block, broken into collapsible sections you can work through in
any order — **Identity**, **Defense & HP**, **Speed**, **Abilities & saves**, then
skills, senses, traits, actions, reactions, legendary actions and spellcasting.

![The creature editor on a Bandit Gunner, with its hit dice giving a derived 17 HP average and the ability scores filled in.](../../../assets/screens/custom-creature.png)

**You enter the stats of the creature, and OpenFray does the math** from it for you:

- Give it a **challenge rating**, in Identity, and OpenFray knows its proficiency bonus.
  Everything below depends on it, so set it early.
- In **Defense & HP**, give the **hit dice** — how many, which die, and any modifier. The
  average appears beside them (_"= 17 HP avg"_).
- In **Abilities & saves**, type the six scores and tick **Proficient** on the saves it's
  good at. The bonus is the modifier plus the proficiency bonus, calculated for you
  automatically.
- Skills work the same way — tick proficient, tick expertise where it applies.
- For an attack, pick **which ability** it swings with. The to-hit is that ability's
  modifier plus proficiency, and the modifier is baked into the damage the way printed
  stat blocks do it.
- For spellcasting, pick the **ability**; the save DC and spell attack bonus follow.

Every derived number updates as you type, so you can check them as you go. If one looks
wrong, fix the ability score or the challenge rating behind it, not the total.

### Importing instead of typing

If the creature already exists on D&D&nbsp;Beyond, don't retype it — the
[importer](/docs/library/importer/) turns that page into an OpenFray creature. Paste what it
gives you into **Import a creature**, on the Creatures tab:

![The Import a creature box, with a creature pasted in and an Import button.](../../../assets/screens/import-json.png)

What lands in your library is an ordinary custom creature: editable, yours, and no
different from one you built by hand.

:::tip[Import your existing homebrew creatures]
If you already created homebrew creatures on D&D Beyond, you can import them into OpenFray
with the importer.
:::

## Creating a homebrew spell

The spell form covers the card, in the same collapsible sections: **Identity** (name,
level, school, rules version), **Casting** (time, range, duration, concentration, ritual,
components), **Description**, and **Mechanics** — where you say whether the spell resolves
as _nothing_, a _spell attack_, or a _saving throw_. Leave Mechanics empty and you get a
utility spell: OpenFray shows the card and lets you adjudicate.

![The custom spell editor, showing the Identity, Casting, Description and Mechanics sections.](../../../assets/screens/custom-spell.png)

One thing is worth calling out.

**Casting at higher levels** usually follows a pattern, so you describe the pattern once:
give the extra damage **per slot above the spell's base level** (or, for a cantrip, per
tier as the caster levels up), and OpenFray expands that into the actual damage at every
level, showing you the result as you type. For spells that don't follow a neat pattern,
switch to **Edit each level** and set them by hand.

## Where the homebrew creations live

Your creatures and spells:

- appear in the compendium beside the built-in ones, badged **Custom**;
- show up in the **Add creature** and **Cast spell** pickers;
- are always available, whichever [libraries](/docs/reference/settings/#libraries) you
  have turned on;
- can be edited or deleted later from the bottom of their own card.

Editing one **doesn't change a fight already in progress** — a creature you added to the
initiative tracker is a copy of the one in the compendium, taken at the moment you added
it.

You need to add it again to a combat if you want the changes to show.
