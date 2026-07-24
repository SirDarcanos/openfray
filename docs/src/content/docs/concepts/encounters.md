---
title: Encounters & initiative
description: How the tracker puts creatures in order, runs rounds and turns, and lets you move forward and back.
---

An **encounter** is the fight you're running: everyone in it, the order they act, and
which round you're on. The left column — the **tracker** — is where it all happens.

## Setting the order

Add everyone before the fight starts (see [Getting started](/docs/getting-started/)).
Until you begin, players and foes sit in separate groups so you can see both sides.

Click **Begin** and OpenFray asks for everyone's initiative. Creatures are rolled for
you. Players are blank, so you can type what they rolled, or leave it blank and let
OpenFray roll. You can also mark someone **surprised** here — what that does depends on
your campaign's [surprise rule](/docs/concepts/campaigns/#house-rules).

Click **Start combat** and you're in round 1, at the top of the list.

## Rounds and turns

The creature whose turn it is glows in the tracker, and its stat block fills the middle
of the screen. The buttons beside the round number move the fight along.

![The top of the tracker during a fight, with the round number, the two turn buttons, and the pause and stop buttons outlined in red and labelled.](../../../assets/screens/turn-controls.png)

:::caution[Going back is a fix, not an undo]
**Previous turn** moves the marker back and nothing else. It does **not** put things
back the way they were — timers that counted down, a used reaction, or lost
concentration all stay as they are. Use it when you clicked ahead by mistake, not to
replay a turn.
:::

**Pause** holds the fight so you can come back to it later, and stops the clock. **Stop**
ends the fight and takes you back to setup, keeping everyone on the board.

## What moving to the next turn does

Clicking **Next turn** does more than move the marker. Each time, OpenFray:

- counts down effects that last a set number of rounds, and removes the ones that run
  out;
- gives the creature back its reaction, and refreshes its legendary actions;
- clears effects that last "until my next turn" as their owner starts to act;
- counts down concentration and drops it when it runs out;
- rolls a creature's [saves to shake off an effect](/docs/concepts/effects/#effects-a-saving-throw-ends)
  at the right moment in its turn;
- rolls to see whether a used-up recharge ability is available again.

OpenFray follows whose turn it is by the creature itself, not by its place in the list —
so adding, removing, or dragging creatures around never loses the turn.

## Rearranging the order

Drag a creature by the handle on the left of its row to move it. Its initiative changes
to fit its new spot, and nobody else's number moves. Creatures that are down or dead stay
in the list, greyed out and skipped, so the order holds steady if they come back.

## The summary

When the last enemy is defeated, OpenFray asks whether the fight is over. Say yes and it
shows a summary: who won, how many rounds it took, how long it lasted in real time and in
game time, damage dealt and taken, and a few highlights — plus the experience earned,
unless your campaign levels up by
[milestone](/docs/concepts/campaigns/#leveling-up-experience-or-milestone).
