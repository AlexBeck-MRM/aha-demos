# AHA smart search prototype

[Open the public prototype](https://alexbeck-mrm.github.io/aha-demos/reference/evidence/prototypes/aha-smart-search-playground-2026-09-15/).

Search as an alternative to the main menu. Results, AI answers and destination previews are simulated.

## Try it

- Open search with the top-right icon or Cmd/Ctrl+K.
- Type `high blood pressure`, `CPR`, `volunter oportunites` or `certifcation cpr`.
- Use suggestions, task links and content filters. Enter in the search input stays in the modal.
- Ask `How can I lower blood pressure?` for a short sourced sample answer.
- Choose the grey footer to open the expanded results list, then filter and sort.
- Use the demo footer for Desktop/Mobile, Test scenarios and Reset.

The modal contains up to ten prioritised cards. Full results use a sample catalogue of 1,176 records. No query is sent to an AI or search service; local options do not infer a location.

## Run and verify

Open `index.html` directly, or serve this directory with a static server. Fonts and partner logos are embedded; official source links need internet access.

```sh
node verify.mjs
```

53 checks cover ranking, tolerant matching, intent, suggestions, filters, sorting and pagination. Keyboard and browser checks do not constitute a complete accessibility audit.

## Assets

Lub Dub fonts and the Critical Mass, MRM and AHA logos are embedded from the existing AHA demo assets. No licence is granted for reuse of code or brand assets.
