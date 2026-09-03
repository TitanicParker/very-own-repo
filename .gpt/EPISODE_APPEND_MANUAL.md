# GPT Episode Append Manual

**Purpose:** Entry point for any GPT proposing, drafting, or publishing a new episode in this repository.

**Status:** Mandatory repository instruction.

The book is cumulative. A new episode is allowed to exist only when it can inherit the reader state created by the book that already exists and leave a further state available for what may come next.

> **Do not append from memory, from a summary, from the latest episode alone, from an inspiration repository alone, or from the user's proposed topic alone. Read the live reader from the entrance to the living edge first.**

## Mandatory instruction set

Before doing any episode work, read these hidden resources in this order:

1. `.gpt/CONTINUITY_CORE.md` — the full congruence, semantics, reader-experience, append, verification, and repository-hygiene protocol.
2. `.gpt/INSPIRATION_FIELDS.md` — the rules for using `TitanicParker/persistence` and `TitanicParker/perpetual-essays` without allowing them to override the live book.

Then execute the mandatory live read defined in `CONTINUITY_CORE.md`: entrance → contents → every live episode in order → living edge, plus the appendix and testing field when relevant.

## Source priority

When sources disagree, use this order:

1. **The live published sequence in this repository** governs what the reader has actually been taught and what continuity is currently available.
2. **`APPENDIX.md`** governs the current public primitive grammar and terminology.
3. **The 54 as published in Episode 4, together with the primitive definitions in `APPENDIX.md`,** are the primary finite structural field for future investigation.
4. **`TESTING_FIELD.md`** governs the exact 27 fairy tales and 615 mathematical traversals.
5. **`.gpt/CONTINUITY_CORE.md`** governs append procedure and congruence.
6. **Persistence** is a secondary deep theoretical/reference and exposition field.
7. **Perpetual Essays** is a secondary exploratory essay and world-application field.

Persistence and Perpetual Essays may still provoke, clarify, or supply candidate manifestations. They do **not** determine the next episode and they do not silently revise items 1–5.

## Current post-Episode-14 checkpoint

The live book now has two large movements.

**Episodes 1–7 make completion visible.** They distinguish meaning from intelligibility, define enough as demand-relative sufficiency, introduce the fifteen primitive definitions and the 54, open the testing field, show completion making continuation possible, and then expose inheritance—including the fact that false completions can acquire futures.

**Episodes 8–14 make the future of completion visible.** They deepen Standing / Bearing / Efficacy, separate sentence from landing, show that genuine completion can reopen, distinguish repair from changed conditions, show how small expressions carry inherited work, describe enough shared availability between people, and end by arguing that efficient inheritance should sometimes leave a recoverable route back to what made a result enough.

Episode 14 therefore creates a particularly strong hinge: the book has argued for recoverability, so the book itself can now **return to its own source field** and inspect it again at a higher resolution.

The return is not repetition. The reader who returns after Episode 14 is not the reader who first entered the testing field in Episode 5.

## Primary inspiration phase after Episode 14

Unless the live continuity later creates a better reason to do otherwise, candidate episodes should now be generated primarily from three internal sources:

### 1. The 54 themselves

Use the 54 as a finite field of structural questions, not as a checklist to march through mechanically.

Ask which forms, neighboring distinctions, topologies, or persistence modes the reader has technically seen but has not yet learned to recognize richly in life.

Do not force a future episode to “cover a cell.” Let the live question select the relevant part of the field.

### 2. The 27 fairy tales

Give the fairy tales heavy weight in reader-facing development because they carry the phenomenon under **narrative pressure** and because they are concrete, memorable, sequential, and highly readable.

Read them first as stories.

Ask what becomes available after each event, warning, promise, disguise, departure, failure, repetition, rescue, transformation, return, or recognition. Notice how a child or adult reader can move through a changing world because earlier completions remain available strongly enough for later ones to matter.

The larger cultural and developmental significance of story reading is a legitimate research direction, but distinguish carefully between what the testing field itself demonstrates and what requires external evidence. The internal corpus can show that these fairy tales depend on inherited intelligibility. It cannot by itself prove a developmental claim about what fairy tales or shared reading do to children's cognition.

### 3. The 615 mathematical traversals

Use the traversals as the severe comparison field: completed intelligibility under **proof pressure**.

A story asks what can happen next. A proof asks what can now be lawfully established.

The 615 preserve a long movement from fixed compass action through construction, recurrence, coordinate memory, invariant-preserving transformation, trigonometric structure, symbolic record, equation, and algebra. They are especially valuable wherever the book needs to distinguish mere sequence from licensed continuation.

Do not use mathematics decoratively. Choose a traversal only when the dependency route itself makes the intended phenomenon palpable.

## Story / proof / cognition research horizon

A major hypothesis is now available to investigate:

> **The 54 may be forms through which cognition makes reality graspable enough to continue from.**

Treat that as a research horizon, not as an already established empirical fact.

The book has earned a cross-domain structural observation:

- in a fairy tale, something becomes intelligible and changes what can happen next;
- in a proof, something becomes established and changes what can lawfully be established next;
- in ordinary cognition, the candidate broader phenomenon is that something becomes graspable and changes what can now be taken up.

Do not silently convert recurrence across story and proof into a neurological, developmental, or universal cognitive proof. Those stronger claims require independent evidence.

The names and coordinate system are ours. If the phenomenon is genuinely general, the phenomenon would precede the names.

## Candidate-generation protocol

For a new episode after this checkpoint:

1. Read the live book through the living edge.
2. State the precise unresolved question now available.
3. Consult the 54 for the structural distinctions that bear on that question.
4. Search the 27 fairy tales for a narrative passage that exhibits the pressure naturally.
5. Search the 615 traversals for a proof sequence that exhibits the pressure under stricter dependency.
6. Do **not** require both sources to instantiate the same coordinate. Their value may lie in exposing the same larger phenomenon under different constraints.
7. Ask what the comparison lets the reader notice in ordinary reality that was not previously available at this resolution.
8. Draft only when the result passes the Continuation Warrant.

A particularly strong candidate should survive this question:

> **If the fairy tale were removed, would the episode lose felt human reality? If the proof were removed, would it lose structural severity?**

If the answer to both is yes, the pairing is doing real work.

## Persistent public reader utilities

The public reader now has two persistent utilities that must survive every future append:

- **Share** — always available while reading, independent of the current gulp. It shares the current page/episode, not a single gulp unless gulp-sharing is deliberately introduced later.
- **Visit count** — a small visible global count, incremented once for a new browser/app reading session and displayed across the reading experience.

These are implemented centrally in `assets/site-utilities.js` and loaded automatically by `assets/reader-marker.js` for the entrance and all episode pages. Non-episode HTML surfaces such as `book.html` and `testing/index.html` must load `assets/site-utilities.js` directly using the correct relative path.

Do not duplicate the counter/share implementation inside new episode HTML. Keep the utilities centralized so behavior, visual treatment, and counting rules remain consistent across the book.

When changing the installed reader cache, keep `assets/site-utilities.js` in `service-worker.js` and advance the cache version.

The count is a **visit/session count, not a verified unique-person count**. Do not relabel it as unique readers without a different measurement system.

## Governing test

Before drafting, produce the private Continuation Warrant required by `CONTINUITY_CORE.md` and answer:

> **Why can this episode properly appear now, but could not properly have appeared several episodes earlier?**

For source-derived material, also answer:

> **What does this material let the reader see in the world that the book has prepared them to see now?**

If the answer is merely that the source is interesting, eloquent, relevant, familiar, or already written, the append has not been earned.

## The long-term publication vision

This repository is not intended to stop when the primitive grammar has been introduced. It is intended to become a regularly growing public resource.

Later episodes may revisit previously digested material. Reuse is not a defect when the new episode changes the reader's resolution, domain of recognition, or capacity to see the phenomenon outside the original examples.

The standard is therefore not perpetual novelty of theory.

The standard is **newly available recognition**.

A later episode may take something the reader already knows abstractly and make it visible in a story, proof, queue, promise, repair, classroom, friendship, map, tool, institution, scientific practice, disagreement, public rule, or another ordinary part of life.

But it must still perform a real movement. “The same idea in different clothes” is not sufficient unless the different material reveals a structural consequence, boundary, pressure, or recognition that was not previously available.

> **The project grows by allowing the reader to recognize completed intelligibility in more of reality, without loosening the grammar in order to make reality fit.**
