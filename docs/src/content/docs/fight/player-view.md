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

The **screen** button sits in the top bar, between **Sign in** and the gear.

1. Click the **screen** button. A small box opens with the link and two buttons beside it.
2. Click **Start sharing**. A green dot appears on the button while sharing is on.
3. Click the **copy** button (two sheets) beside the link, and send it to your players however
   you normally talk to them.
4. To see what your table sees, click the **open** button (an arrow leaving a box). The player
   view opens in a new tab.
5. When you're done, open the box again and click **Stop sharing**.

Your players' screens fill in as soon as you start. If someone opens the link first, it says
it's waiting and then fills in on its own. Nobody has to reload.

Reloading the console doesn't interrupt them: sharing picks up again on its own, and only
stops when you press **Stop sharing** or close the tab.

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
- **The clocks** — how long the fight has taken, and how long it has run in the game.

Player characters always show in full: hit points, armor class, conditions, and death saves.
Your table wrote those numbers down themselves. Anyone fighting **alongside** them shows in
full too: a summoned wolf, a hired guard, a creature you've made an ally (see
[Creatures, players & quick adds](/docs/fight/combatants/#allies)).

Creatures on the other side are different, and that's your call. See below.

### When a creature appears

Your players see the creatures when the fight starts, not while you're setting it up. Until
you press **Begin**, their screen shows the party and nothing else, so lining up six ogres
gives nothing away.

You can overrule that for any creature, either way:

1. Click the creature in the tracker.
2. In the controls beside its stat block, click **Hide from players** to hold it back, or
   **Show to players** to put it on their screen. The button always names what the click
   does, so it reads **Show to players** before the fight, when no creature is on their
   screen yet.

A creature you hold back is tagged **Hidden** on your own tracker, and anything it does
stays out of your players' log. A creature merely waiting for the fight to start isn't
tagged. It appears on its own when you press **Begin**.

A creature that arrives mid-fight follows your **Creatures arriving mid-fight** setting, so
reinforcements can be held back by default and revealed when the party sees them.

When the fight ends, every creature leaves your players' screen again, and anything you
showed or hid during it goes back to normal. The next **Begin** puts them all back, so you
never reveal the same creature twice.

### What lands in their log

Everything that happens on the board, minus the dice a creature rolled:

| They see                                               | They don't                    |
| ------------------------------------------------------ | ----------------------------- |
| A creature attacking, and whether it hit or missed     | The dice, or its attack bonus |
| What a roll came to, and the damage it dealt           | The dice that got there       |
| Whether a creature saved or failed                     | Its save total, or its bonus  |
| How much damage a creature took, or was healed         | How many hit points it has    |
| Conditions and effects landing and clearing, on anyone | —                             |
| Concentration starting and breaking                    | —                             |
| Spells being cast, by name                             | —                             |
| Turns, rounds, knockouts, deaths, and rests            | —                             |

A roll's total is safe to show. On its own it says nothing, because the dice behind it are
unknown. A **saving throw** is the exception and shows no number at all: set against a
difficulty class your table can work out, a save total would give the creature's bonus away.
Saved or failed is the whole of what they need.

Damage is never held back, whichever hit-point setting you use. How hard the party hit the
ogre is what they just watched happen, and "how much did that take off me?" is a question
worth answering. What stays with you is how much the creature had to begin with.

:::note[Legendary Resistance is never spoiled]
A creature that fails a save and then spends Legendary Resistance shows your players
**Saved**, and nothing before it. The outcome isn't shared until you've settled it, so the
table never reads a "Failed" that you then take back.
:::

Two things never reach the player view, whatever you choose:

- **Creature stat blocks** — abilities, attacks, traits, and spells.
- **Recharge rolls** — whether a dragon got its breath weapon back.

### When the fight ends

Your players see the same summary you do, for as long as you leave it open: the outcome,
the experience earned, how long it took, and the standout hits. Their log clears at the same
moment, ready for the next fight. Both are settings; see [Choosing what they
see](#choosing-what-they-see).

## Choosing what they see

Click the **gear** at the top right, choose **Settings**, then the **Player view** tab. Every
choice applies to every fight, and takes effect on your players' screens straight away.

| Setting                          | What you can choose                         | Starts as       |
| -------------------------------- | ------------------------------------------- | --------------- |
| **Creature hit points**          | In words (Bloodied) · Exact number · Hidden | In words        |
| **Creature armor class**         | Hidden · Shown                              | Hidden          |
| **Creature rolls**               | Shown · Hidden                              | Shown           |
| **Creature conditions**          | Shown · Hidden                              | Shown           |
| **Creatures arriving mid-fight** | Shown · Hidden until revealed               | Shown           |
| **Game log**                     | This fight only · The whole session         | This fight only |
| **Fight clocks**                 | Shown · Hidden                              | Shown           |
| **End-of-fight summary**         | Shown · Hidden                              | Shown           |

![The Player view tab in Settings, listing every choice the shared screen offers with its current value.](../../../assets/screens/player-view-settings.png)

A few are worth explaining:

- **Creature hit points → In words** shows a creature as **Healthy**, **Hurt**, **Bloodied**,
  or **Critical**, without the number. It's the middle ground: your players can tell the fight
  is going their way without counting hit points down to the last one.
- **Creature rolls → Hidden** takes the total off a creature's attacks, saves and checks. What
  happened stays: whether it hit or saved, and the damage it dealt.
- **Creature conditions → Hidden** takes the badges off a creature's row, and the lines about
  conditions landing and clearing out of their log. Your players' own characters keep theirs.
- **Game log → This fight only** starts their log fresh each time you press **Begin** and
  clears it when the fight ends. Yours keeps everything either way.

## Naming the link

Without an account you get a link with a jumble of letters in it. It's yours, it stays the
same, and it's kept in the browser you're using.

Sign in and you can name it instead:

1. Click the **screen** button, then type a name in **Name the link**.
2. Click **Save**.

Use letters, numbers, and hyphens, something like `tuesday-game`. Names are first come,
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

- [Settings & appearance](/docs/reference/settings/) — where the player-view choices live.
- [The game log](/docs/reference/game-log/) — what gets logged, and how to review it.
- [End of the fight](/docs/fight/recap/) — the summary your players see with you.
- [The tracker & rows](/docs/fight/tracker/) — the same order, from your side.
