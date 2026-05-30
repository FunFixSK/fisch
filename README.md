# Fisch Radar Gameplay

## Purpose

Fisch Radar is not meant to be a full phone game.

It is a quick outdoor play prop that helps children decide what they caught while they continue playing outside with their own story, rods, nets, ships, and crew roles.

The phone should answer one question:

```text
What did we catch?
```

Then it should get out of the way.

## Core Loop

1. Children play outside and pretend to fish.
2. When the crew decides they caught something, they open the radar.
3. They choose a radar mode if it fits the story.
4. They tap `Identify Catch`.
5. The radar scans briefly.
6. The app reveals:
   - fish name
   - rarity
   - weight
   - price
7. The crew acts out the catch outside.
8. Tapping the catch card returns to the main radar screen.

## Design Principle

Keep phone interaction short.

The app should support imagination, not replace it.

Avoid mechanics that encourage repeated tapping, grinding, collecting, leveling, or staring at the screen.

## Radar Modes

### Normal

Use for regular fishing.

This is the default mode with mostly common catches and rare special catches.

Story use:

```text
The crew is sailing normally.
The water is calm.
The next catch could be anything.
```

### Lucky Spot

Use when the crew finds a magical place in the garden.

This mode gives better odds for rare catches, but still keeps common catches possible.

Story use:

```text
The crew found glowing water.
The ship reached a hidden fishing spot.
The captain says luck is stronger here.
```

### Storm Hunt

Use when the captain starts a boss hunt.

This mode has the strongest rare-catch boost and a more intense radar style.

Story use:

```text
A storm is coming.
The ship is hunting a giant fish.
The crew prepares the big net.
```

## Catch Rarity

Rarity affects how likely a fish is to appear.

Current rarity bands:

```text
Trash
Common
Uncommon
Unusual
Rare
Legendary
Mythical
Exotic
Secret
```

High-rarity catches should feel exciting, so they get stronger visual effects and particles.

## Fish Result

Each catch has:

```text
Name
Rarity
Weight
Price
```

Weight is generated dynamically from the fish range.

Price is calculated from:

```text
weight * pricePerKg
```

## Visual Rules

The main screen should feel like a radar tool.

Normal:

```text
calm green radar
steady scan
regular fishing mood
```

Lucky Spot:

```text
green and gold glow
small magical sparkles
hidden-place mood
```

Storm Hunt:

```text
orange and red pulse
faster sweep
boss-hunt mood
```

Result screen:

```text
fish silhouette
rarity color
rarity chance
weight and price report
tap card to return
```

## Anti-Phone Rules

Do not add:

- inventory screens
- upgrades
- levels
- daily rewards
- streaks
- loot boxes
- long encyclopedia browsing
- repeated reroll mechanics
- "shake harder for better fish"

Possible future additions should push children back into outdoor play.

Good future additions:

- short adventure prompts
- captain challenges
- one-catch boost after a physical task
- session-only catch log
- parent/captain mode

## Future Ideas

### Adventure Prompt

After a catch, show a small physical-play instruction:

```text
Carry this fish safely to the ship.
Everyone hold the net.
The fish is heavy, count down from 10.
```

### Captain Boost

A one-use boost for the next catch.

It should be triggered by story, not grinding.

Example:

```text
Captain Boost ready after the crew repairs the ship.
Next catch has better odds.
Boost turns off after one catch.
```

### Catch Log

A simple session log can remember catches during one play session.

It should not become a collection-completion system.

## Current MVP

The current MVP includes:

- mobile-first radar screen
- `Identify Catch` button
- radar scan animation
- random weighted fish result
- dynamic weight and price
- rarity-based visual themes
- particles for high rarity
- radar modes: `Normal`, `Lucky Spot`, `Storm Hunt`
- tap result card to return to main screen
