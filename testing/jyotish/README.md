# Jyotish Testing Corpus

This directory holds prospective chart-reading cases for the GPT/Jyotish testing field described in `../JYOTISH_GPT_TEST.md`.

## Corpus rule

Each chart is one stable JSON record under `corpus/` and one entry in `corpus-manifest.json`.

The record keeps four things separate:

1. **Source birth data** — the data needed to calculate a chart.
2. **Calculation profile and derived chart** — the formal chart representation used in experiments.
3. **Blind model runs** — outputs produced without biographical outcomes, canonical answers, or other model outputs unless an assay explicitly requires them.
4. **Reference material** — traditional readings, human-expert readings, or later external outcomes used only after blind outputs have been frozen.

That separation is part of the experiment. It prevents a successful-looking reading from being created by leaking the answer into the input.

## Adding Liam's chart

`corpus/001-liam-birth-chart-placeholder.json` is reserved as `jyotish-001`.

When the source data is ready:

- replace only the null source fields with the birth data Liam explicitly intends to publish;
- record the calculation convention used to derive the chart;
- add derived placements without adding biographical interpretation;
- change `status` from `placeholder` to `ready` only after the chart representation has been checked;
- change the manifest's `contains_real_birth_data` and `eligible_for_blind_assays` fields accordingly;
- freeze each model run before adding reference outcomes or comparing it with another run.

Do not change the record ID when the placeholder becomes a live case.

## Minimum source fields

A calculable natal chart normally needs local birth date, local birth time, timezone, and birthplace or coordinates. Precision and uncertainty should be recorded rather than silently guessed.

No actual birth data is stored in the repository at present.
