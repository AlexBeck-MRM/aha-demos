# DevOps Output Template

Use this structure when converting native Figma documentation into backlog-ready output.

## Required sections

### Title

Clear backlog title for the slice, page, flow, or component.

### Figma source

- file or page name
- node name
- node ID or URL
- current dev status

### Summary

One short paragraph describing what this item is and why it exists.

### User story or intent

Use one of these:

```text
As a <user>, I can <action>, so that <outcome>.
```

or:

```text
Intent: <plain-language purpose>
```

Use the plain-language intent form if a strict user story would add noise.

### Acceptance criteria seed

List only testable requirements that can be traced to the design source.

```text
1. <criterion>
2. <criterion>
3. <criterion>
```

### Functional notes

- behavior not already obvious from the acceptance criteria
- interaction rules
- state handling

### States and variants

- default
- hover
- active
- loading
- empty
- error
- disabled
- any named variant

List only the states and variants that actually apply.

### Accessibility

- semantics
- keyboard behavior
- focus behavior
- announcement needs
- contrast or readability constraints

### Content and CMS

- content source
- field rules
- fallback rules
- authoring constraints
- localization notes

### Data and logic

- data source
- conditions
- business rules
- dependencies

### Analytics

- event names
- trigger points
- expected properties

### Dependencies

- components
- APIs
- CMS templates
- shared services
- related tickets or blockers

### Open questions

Anything unresolved, contradictory, or not visible enough in the design source.

## Splitting rule

If the source is too large for one ticket, produce:

- a summary for the whole slice
- a recommended ticket split
- one backlog draft per split item
