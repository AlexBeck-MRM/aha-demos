# Design-to-Code Tutorial

Use this tutorial when explaining or running the handoff process from Figma into backlog content.

## Goal

Start from the right design source, extract the right level of documentation, and turn it into a consistent delivery draft without rewriting everything by hand.

## Step 1: Select the correct source in Figma

Start from the smallest handoff-ready `section`, `frame`, or `component` that has been deliberately documented.

That source should include:

- the intended UI
- local annotations
- visible states and variants
- any exceptions or special notes

Avoid starting from:

- a loose visual fragment
- a detached instance with no documentation
- a child layer that only shows styling

## Step 2: Check handoff status

Confirm whether the source is marked `Ready for dev`.

If it is not marked ready, treat the output as provisional and surface missing information as `Open questions`.

## Step 3: Read the documentation in the right order

Read documentation in this order:

1. status note
2. section or frame annotations
3. component annotations and descriptions
4. style and variable descriptions
5. measurements only where they call out critical exceptions

This prevents small visual details from distracting from the actual requirement.

## Step 4: Review states and variants

Check whether the documented source shows the states and variants that matter for build and QA.

Typical states:

- default
- hover
- active
- loading
- empty
- error
- disabled

Typical variants:

- size
- theme
- layout
- content mode
- device-specific version

If a state or variant is required but not documented, flag it.

## Step 5: Separate reusable guidance from local guidance

Use local section notes for:

- page-specific rules
- one-off behavior
- local content or layout exceptions

Use reusable component descriptions for:

- component purpose
- shared usage rules
- token intent
- implementation constraints that apply everywhere

## Step 6: Convert into backlog structure

Turn the documented source into a fixed delivery draft with:

- title
- figma source
- summary
- user story or intent
- acceptance criteria seed
- functional notes
- states and variants
- accessibility
- content and CMS
- data and logic
- analytics
- dependencies
- open questions

## Step 7: Keep traceability

Every important requirement should be traceable back to the design source.

If something cannot be traced:

- do not guess
- move it to `Open questions`
- identify who should clarify it
