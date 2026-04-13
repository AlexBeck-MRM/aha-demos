# Figma Annotation Schema

This schema keeps native Figma documentation consistent enough for an agent to parse and transfer into backlog content.

## Where documentation lives

- `Ready for dev status`
  Use on sections, frames, and components that are ready for technical review.
- `Annotations`
  Use for UI-adjacent requirements, exceptions, and behavior.
- `Measurements`
  Use only for spacing or sizing details that are easy to miss.
- `Component, style, and variable descriptions`
  Use for reusable-system intent, token meaning, and usage guidance.

## Allowed annotation categories

Use only these categories:

- `Development`
- `Interaction`
- `Accessibility`
- `Content`
- `Data`
- `Analytics`
- `Open questions`

## Writing rules

- One annotation should capture one topic.
- Keep annotations short.
- Use key-value lines so they are easy to scan and parse.
- If information is unknown, do not guess. Leave it out or move it to `Open questions`.

## Category templates

### Development

Use for implementation-facing rules, dependencies, and exceptions.

```text
Rule: <implementation or system rule>
Depends on: <dependency, if any>
Exception: <edge case, if any>
```

### Interaction

Use for user-triggered behavior, state changes, and motion.

```text
Trigger: <user action or system trigger>
Result: <what happens>
State: <state name, if relevant>
```

### Accessibility

Use for semantic, keyboard, focus, announcement, or contrast requirements.

```text
Must: <accessibility requirement>
Focus: <focus behavior, if needed>
Announce: <screen reader behavior, if needed>
```

### Content

Use for copy rules, field rules, and content ownership.

```text
Source: <CMS, manual, API, default copy>
Rule: <content constraint or editorial rule>
Fallback: <what happens when content is missing>
```

### Data

Use for business logic and data dependencies.

```text
Source: <API, CMS, service, manual input>
If: <condition>
Then: <result>
```

### Analytics

Use for tracking requirements.

```text
Event: <tracking event name>
When: <trigger point>
Props: <key properties or attributes>
```

### Open questions

Use for anything unresolved.

```text
Question: <open point>
Owner: <person or role>
```

## Minimum handoff expectation

For a handoff-ready page, flow, or component:

- status should be set to `Ready for dev`
- annotations should cover only what materially affects delivery
- states and variants should be visible in the design
- reusable components should have descriptions where system intent matters
