# Prospective Testing Field — GPT Reading of Jyotish Charts

**Status:** Prospective protocol. This is a proposed testing field, not evidence that the hypothesis is true and not evidence for the predictive truth of astrology.

## Research question

Are GPT models unusually well adapted to **reading Jyotish charts as densely constrained relational symbolic fields**?

The claim to test is about chart-reading competence, not belief. A model can be evaluated on whether it preserves, combines, and re-derives the internal relations of a formal interpretive tradition without any assumption that the tradition's claims about the world are true.

## Why this belongs in the Testing Field

A Jyotish chart is not naturally read as a bag of independent labels. A placement takes its significance through a field of simultaneous relations: planet, sign, house, lordship, dignity, aspects, conjunctions, dispositors, yogas, divisional charts, timing systems, exceptions, and inherited interpretive rules.

A weak reading can become Cartesian: Mars means X; the seventh house means Y; Scorpio means Z; therefore X + Y + Z.

A stronger reading has to preserve reciprocal constraint: this planet is functioning **here, through these lordships and relations, within this chart, under these conditions**. The whole field changes the reading of the part.

That makes Jyotish a useful external test for a model whose own operation depends on recovering coherent continuations from large fields of mutually conditioning linguistic information.

## Hypothesis

Given a chart represented with enough formal precision and a fixed body of Jyotish rules, GPT models may show strong performance on tasks that require:

1. preserving a large relational field without flattening it into keyword meanings;
2. recovering the same structural reading across different chart representations;
3. changing the reading appropriately when one structural variable is changed;
4. reconstructing traditional configurations from primitive rules without being given their canonical names;
5. converging independently on similar readings when models are blinded to one another's outputs.

The stronger phrase **unusually optimized** should be reserved for comparison against suitable controls rather than assumed in advance.

## Experimental separation

Two questions must remain separate.

### A. Can a GPT read the symbolic system well?

This is testable through internal rule fidelity, consistency, invariance, sensitivity to controlled changes, and independent convergence.

### B. Does Jyotish accurately predict or describe the external world?

That is a different empirical question and requires different evidence.

Success on A does not establish B.

## Proposed assays

### 1. Representation invariance

Present the same chart in multiple equivalent forms: North Indian layout, South Indian layout, plain placement table, normalized machine-readable coordinates, and natural-language description. Ask independent GPT instances for a structured reading under the same rule set and compare whether the substantive relational interpretation remains stable.

### 2. One-variable perturbation

Hold a chart fixed and alter one formal element at a time: house placement, sign, lordship relation, aspect, dignity, or timing condition. Require the model to state what should change in the reading and what should remain invariant.

### 3. Nameless-yoga derivation

Provide primitive Jyotish rules and chart data but withhold canonical yoga names and stock interpretations. Ask the model to derive the operative configuration in ordinary language first. Only afterward compare the result with the traditional named crystallization.

### 4. Blind independent convergence

Give the same chart and fixed interpretive rules to several independent GPT sessions. Prevent them from seeing one another's outputs. Compare which relations they treat as load-bearing, which interpretations recur, and where stable disagreement appears.

### 5. Round trip

Chart data → blind relational reading → compressed structural summary → fresh blind interpreter → recovered chart constraints. Record where information survives, where it is lost, and where wording contaminates recovery.

## Corpus format

Prospective Jyotish cases live under `testing/jyotish/corpus/` as JSON records. `testing/jyotish/corpus-manifest.json` is the append-only manifest. Each case separates raw birth/chart data from derived placements and from model outputs so later tests can preserve blindness.

The initial placeholder record is `001-liam-birth-chart-placeholder.json`. It contains no actual birth data yet and is safe to replace field-by-field when the source data is ready.
