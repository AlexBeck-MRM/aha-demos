import fs from "fs";
import path from "path";

const root = process.cwd();

const requiredPaths = [
  "AGENTS.md",
  ".codex/config.toml",
  "knowledge/sources/README.md",
  "knowledge/sources/index.yaml",
  "knowledge/sources/discovery-playback/README.md",
  "knowledge/sources/discovery-playback/index.md",
  "knowledge/sources/discovery-playback/canonical-sources.md",
  "knowledge/sources/discovery-playback/master-playback-notes.md",
  "knowledge/sources/discovery-playback/technology-playback-notes.md",
  "knowledge/sources/brand-guidelines/README.md",
  "knowledge/sources/brand-guidelines/index.md",
  "knowledge/sources/brand-guidelines/canonical-sources.md",
  "knowledge/sources/brand-guidelines/ingest-status.md",
  "knowledge/sources/current-site-audit/README.md",
  "knowledge/sources/current-site-audit/index.md",
  "knowledge/sources/current-site-audit/aha-current-site-observations.md",
  "knowledge/sources/current-site-audit/comparative-notes/health-and-brand-comparators.md",
  "knowledge/sources/figma-design-workbench/README.md",
  "knowledge/sources/figma-design-workbench/index.md",
  "knowledge/sources/figma-design-workbench/canonical-sources.md",
  "knowledge/sources/figma-design-workbench/board-audit.md",
  "knowledge/sources/stakeholder-notes/README.md",
  "knowledge/sources/stakeholder-notes/index.md",
  "knowledge/AGENTS.md",
  "knowledge/distilled/canonical-brief.md",
  "knowledge/distilled/project-summary.md",
  "knowledge/distilled/aha-today.md",
  "knowledge/distilled/aha-narrative.md",
  "knowledge/distilled/audience-needs.md",
  "knowledge/distilled/digital-opportunity.md",
  "knowledge/distilled/constraints-and-non-negotiables.md",
  "knowledge/distilled/index.md",
  "knowledge/glossary.md",
  "language/voice-and-tone.md",
  "language/messaging-framework.md",
  "language/content-taxonomy.md",
  "language/microcopy-patterns.md",
  "language/sample-live-copy.md",
  "language/audience-messages.md",
  "language/cta-logic.md",
  "language/page-pattern-copy.md",
  "language/route-a-vs-route-b-voice.md",
  "design/AGENTS.md",
  "design/north-star.md",
  "design/design-principles.md",
  "design/styleframes/01-brand-presence.md",
  "design/styleframes/02-website-ecosystem.md",
  "design/routes/route-a.md",
  "design/routes/route-b.md",
  "design/routes/route-comparison.md",
  "design/routes/route-deltas.md",
  "design/figma/README.md",
  "design/figma/workbench-section-map.yaml",
  "design/ui-style-inventory/README.md",
  "design/references/manifest.yaml",
  "prompts/codex/critique.md",
  "prompts/codex/route-iteration.md",
  "prompts/codex/styleframe-review.md",
  "prompts/codex/summary.md",
  "prompts/codex/fast-brief.md",
  "prompts/codex/source-ingest.md",
  "prompts/codex/evidence-synthesis.md",
  "prompts/codex/inventory-update.md",
  "prompts/image-generation/styleframe-01.md",
  "prompts/image-generation/styleframe-02.md",
  "prompts/image-generation/route-templates.md",
  "prompts/evaluation/review-rubric.md",
  "prompts/evaluation/route-scorecard.md",
  "logs/decision-log.md",
  "logs/critique-log.md",
  "logs/route-evolution.md",
  "logs/open-questions.md",
  "logs/contradictions.md",
  "logs/session-notes/README.md",
  "logs/session-notes/2026-04-10-design-brain-bootstrap.md",
  "logs/session-notes/2026-04-11-brain-optimization.md",
  "templates/inventory-entry.md",
  "templates/reference-entry.md",
  "templates/decision-entry.md",
  "templates/route-entry.md",
  "templates/session-note.md",
  "skills/design-brain-auditor/SKILL.md",
  "evidence/AGENTS.md",
  "evidence/reference-index.yaml",
  "evidence/screenshots/.gitkeep",
  "logs/recommendation-review.md",
  "README.md",
];

const inventoryFiles = [
  "nav-elements.md",
  "mega-menu.md",
  "color-scheme.md",
  "icons.md",
  "depth.md",
  "cards.md",
  "illustration-use.md",
  "image-types.md",
  "photography-treatment.md",
  "headlines.md",
  "video.md",
  "text-hierarchy.md",
  "links-and-guidance.md",
  "carousels.md",
  "text-formatting.md",
  "illustration-style.md",
  "gradients.md",
  "tabs.md",
  "search.md",
  "dials.md",
  "first-load.md",
  "interaction.md",
  "forms.md",
  "grid.md",
  "trust-cues.md",
  "accessibility.md",
  "motion-reveals.md",
  "page-templates.md",
  "content.md",
  "image-cropping.md",
  "buttons.md",
  "ai.md",
].map((file) => path.join("design/ui-style-inventory", file));

const referenceCaptionFiles = [
  "design/references/captions/ref-001.yaml",
  "design/references/captions/ref-002.yaml",
  "design/references/captions/ref-003.yaml",
  "design/references/captions/ref-004.yaml",
];

const missing = [...requiredPaths, ...inventoryFiles, ...referenceCaptionFiles].filter(
  (relativePath) => !fs.existsSync(path.join(root, relativePath)),
);

if (missing.length > 0) {
  console.error("Missing required design-brain files:");
  for (const relativePath of missing) {
    console.error(`- ${relativePath}`);
  }
  process.exit(1);
}

const manifestPath = path.join(root, "design/references/manifest.yaml");
const manifest = fs.readFileSync(manifestPath, "utf8");
const manifestSourceMatches = [...manifest.matchAll(/^\s*source:\s*(.+)$/gm)].map((match) =>
  match[1].trim(),
);

const missingManifestSources = manifestSourceMatches.filter(
  (relativePath) => !fs.existsSync(path.join(root, relativePath)),
);

if (missingManifestSources.length > 0) {
  console.error("Reference manifest points to missing source files:");
  for (const relativePath of missingManifestSources) {
    console.error(`- ${relativePath}`);
  }
  process.exit(1);
}

const frontmatterRequired = [
  "knowledge/distilled/canonical-brief.md",
  "knowledge/distilled/project-summary.md",
  "knowledge/distilled/aha-today.md",
  "knowledge/distilled/aha-narrative.md",
  "knowledge/distilled/audience-needs.md",
  "knowledge/distilled/digital-opportunity.md",
  "knowledge/distilled/constraints-and-non-negotiables.md",
  "language/voice-and-tone.md",
  "language/messaging-framework.md",
  "language/content-taxonomy.md",
  "language/microcopy-patterns.md",
  "language/sample-live-copy.md",
  "design/north-star.md",
  "design/design-principles.md",
  "design/styleframes/01-brand-presence.md",
  "design/styleframes/02-website-ecosystem.md",
  "design/routes/route-a.md",
  "design/routes/route-b.md",
  "design/routes/route-comparison.md",
  "design/routes/route-deltas.md",
];

const missingFrontmatter = frontmatterRequired.filter((relativePath) => {
  const contents = fs.readFileSync(path.join(root, relativePath), "utf8");
  return !contents.startsWith("---\n");
});

if (missingFrontmatter.length > 0) {
  console.error("Missing required front matter:");
  for (const relativePath of missingFrontmatter) {
    console.error(`- ${relativePath}`);
  }
  process.exit(1);
}

const evidenceIndexPath = path.join(root, "evidence/reference-index.yaml");
const evidenceIndex = fs.readFileSync(evidenceIndexPath, "utf8");
const evidencePathMatches = [...evidenceIndex.matchAll(/^\s*path:\s*(.+)$/gm)].map((match) =>
  match[1].trim(),
);

const missingEvidencePaths = evidencePathMatches.filter(
  (relativePath) => !fs.existsSync(path.join(root, relativePath)),
);

if (missingEvidencePaths.length > 0) {
  console.error("Evidence reference index points to missing files:");
  for (const relativePath of missingEvidencePaths) {
    console.error(`- ${relativePath}`);
  }
  process.exit(1);
}

console.log("Design-brain verification passed.");
console.log(`Checked ${requiredPaths.length + inventoryFiles.length + referenceCaptionFiles.length} required files.`);
console.log(`Validated ${manifestSourceMatches.length} reference-manifest source links.`);
console.log(`Validated ${evidencePathMatches.length} evidence-index links.`);
