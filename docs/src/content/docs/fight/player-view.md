---
title: The player view
description: Share a read-only screen with your players so they can follow the turn order and the game log on their own phones during a Dungeons and Dragons 5e fight.
keywords:
  - Dungeons and Dragons 5e player view
  - share DnD 5e initiative order
  - 5e combat tracker for players
  - second screen for the table
---

The **player view** is a read-only screen your players open on their own devices. It shows the
turn order and the game log, and nothing else. You decide when it's on and how much of a
creature it gives away. This page covers sharing it, what your players see, and what stays
with you.

It works without an account. Signing in lets you give the link a name you can remember.

## Sharing the fight

The **screen** button sits in the top bar, between the account menu and the gear.

1. Click the **screen** button. A small box opens with the link and a button.
2. Click **Start sharing**. A green dot appears on the button while sharing is on.
3. Click **Copy**, and send the link to your players however you normally talk to them.
4. When you're done, open the box again and click **Stop sharing**.

Your players' screens fill in as soon as you start. If someone opens the link first, it says
it's waiting and then fills in on its own — nobody has to reload.

:::caution[Anyone with the link can watch]
The link is the only thing protecting the view, so give it to your table rather than posting
it publicly. Nobody can change anything through it: the player view has no buttons.
:::

## What your players see

Their screen has two side-by-side columns, which scroll separately so a long fight's log
never pushes the turn order out of sight. On a phone they stack, log underneath.

- **The turn order** — everyone in the fight, in initiative order, with their conditions
  and effects, who's up, and which round you're on.
- **The game log** — the running record of what happened.

Player characters always show in full: hit points, armor class, conditions, and death saves.
Your table wrote those numbers down themselves.

Creatures are different, and that's your call — see below.

### What lands in their log

Everything that happens on the board, minus a creature's numbers:

| They see                                               | They don't                             |
| ------------------------------------------------------ | -------------------------------------- |
| A creature attacking, and whether it hit or missed     | The die it rolled, or its attack bonus |
| The damage it dealt to a character                     | —                                      |
| A creature saving or failing a save                    | The die, or its saving throw bonus     |
| That a creature was hurt or healed                     | By how much                            |
| Conditions and effects landing and clearing, on anyone | —                                      |
| Concentration starting and breaking                    | —                                      |
| Spells being cast, by name                             | —                                      |
| Turns, rounds, knockouts, deaths, and rests            | —                                      |

Their own characters aren't held back at all: damage to a player character shows the
number, because they know it already.

Two things never reach the player view, whatever you choose:

- **Creature stat blocks** — abilities, attacks, traits, and spells.
- **Recharge rolls** — whether a dragon got its breath weapon back.

Set creature hit points to **Exact number** below and the withholding stops: you've told
OpenFray your table may do the arithmetic, so the log stops rounding it off too.

## Choosing how much a creature gives away

Open **Settings** (the gear at the top right), then **Player view**. Two choices, and both
apply to every creature in every fight:

| Setting                  | What you can choose                         | Starts as |
| ------------------------ | ------------------------------------------- | --------- |
| **Creature hit points**  | In words (Bloodied) · Exact number · Hidden | In words  |
| **Creature armor class** | Hidden · Shown                              | Hidden    |

**In words** shows a creature's condition as **Healthy**, **Hurt**, **Bloodied**, or
**Critical**, without the number. It's the middle ground: your players can tell the fight is
going their way without counting hit points down to the last one.

The hit-point setting also decides how the log reads. On **In words** or **Hidden**, a
creature's dice and damage amounts are held back; on **Exact number** they aren't.

Change either one while you're sharing and your players' screens update straight away.

## Naming the link

Without an account you get a link with a jumble of letters in it. It's yours, it stays the
same, and it's kept in the browser you're using.

Sign in and you can name it instead:

1. Click the **screen** button, then type a name in **Name the link**.
2. Click **Save**.

Use letters, numbers, and hyphens — something like `tuesday-game`. Names are first come,
first served: if another Game Master has already taken one, OpenFray says so and your current
link keeps working, so nothing breaks mid-session.

A named link follows your account, so it's the same on your laptop and your tablet, and it's
still the same next week.

## What isn't saved

Nothing about the shared view is stored on a server. The board is passed to your players'
screens as it changes and kept nowhere, so:

- when you stop sharing, or close the tab, their screens say the Game Master has stepped away;
- there's no history to scroll back through after the session;
- two Game Masters sharing at the same time never see each other's fights.

## Where to next

- [Settings & appearance](/docs/reference/settings/) — where the two player-view choices live.
- [The game log](/docs/reference/game-log/) — what gets logged, and how to review it.
- [The tracker & rows](/docs/fight/tracker/) — the same order, from your side.
