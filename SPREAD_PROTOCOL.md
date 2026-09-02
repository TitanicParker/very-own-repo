# Public Spread Protocol

This repository is not only a publication. It is intended to preserve the first public spread of the idea it contains.

The public measurements must therefore remain historically meaningful, technically legible, and respectful of the reader.

## Principle

Count the movement of the idea, not the identity of the person.

The public system should be able to answer:

- How many reading journeys began?
- How many continued to each stable reading position?
- What proportion of readers reached a given depth?
- Which places have voluntarily declared first contact?
- When did each new place first appear?
- How quickly is the geographic footprint expanding?
- How quickly is deep reading expanding?
- What was the deepest publicly observed reading position at a given time?

It should not need to answer who a reader is.

## Stable reading coordinate

Every swipeable gulp must have a stable coordinate.

Recommended canonical form:

`entry:gulp`

Examples:

- `intro:001`
- `001:001`
- `001:026`
- `003:017`

Future entries continue the same convention.

The coordinate must survive visual redesigns whenever the underlying reading unit has not changed.

## Public event families

### 1. Arrival

Recorded once per anonymous reading journey when the publication is entered at its beginning.

Public aggregate:

- total arrivals
- arrivals by day/week/month
- new versus returning local journeys where safely distinguishable without cross-site identity

### 2. Reach

Recorded the first time a reading journey reaches a stable gulp coordinate.

This is the basis of the depth curve.

It must not be recorded merely because a direct URL was opened at a deep page and therefore should distinguish continuous forward traversal from direct entry when possible.

Public aggregate:

- journeys reaching coordinate
- percentage of beginning journeys reaching coordinate
- deepest observed coordinate
- first time a coordinate was reached

### 3. Place declaration

Explicitly volunteered by the reader through `I'm from…`.

Accepted public granularity:

- city + country
- region + country
- country

Exact coordinates, street addresses, device location APIs, and silently inferred IP location are outside the design.

The server may geocode the declared place to a coarse map centroid for display. The public record should preserve the normalized place label and an approximate geographic point, not a private address.

Public aggregate:

- declared places
- countries reached
- count by place
- first declaration time for each place

### 4. First-contact event

Generated when a normalized place appears for the first time.

Example public ledger entry:

`Dublin, Ireland joined the trail — first contact`

This gives the spread a genuine historical sequence.

### 5. Spread velocity

Derived rather than directly submitted.

Useful windows:

- new places in the last 24 hours
- new countries in the last 7 days
- arrival growth over 24 hours / 7 days / 30 days
- median time between new-place first contacts
- rate at which readers cross major chapter boundaries

Never display a statistically dramatic rate without also exposing the underlying count/window.

## Reader-facing measurements

The reading UI may quietly display:

- `2,481 readers reached here`
- `You have gone farther than 71% of beginning journeys`
- `18.4% of readers reached this point`

Prefer descriptions of observed reading journeys over claims about literal unique human beings unless uniqueness is genuinely established.

No badges, streaks, leaderboards, or coercive retention mechanics.

The measurement should make the human wake visible, not turn reading into a game.

## World view

`world.html` is the public surface for the spread record.

It should eventually contain:

- aggregate world map
- voluntarily declared place entry
- arrival count
- place count
- country count
- reading-depth survival curve
- first-contact ledger
- spread velocity over time
- deepest-reading frontier
- recent geographic expansion

The map must show no fabricated seed data. Empty means empty.

## Minimum backend contract

The static site expects a small aggregate API. The endpoint base can be configured independently of the publication host.

### `POST /place`

Input:

```json
{"place":"Dublin, Ireland"}
```

Expected behavior:

- normalize place
- geocode to coarse centroid if necessary
- register the declaration without requiring personal identity
- recognize and timestamp first appearance of a normalized place
- return aggregate-safe confirmation

### `POST /reach`

Input example:

```json
{"journey":"anonymous-local-token","coordinate":"003:017","continuous":true}
```

Expected behavior:

- count a coordinate at most once per anonymous journey
- do not expose journey tokens publicly
- preserve enough ordering to distinguish continuous reach from deep-link entry

### `POST /arrival`

Registers a beginning journey once.

### `GET /state`

Returns only aggregate public state, for example:

```json
{
  "metrics": {
    "arrivals": 2481,
    "places": 83,
    "countries": 19,
    "deepest": "003:029"
  },
  "points": [
    {"place":"Dublin, Ireland","lat":53.35,"lon":-6.26,"count":41}
  ],
  "depth": [
    {"label":"Introduction","percent":100},
    {"label":"Chapter 1","percent":74.2}
  ],
  "ledger": [
    {"time":"2026-09-03 00:42 UTC","event":"Dublin, Ireland joined the trail","tag":"first contact"}
  ]
}
```

## Privacy boundary

The public system does not require:

- names
- emails
- accounts
- exact GPS location
- street addresses
- advertising identifiers
- social profiles
- cross-site tracking

A locally generated anonymous journey token may be used solely to prevent duplicate reach events and preserve the continuity of one reading journey. It should not be a general-purpose identity.

## Historical integrity

The spread ledger is part of the publication record.

Therefore:

- do not backfill invented readers or places
- do not silently reset counts
- record schema changes
- preserve first-contact timestamps
- distinguish migrations/imports from live observations
- keep derived statistics reproducible from stored aggregate events where practical

The purpose is unusual but simple: if this is the first time the idea is entering public life, the publication should allow its readers to watch that public life begin.
