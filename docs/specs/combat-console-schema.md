# Combat Console — Core Data Model (5.5e)

The whole app reads from these shapes. Get them right and the tracker, dice,
compendium, and player-view filtering all fall out almost for free.

---

## 1. Creature (the master schema)

A Creature is the shared shape for **monsters, NPCs, and the compendium**.
A library Creature is a *template*; when added to combat it's instantiated into
a Combatant (see §2). PCs are a lighter variant (§3).

```jsonc
{
  "id": "srd:adult-red-dragon",
  "source": "srd-5.2",          // "srd-5.2" | "custom" | "ddb-import" | "roll20-import"
  "name": "Adult Red Dragon",
  "size": "Huge",
  "type": "dragon",
  "ac": 19,
  "maxHp": 256,
  "hpFormula": "19d12+133",     // optional, lets you roll HP if you want
  "speed": { "walk": 40, "fly": 80, "climb": 40 },
  "abilities": { "str": 27, "dex": 10, "con": 25, "int": 16, "wis": 13, "cha": 23 },
  "saves": { "dex": 6, "con": 13, "wis": 7, "cha": 12 },
  "skills": { "perception": 13, "stealth": 6 },
  "senses": { "passivePerception": 23, "blindsight": 60, "darkvision": 120 },
  "cr": 17,

  // --- the parts that make this app different ---
  "actions":          [ /* Action[] */ ],
  "legendaryActions": { "perRound": 3, "actions": [ /* Action[] */ ] },
  "lairActions":      [ /* Action[] — fire on initiative count 20 */ ],
  "spellcasting":     { /* Spellcasting */ },
  "limitedUse":       [ /* LimitedUse[] — recharge / x-per-day abilities */ ]
}
```

### Action

Everything rollable is an Action. Presets (§dice) read straight off this.

```jsonc
{
  "id": "bite",
  "name": "Bite",
  "kind": "melee",              // melee | ranged | save | utility
  "toHit": 14,                  // null for save-based actions
  "reach": 10,
  "damage": [
    { "formula": "2d10+8", "type": "piercing" },
    { "formula": "2d6",    "type": "fire" }
  ],
  "save": null,                 // or { "ability": "dex", "dc": 21, "onSave": "half" }
  "text": "Original prose, kept for display only — never parsed for mechanics."
}
```

> **The one rule that saves you months:** mechanics live in structured fields
> (`toHit`, `damage[].formula`, `save.dc`). Prose lives in `text` for display
> only. Never regex your own stat blocks back into numbers.

### Spellcasting

```jsonc
{
  "ability": "cha",
  "saveDc": 21,
  "toHit": 13,
  "slots": { "1": 4, "2": 3, "3": 3, "4": 3, "5": 2 },   // max per level
  "spells": [
    { "level": 3, "name": "Fireball", "ref": "srd:fireball" }  // ref → compendium
  ]
}
```

### LimitedUse (recharge + x/day — your headline feature)

```jsonc
{
  "id": "fire-breath",
  "name": "Fire Breath",
  "recharge": { "type": "dice", "value": 5 },  // "Recharge 5–6"
  // other shapes: { "type": "perDay", "value": 3 } | { "type": "perRound", "value": 1 }
  "action": { /* an Action, e.g. the breath's save + damage */ }
}
```

---

## 2. Combatant (a creature *in* an encounter)

Instantiated from a Creature template. This is the live, mutable thing the
tracker mutates each turn. Template stays read-only; all combat state lives here.

```jsonc
{
  "combatantId": "uuid",
  "creatureId": "srd:adult-red-dragon",   // points back to template
  "label": "Red Dragon (A)",              // disambiguate duplicates
  "initiative": 18,

  "hp": { "current": 256, "max": 256, "temp": 0 },

  // live resource state — decremented from the template's maxes
  "slotsUsed":   { "1": 0, "2": 1, "3": 0 },
  "limitedUseState": { "fire-breath": { "available": false } }, // recharged?
  "legendaryRemaining": 3,                 // resets to perRound at end of its turn

  "concentration": null,   // or { "spell": "Hold Person", "saveDc": 13, "round": 2 }

  "conditions": [
    { "name": "Frightened", "expiresRound": 4, "source": "uuid-of-caster" },
    { "name": "Prone", "expiresRound": null }   // null = until removed
  ],

  // --- per-field visibility for the player view (§4) ---
  "visibility": {
    "name": "shown",        // shown | hidden | "Unknown Creature"
    "hp": "bloodied",       // exact | bloodied | hidden
    "conditions": "shown",
    "ac": "hidden"
  }
}
```

---

## 3. Player Character & Quick Add (lightweight)

A DM rarely needs the full sheet at the table. The lightweight combatant
(`isPC: true`) comes in two flavours via `kind`:

- **`pc`** — a player character: the board facts the DM wants. Core fields plus
  optional `initiativeMod` (used to roll at combat start when no value is entered),
  `passivePerception`, `languages`, `speed`, and `resistances`/`immunities`/
  `vulnerabilities` (applied to damage like a monster's). Still no class, level, or
  spell list — the DM transcribes; the app never derives a build.
- **`quick`** — a generic quick add (NPC or a mid-fight creature): just name/HP/AC.

```jsonc
{
  "combatantId": "uuid",
  "isPC": true,
  "kind": "pc",                 // "pc" | "quick" (defaults to "pc")
  "name": "Thalia",
  "initiative": 0,              // the rolled value (0 until combat begins)
  "initiativeMod": 2,           // rolled as d20 + this if not entered manually
  "ac": 16,
  "hp": { "current": 38, "max": 44, "temp": 0 },
  "passivePerception": 14,      // optional
  "languages": ["Common"],      // optional
  "speed": { "walk": 30 },      // optional
  "resistances": ["fire"],      // optional; immunities / vulnerabilities likewise
  "concentration": null,
  "effects": []
}
```

---

## 4. Encounter (the session state that syncs)

The whole object is what gets pushed to player screens — *after* the visibility
filter strips DM-only data.

```jsonc
{
  "encounterId": "uuid",
  "ownerId": "dm-user-id",
  "round": 3,
  "activeIndex": 2,            // whose turn (index into ordered combatants)
  "combatants": [ /* sorted by initiative desc */ ],
  "log": [ /* roll results, damage applied, conditions added */ ]
}
```

### Player view = same object, filtered

The server computes a derived, read-only projection per the `visibility` flags:

- `hp: "bloodied"`  → emit `"Bloodied"` / `"Healthy"` / `"Dead"`, never numbers
- `hp: "hidden"`    → omit entirely
- `name: "Unknown Creature"` → replace label until revealed
- DM notes, unrolled stat blocks, AC, remaining legendary actions → never sent

Players get a read-only socket subscription. Only the DM client can mutate.

---

## 5. Dice engine

One function, one string grammar. Presets are just pre-filled formula strings
pulled off an Action; the manual box accepts the same grammar.

```
2d6+4            standard
1d20+7           attack
1d20adv+5        advantage   (roll 2, keep highest)
1d20dis+2        disadvantage
4d6kh3           keep highest 3 (ability scores etc.)
2d10+8 fire      typed damage (type is metadata, not math)
```

```jsonc
// roll() returns enough to render and to log
{
  "formula": "1d20adv+5",
  "rolls": [[14, 19]],     // both dice for adv, so the UI can show the kept one
  "kept":  [19],
  "modifier": 5,
  "total": 24,
  "crit": true             // natural 20 on a d20 attack
}
```

Tapping **Bite** on the stat block runs `roll("1d20+14")`, and on hit fans out
the `damage[]` formulas. Crit doubles dice, not modifiers. Save-based actions
roll the target's save against `save.dc` instead of an attack.

---

## Build order implied by this model

1. **Creature + Action schema** (this file) — nothing works without it
2. **Encounter + Combatant** — the initiative loop mutating live state
3. **Resource / concentration / condition** mutations on Combatant
4. **Dice engine** reading Action presets
5. **Realtime sync + visibility projection** — DM vs player view
6. **SRD 5.2 compendium** populating Creature templates (Open5e JSON)
7. **Import helpers** (DDB / Roll20) — last, best-effort, optional
```
