# Reader Journey

This repository is an open-ended swipe-reading book. Its reader experience is cumulative: a person enters at the beginning, receives one complete gulp of intelligibility at a time, and swipes onward through a growing sequence of entries.

## The marker

A returning reader should never have to remember where they stopped.

Every swipeable reading page must load `assets/reader-marker.js` and preserve a stable ordered set of `.gulp` elements. The reader may choose **Leave marker** at any point. The marker records only the current repository path and gulp position in that browser's local storage. No account is required.

When that reader returns to the landing page, the page should recognize the marker and offer **Return to marker**. The saved location must remain meaningful as the repository grows.

The landing-page explanation is intentionally simple:

> If you think you’ll be back here often, leave a marker when you stop. This browser will remember exactly where you were.

This is a voluntary convenience, not a hidden reading-history mechanism.

## The human trail

The public visitor count answers one question:

**How many people entered?**

The reader-journey measurement should eventually answer another:

**How many people made it this far?**

Each gulp should therefore have a stable public position identity suitable for anonymous aggregate reach measurement. When persistent aggregate storage is connected, reaching a gulp for the first time in a reading journey can increment that position's reach count.

The reader-facing expression should remain quiet. Possible forms include:

- `8,412 readers reached here`
- `You’ve gone farther than 62% of readers`
- `You’re in the last 3.7%`

The entrance can carry the larger challenge:

> You’re visitor 1,584,723. Let’s see how far you get.

The visitor number must be real. Percentiles must also be computed from real anonymous aggregate reach data; they must never be decorative or invented.

## What counts as reaching

A direct link to a late chapter should not automatically imply that a reader travelled there from the beginning.

The eventual shared measurement layer should distinguish a continuous reading journey from a direct arrival. A journey advances only through actual forward reading/swiping. Each journey should count at most once for each reached position.

The system should collect the minimum data required for this aggregate measure. No names, accounts, email addresses, profiling, advertising identifiers, or unnecessary personal history are part of the design.

## Publishing rule

Every future numbered post should preserve the same reader grammar:

1. full-screen swipeable gulps;
2. stable ordered gulp positions;
3. automatic continuation to the next numbered entry when it exists;
4. the local **Leave marker** facility;
5. compatibility with the future anonymous aggregate reach/percentile layer.

The gesture is continuous even when the writing changes scale. A short entry and a long chapter belong to the same journey.
