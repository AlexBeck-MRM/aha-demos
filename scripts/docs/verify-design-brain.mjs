import fs from "fs";
import path from "path";

const root = process.cwd();
const ignoredRoots = new Set([
  ".git",
  "node_modules",
  ".artifacts",
  ".playwright-cli",
  ".venv-docx",
  ".tmp",
  "output",
  "tmp",
]);

const requiredPaths = [
  "AGENTS.md",
  "README.md",
  ".codex/config.toml",
  "package.json",
  "brain/README.md",
  "brain/ops-language.md",
  "brain/router.yaml",
  "projects/README.md",
  "projects/index.yaml",
  "projects/current-project.yaml",
  "projects/aha-website-refresh/project.yaml",
  "projects/aha-website-refresh/brief.md",
  "projects/aha-website-refresh/open-questions.md",
  "projects/aha-website-refresh/session-log.md",
  "projects/aha-website-refresh/retrieval-index.yaml",
  "knowledge/AGENTS.md",
  "knowledge/glossary.md",
  "knowledge/sources/README.md",
  "knowledge/sources/index.yaml",
  "knowledge/sources/aha-brand-history/README.md",
  "knowledge/sources/aha-brand-history/index.md",
  "knowledge/sources/aha-brand-history/canonical-sources.md",
  "knowledge/sources/aha-brand-history/brand-history-report.md",
  "knowledge/sources/aha-brand-history/visual-timeline.md",
  "knowledge/sources/brand-guidelines/README.md",
  "knowledge/sources/brand-guidelines/index.md",
  "knowledge/sources/brand-guidelines/canonical-sources.md",
  "knowledge/sources/brand-guidelines/ingest-status.md",
  "knowledge/sources/current-site-audit/README.md",
  "knowledge/sources/current-site-audit/index.md",
  "knowledge/sources/current-site-audit/aha-current-site-observations.md",
  "knowledge/sources/current-site-audit/comparative-notes/health-and-brand-comparators.md",
  "knowledge/sources/discovery-playback/README.md",
  "knowledge/sources/discovery-playback/index.md",
  "knowledge/sources/discovery-playback/canonical-sources.md",
  "knowledge/sources/discovery-playback/master-playback-notes.md",
  "knowledge/sources/discovery-playback/technology-playback-notes.md",
  "knowledge/sources/experience-insights-mergers/README.md",
  "knowledge/sources/experience-insights-mergers/index.md",
  "knowledge/sources/experience-insights-mergers/canonical-sources.md",
  "knowledge/sources/experience-insights-mergers/document-location-map.yaml",
  "knowledge/sources/experience-insights-mergers/hypotheses-and-conclusions.md",
  "knowledge/sources/figma-design-workbench/README.md",
  "knowledge/sources/figma-design-workbench/index.md",
  "knowledge/sources/figma-design-workbench/canonical-sources.md",
  "knowledge/sources/figma-design-workbench/board-audit.md",
  "knowledge/sources/stakeholder-notes/index.md",
  "knowledge/distilled/canonical-brief.md",
  "knowledge/distilled/project-summary.md",
  "knowledge/distilled/aha-brand-history.md",
  "knowledge/distilled/aha-narrative.md",
  "knowledge/distilled/aha-today.md",
  "knowledge/distilled/audience-needs.md",
  "knowledge/distilled/digital-opportunity.md",
  "knowledge/distilled/constraints-and-non-negotiables.md",
  "knowledge/distilled/experience-research-hypotheses.md",
  "knowledge/distilled/index.md",
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
  "prompts/image-generation/board-to-prompt-map.yaml",
  "prompts/image-generation/master-styleframe-prompt.md",
  "prompts/image-generation/styleframe-01.md",
  "prompts/image-generation/styleframe-02.md",
  "prompts/image-generation/route-templates.md",
  "prompts/wireframes/styleframe-01-wireframe.png",
  "prompts/wireframes/styleframe-02-wireframe.png",
  "logs/decision-log.md",
  "logs/route-evolution.md",
  "reference/evidence/README.md",
  "reference/evidence/reference-index.yaml",
  "reference/evidence/capture_manifest.csv",
  "reference/evidence/qc_report_final.csv",
  "reference/evidence/recordings/american_heart_association__home.mp4",
  "reference/evidence/recordings/american_heart_association__key.mp4",
  "reference/slides/README.md",
  "reference/slides/aha-slide-system-v1.6.md",
  "reference/slides/deck-v1.6-all-layouts.css",
  "reference/slides/deck-v1.6-all-layouts.html",
  "reference/slides/deck-v1.6-tokens.css",
  "reference/slides/layouts.manifest.json",
  "reference/slides/tokens-studio-v1.6.json",
  "reference/slides/tokens-v1.6.json",
  "reference/docs/aha-design-to-code-workflow-v1.md",
  "reference/data/brand_capture_targets.csv",
  "scripts/README.md",
  "scripts/docs/verify-design-brain.mjs",
  "scripts/docs/init-project.mjs",
  "templates/decision-entry.md",
  "templates/inventory-entry.md",
  "templates/reference-entry.md",
  "templates/route-entry.md",
  "templates/session-note.md",
  "templates/project-state.yaml",
  "templates/project-brief.md",
  "templates/project-open-questions.md",
  "templates/project-session-log.md",
  "templates/project-retrieval-index.yaml",
];

const inventoryFiles = [
  "accessibility.md",
  "ai.md",
  "article-intros.md",
  "buttons.md",
  "cards.md",
  "carousels.md",
  "color-scheme.md",
  "content.md",
  "depth.md",
  "dials.md",
  "first-load.md",
  "forms.md",
  "gradients.md",
  "grid.md",
  "headlines.md",
  "icons.md",
  "illustration-style.md",
  "illustration-use.md",
  "image-cropping.md",
  "image-types.md",
  "interaction.md",
  "links-and-guidance.md",
  "mega-menu.md",
  "motion-reveals.md",
  "nav-elements.md",
  "page-templates.md",
  "photography-treatment.md",
  "responsiveness.md",
  "search.md",
  "tabs.md",
  "text-hierarchy.md",
  "trust-cues.md",
  "video.md",
].map((file) => path.join("design/ui-style-inventory", file));

const referenceCaptionFiles = [
  "design/references/captions/ref-001.yaml",
  "design/references/captions/ref-002.yaml",
  "design/references/captions/ref-003.yaml",
  "design/references/captions/ref-004.yaml",
];

const requiredIntentIds = [
  "question",
  "source-ingest",
  "knowledge-distill",
  "board-review",
  "inventory-update",
  "route-update",
  "decision",
  "project-bootstrap",
];

const requiredProjectDocFrontmatterKeys = [
  "project_id",
  "status",
  "owner",
  "last_updated",
  "source_refs",
  "decision_refs",
];

const requiredProjectStateKeys = [
  "id",
  "title",
  "status",
  "owner",
  "created",
  "last_updated",
  "canonical_brief",
  "decision_log",
  "route_log",
  "retrieval_index",
  "brief_file",
  "open_questions_file",
  "session_log_file",
];

const requiredRetrievalRoutes = [
  "question",
  "source-ingest",
  "knowledge-distill",
  "board-review",
  "inventory-update",
  "route-update",
  "decision",
  "project-bootstrap",
];

const requiredDefaultWriteTargets = [
  "source_notes",
  "distilled",
  "decisions",
  "route_log",
  "inventory",
  "routes",
  "project_state",
];

const operationalFiles = [
  "brain/README.md",
  "brain/ops-language.md",
  "projects/README.md",
  "projects/aha-website-refresh/brief.md",
  "projects/aha-website-refresh/open-questions.md",
  "projects/aha-website-refresh/session-log.md",
  "logs/decision-log.md",
  "logs/route-evolution.md",
  "scripts/README.md",
  "templates/decision-entry.md",
  "templates/route-entry.md",
  "templates/session-note.md",
  "templates/project-brief.md",
  "templates/project-open-questions.md",
  "templates/project-session-log.md",
];

const operationalHeadingSchemas = [
  {
    path: "brain/README.md",
    headings: ["# Brain Router", "## Job", "## Use", "## Flow", "## Rule"],
  },
  {
    path: "brain/ops-language.md",
    headings: [
      "# Ops Language",
      "## Job",
      "## Scope",
      "## Rules",
      "## Canonical verbs",
      "## Banned drift",
      "## File schemas",
    ],
  },
  {
    path: "projects/README.md",
    headings: ["# Projects", "## Job", "## Files", "## Rules"],
  },
  {
    path: "projects/aha-website-refresh/brief.md",
    headings: ["# Project Brief", "## State", "## Scope", "## Canonical refs", "## Storage rule"],
  },
  {
    path: "projects/aha-website-refresh/open-questions.md",
    headings: ["# Open Questions", "## Retrieval", "## Board", "## Ops"],
  },
  {
    path: "projects/aha-website-refresh/session-log.md",
    headings: ["# Session Log", "## 2026-04-16", "### Task", "### Change", "### Files", "### Next"],
  },
  {
    path: "scripts/README.md",
    headings: [
      "# Scripts",
      "## Job",
      "## Folders",
      "## Entry points",
      "## Figma checks",
      "## Native Figma flow",
      "## Figma verify",
    ],
  },
  {
    path: "templates/decision-entry.md",
    headings: ["# Decision Entry", "## Date", "## Project ID", "## Decision", "## Why", "## Files", "## Next"],
  },
  {
    path: "templates/route-entry.md",
    headings: ["# Route Entry", "## Route", "## Project ID", "## Change", "## Why", "## Fixed", "## Risks", "## Next"],
  },
  {
    path: "templates/session-note.md",
    headings: [
      "# Session Note",
      "## Date",
      "## Project ID",
      "## Task",
      "## Sources",
      "## Change",
      "## Decisions",
      "## Open questions",
    ],
  },
  {
    path: "templates/project-brief.md",
    headings: ["# Project Brief", "## State", "## Scope", "## Canonical refs", "## Storage rule"],
  },
  {
    path: "templates/project-open-questions.md",
    headings: ["# Open Questions", "## Retrieval", "## Board", "## Ops"],
  },
  {
    path: "templates/project-session-log.md",
    headings: ["# Session Log", "## {{date}}", "### Task", "### Change", "### Files", "### Next"],
  },
];

const operationalDriftPatterns = [
  /\bintroduc(?:e|es|ed|ing)\b/i,
  /\brevis(?:e|es|ed|ing)\b/i,
  /\bpreserv(?:e|es|ed|ing)\b/i,
  /\bevaluat(?:e|es|ed|ing)\b/i,
  /\bleverag(?:e|es|ed|ing)\b/i,
  /\butiliz(?:e|es|ed|ing)\b/i,
  /\boptimiz(?:e|es|ed|ing)\b/i,
  /\bfrictionless\b/i,
  /\bseamless\b/i,
];

const missing = [...requiredPaths, ...inventoryFiles, ...referenceCaptionFiles].filter(
  (relativePath) => !exists(relativePath),
);

failIfAny("Missing required design-brain files:", missing);

const forbiddenPaths = [
  "design/styleframes types",
  "prompts/image-generation/compiled",
];

const presentForbiddenPaths = forbiddenPaths.filter((relativePath) => exists(relativePath));
failIfAny("Forbidden legacy paths still exist:", presentForbiddenPaths);

const strayMacFiles = walk(".").filter((relativePath) => path.basename(relativePath) === ".DS_Store");
failIfAny("Remove Finder metadata files:", strayMacFiles);

validateManifestSources();
validateEvidenceIndex();
validateFrontmatterRequirements();
validateInventoryMetadata();

const currentProject = validateProjects();
validateRouter(currentProject);
validateOperationalLanguage(currentProject);

console.log("Design brain structure looks valid.");

function validateManifestSources() {
  const manifest = read("design/references/manifest.yaml");
  const manifestSourceMatches = [...manifest.matchAll(/^\s*source:\s*(.+)$/gm)].map((match) =>
    stripQuotes(match[1].trim()),
  );

  const missingManifestSources = manifestSourceMatches.filter((relativePath) => !exists(relativePath));
  failIfAny("Reference manifest points to missing source files:", missingManifestSources);
}

function validateEvidenceIndex() {
  const evidenceIndex = read("reference/evidence/reference-index.yaml");
  const evidencePathMatches = [...evidenceIndex.matchAll(/^\s*path:\s*(.+)$/gm)].map((match) =>
    stripQuotes(match[1].trim()),
  );

  const missingEvidencePaths = evidencePathMatches.filter((relativePath) => !exists(relativePath));
  failIfAny("Evidence index points to missing files:", missingEvidencePaths);
}

function validateFrontmatterRequirements() {
  const frontmatterRequired = [
    "knowledge/distilled/canonical-brief.md",
    "knowledge/distilled/project-summary.md",
    "knowledge/distilled/aha-brand-history.md",
    "knowledge/distilled/aha-today.md",
    "knowledge/distilled/aha-narrative.md",
    "knowledge/distilled/audience-needs.md",
    "knowledge/distilled/digital-opportunity.md",
    "knowledge/distilled/constraints-and-non-negotiables.md",
    "knowledge/distilled/experience-research-hypotheses.md",
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

  const missingFrontmatter = frontmatterRequired.filter((relativePath) => !readFrontmatter(relativePath));
  failIfAny("Missing required front matter:", missingFrontmatter);

  const missingProjectBindings = frontmatterRequired.filter((relativePath) => {
    const frontmatter = readFrontmatter(relativePath);
    return !hasFrontmatterKey(frontmatter, "project_id");
  });
  failIfAny("Core derived files are missing required project_id metadata:", missingProjectBindings);
}

function validateInventoryMetadata() {
  const inventoryMetadataKeys = [
    "status",
    "project_id",
    "source_of_truth",
    "figma_section",
    "figma_node_id",
    "sync_status",
    "last_synced_from_figma",
    "content_version",
  ];

  const missingInventoryFrontmatter = [];
  const inventoryMissingMetadata = [];

  for (const relativePath of inventoryFiles) {
    const frontmatter = readFrontmatter(relativePath);
    if (!frontmatter) {
      missingInventoryFrontmatter.push(relativePath);
      continue;
    }

    for (const key of inventoryMetadataKeys) {
      if (!hasFrontmatterKey(frontmatter, key)) {
        inventoryMissingMetadata.push(`${relativePath} :: ${key}`);
      }
    }
  }

  failIfAny("Inventory files missing required front matter:", missingInventoryFrontmatter);
  failIfAny("Inventory files missing required freshness metadata:", inventoryMissingMetadata);
}

function validateProjects() {
  const indexContents = read("projects/index.yaml");
  const entries = parseListBlocks(indexContents, 2);
  if (entries.length === 0) {
    fail("Project index must contain at least one project entry.");
  }

  const missingProjectIndexFields = [];
  for (const entry of entries) {
    for (const key of ["id", "title", "path", "status", "default"]) {
      if (!entry[key]) {
        missingProjectIndexFields.push(`${entry.id || "<unknown>"} :: ${key}`);
      }
    }
  }
  failIfAny("Project index entries missing required fields:", missingProjectIndexFields);

  const defaultEntries = entries.filter((entry) => entry.default === "true");
  if (defaultEntries.length !== 1) {
    fail(`projects/index.yaml must contain exactly one default project. Found ${defaultEntries.length}.`);
  }

  const currentProjectFile = read("projects/current-project.yaml");
  const currentProjectId = extractScalar(currentProjectFile, "project_id");
  const currentProjectPath = extractScalar(currentProjectFile, "project_path");
  const currentProjectUpdated = extractScalar(currentProjectFile, "updated");
  const currentProjectReason = extractScalar(currentProjectFile, "reason");

  const missingCurrentProjectFields = [];
  for (const [key, value] of Object.entries({
    project_id: currentProjectId,
    project_path: currentProjectPath,
    updated: currentProjectUpdated,
    reason: currentProjectReason,
  })) {
    if (!value) {
      missingCurrentProjectFields.push(key);
    }
  }
  failIfAny("projects/current-project.yaml is missing required fields:", missingCurrentProjectFields);

  const currentEntry = entries.find((entry) => entry.id === currentProjectId);
  if (!currentEntry) {
    fail(`projects/current-project.yaml points to an unknown project id: ${currentProjectId}`);
  }

  if (currentEntry.path !== currentProjectPath) {
    fail(
      `projects/current-project.yaml path mismatch for ${currentProjectId}: expected ${currentEntry.path}, found ${currentProjectPath}`,
    );
  }

  if (defaultEntries[0].id !== currentProjectId) {
    fail(
      `projects/current-project.yaml points to ${currentProjectId}, but default project in projects/index.yaml is ${defaultEntries[0].id}.`,
    );
  }

  const missingProjectFolders = entries
    .map((entry) => entry.path)
    .filter((relativePath) => !directoryExists(relativePath));
  failIfAny("Project index points to missing project folders:", missingProjectFolders);

  for (const entry of entries) {
    validateProjectState(entry);
  }

  return {
    id: currentProjectId,
    path: currentProjectPath,
  };
}

function validateProjectState(entry) {
  const projectStatePath = path.join(entry.path, "project.yaml");
  const projectStateContents = read(projectStatePath);
  const missingKeys = requiredProjectStateKeys.filter((key) => !extractScalar(projectStateContents, key));
  failIfAny(`Project state file is missing required fields for ${entry.id}:`, missingKeys);

  const projectId = extractScalar(projectStateContents, "id");
  if (projectId !== entry.id) {
    fail(`Project state id mismatch for ${entry.id}: found ${projectId}`);
  }

  const referencedPaths = [
    extractScalar(projectStateContents, "canonical_brief"),
    extractScalar(projectStateContents, "decision_log"),
    extractScalar(projectStateContents, "route_log"),
    extractScalar(projectStateContents, "retrieval_index"),
    extractScalar(projectStateContents, "brief_file"),
    extractScalar(projectStateContents, "open_questions_file"),
    extractScalar(projectStateContents, "session_log_file"),
  ];

  const missingReferencedPaths = referencedPaths.filter((relativePath) => !exists(relativePath));
  failIfAny(`Project state points to missing files for ${entry.id}:`, missingReferencedPaths);

  for (const relativePath of [
    extractScalar(projectStateContents, "brief_file"),
    extractScalar(projectStateContents, "open_questions_file"),
    extractScalar(projectStateContents, "session_log_file"),
  ]) {
    const frontmatter = readFrontmatter(relativePath);
    if (!frontmatter) {
      fail(`Project document is missing front matter: ${relativePath}`);
    }

    const missingFrontmatterKeys = requiredProjectDocFrontmatterKeys.filter(
      (key) => !hasFrontmatterKey(frontmatter, key),
    );
    failIfAny(`Project document is missing required front matter keys for ${relativePath}:`, missingFrontmatterKeys);
  }

  validateRetrievalIndex(entry, extractScalar(projectStateContents, "retrieval_index"));
}

function validateRetrievalIndex(entry, retrievalIndexPath) {
  const contents = read(retrievalIndexPath);
  const projectId = extractScalar(contents, "project_id");
  const projectPath = extractScalar(contents, "project_path");

  if (projectId !== entry.id) {
    fail(`Retrieval index id mismatch for ${entry.id}: found ${projectId}`);
  }

  if (projectPath !== entry.path) {
    fail(`Retrieval index path mismatch for ${entry.id}: found ${projectPath}`);
  }

  const fastPath = extractList(contents, "fast_path", 0, 2);
  if (!fastPath || fastPath.length === 0) {
    fail(`Retrieval index fast_path is missing or empty for ${entry.id}`);
  }

  const missingFastPathEntries = fastPath.filter((relativePath) =>
    !pathReferenceExists(resolvePlaceholders(relativePath, entry)),
  );
  failIfAny(`Retrieval index fast_path points to missing files for ${entry.id}:`, missingFastPathEntries);

  const missingTaskRoutes = requiredRetrievalRoutes.filter(
    (routeId) => !new RegExp(`^  ${escapeRegex(routeId)}:\\s*$`, "m").test(contents),
  );
  failIfAny(`Retrieval index is missing required task routes for ${entry.id}:`, missingTaskRoutes);

  const missingWriteTargets = [];
  for (const key of requiredDefaultWriteTargets) {
    const value = extractScalar(contents, key, 2);
    if (!value) {
      missingWriteTargets.push(key);
      continue;
    }

    const resolved = resolvePlaceholders(value, entry);
    if (!pathReferenceExists(resolved)) {
      missingWriteTargets.push(`${key} -> ${value}`);
    }
  }

  failIfAny(`Retrieval index default_write_targets are missing or invalid for ${entry.id}:`, missingWriteTargets);
}

function validateRouter(currentProject) {
  const routerContents = read("brain/router.yaml");
  const currentProjectPointer = extractScalar(routerContents, "current_project", 2);
  const projectIndexPointer = extractScalar(routerContents, "project_index", 2);

  const missingGlobalPointers = [];
  if (!currentProjectPointer) {
    missingGlobalPointers.push("current_project");
  }
  if (!projectIndexPointer) {
    missingGlobalPointers.push("project_index");
  }

  failIfAny("brain/router.yaml is missing required global_files entries:", missingGlobalPointers);

  const missingGlobalPointerTargets = [currentProjectPointer, projectIndexPointer].filter(
    (relativePath) => !exists(relativePath),
  );
  failIfAny("brain/router.yaml points to missing global files:", missingGlobalPointerTargets);

  const intents = parseListBlocks(routerContents, 2);
  const intentIds = intents.map((intent) => intent.id);
  const missingIntentIds = requiredIntentIds.filter((intentId) => !intentIds.includes(intentId));
  failIfAny("brain/router.yaml is missing required intents:", missingIntentIds);

  const invalidIntentBlocks = [];

  for (const intent of intents) {
    const block = intent.__body || "";
    const requiredReads = extractList(block, "required_reads", 4, 6);
    const allowedWrites = extractList(block, "allowed_writes", 4, 6) || [];
    const requiredLogs = extractList(block, "required_logs", 4, 6) || [];

    if (!requiredReads) {
      invalidIntentBlocks.push(`${intent.id} :: required_reads`);
      continue;
    }

    if (!extractKeyDeclaration(block, "allowed_writes", 4)) {
      invalidIntentBlocks.push(`${intent.id} :: allowed_writes`);
    }

    if (!extractKeyDeclaration(block, "required_logs", 4)) {
      invalidIntentBlocks.push(`${intent.id} :: required_logs`);
    }

    const references = [...requiredReads, ...allowedWrites, ...requiredLogs];
    const missingReferences = references.filter((relativePath) => {
      const resolved = resolvePlaceholders(relativePath, currentProject);
      return !pathReferenceExists(resolved);
    });

    failIfAny(`brain/router.yaml points to missing files or directories for intent ${intent.id}:`, missingReferences);
  }

  failIfAny("brain/router.yaml intent blocks are missing required sections:", invalidIntentBlocks);
}

function validateOperationalLanguage(currentProject) {
  for (const { path: relativePath, headings } of operationalHeadingSchemas) {
    validateOrderedStrings(relativePath, headings);
  }

  const invalidOperationalLines = [];
  for (const relativePath of operationalFiles) {
    invalidOperationalLines.push(...findInvalidOperationalLines(relativePath));
  }
  failIfAny("Operational files must use headings plus bullets, numbered steps, code fences, or backticked scalar lines only:", invalidOperationalLines);

  const driftHits = [];
  for (const relativePath of operationalFiles.filter((value) => value !== "brain/ops-language.md")) {
    const body = stripFrontmatter(read(relativePath));
    for (const pattern of operationalDriftPatterns) {
      const match = body.match(pattern);
      if (match) {
        driftHits.push(`${relativePath} :: ${match[0]}`);
      }
    }
  }
  failIfAny("Operational files contain banned drift words:", driftHits);

  validateStructuredEntries(
    "logs/decision-log.md",
    /^## \d{4}-\d{2}-\d{2}$/gm,
    ["### ID", "### Project ID", "### Status", "### Confidence", "### Decision", "### Why", "### Files", "### Next"],
    currentProject.id,
  );

  validateStructuredEntries(
    "logs/route-evolution.md",
    /^## \d{4}-\d{2}-\d{2}$/gm,
    ["### ID", "### Project ID", "### Status", "### Shared base", "### Route A", "### Route B", "### Next"],
    currentProject.id,
  );
}

function validateStructuredEntries(relativePath, entryHeadingPattern, sectionHeadings, projectId) {
  const body = stripFrontmatter(read(relativePath));
  const bodyWithoutTitle = body.replace(/^# .+\n\n/, "");
  const entries = bodyWithoutTitle
    .split(/\n(?=## \d{4}-\d{2}-\d{2}\n)/)
    .filter((entry) => new RegExp(entryHeadingPattern.source, "m").test(entry));

  if (entries.length === 0) {
    fail(`No structured entries found in ${relativePath}`);
  }

  const invalidEntries = [];

  for (const entry of entries) {
    let previousIndex = -1;
    for (const heading of sectionHeadings) {
      const index = entry.indexOf(heading);
      if (index === -1 || index < previousIndex) {
        invalidEntries.push(`${relativePath} :: missing or out-of-order ${heading}`);
        break;
      }
      previousIndex = index;
    }

    if (!new RegExp(`### Project ID\\n\`${escapeRegex(projectId)}\``).test(entry)) {
      invalidEntries.push(`${relativePath} :: project id mismatch in entry`);
    }
  }

  failIfAny(`Structured log entries invalid in ${relativePath}:`, invalidEntries);
}

function validateOrderedStrings(relativePath, orderedStrings) {
  const body = stripFrontmatter(read(relativePath));
  let previousIndex = -1;
  const missing = [];

  for (const value of orderedStrings) {
    const index = body.indexOf(value);
    if (index === -1 || index < previousIndex) {
      missing.push(value);
      continue;
    }
    previousIndex = index;
  }

  failIfAny(`Operational file is missing required headings or heading order in ${relativePath}:`, missing);
}

function findInvalidOperationalLines(relativePath) {
  const lines = stripFrontmatter(read(relativePath)).split("\n");
  const invalid = [];
  let inCodeBlock = false;

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const trimmed = rawLine.trim();

    if (trimmed.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock || trimmed === "") {
      continue;
    }

    if (/^#{1,6}\s/.test(trimmed)) {
      continue;
    }

    if (/^-($|\s)/.test(trimmed)) {
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      continue;
    }

    if (/^`[^`].*`$/.test(trimmed)) {
      continue;
    }

    invalid.push(`${relativePath}:${index + 1} :: ${trimmed}`);
  }

  return invalid;
}

function parseListBlocks(contents, listIndent) {
  const marker = `\n${" ".repeat(listIndent)}- id: `;
  const blocks = contents.split(marker).slice(1);

  return blocks.map((block) => {
    const [firstLine, ...rest] = block.split("\n");
    const body = rest.join("\n");
    const parsed = {
      id: firstLine.trim(),
      __body: body,
    };

    for (const key of ["title", "path", "status", "default"]) {
      const value = extractScalar(body, key, listIndent + 2);
      if (value) {
        parsed[key] = value;
      }
    }

    return parsed;
  });
}

function extractKeyDeclaration(contents, key, indent) {
  const spaces = " ".repeat(indent);
  const pattern = new RegExp(`^${escapeRegex(spaces)}${escapeRegex(key)}:\\s*(?:\\[\\s*\\])?$`, "m");
  return pattern.test(contents);
}

function extractList(contents, key, keyIndent = 0, itemIndent = 2) {
  const lines = contents.split("\n");
  const keyPrefix = `${" ".repeat(keyIndent)}${key}:`;
  let start = -1;
  let inlineValue = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.startsWith(keyPrefix)) {
      continue;
    }

    start = index;
    inlineValue = line.slice(keyPrefix.length).trim();
    break;
  }

  if (start === -1) {
    return null;
  }

  if (inlineValue === "[]") {
    return [];
  }

  if (inlineValue && inlineValue !== "") {
    return [stripQuotes(inlineValue)];
  }

  const itemPrefix = `${" ".repeat(itemIndent)}- `;
  const items = [];

  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];

    if (line.startsWith(itemPrefix)) {
      items.push(stripQuotes(line.slice(itemPrefix.length).trim()));
      continue;
    }

    if (line.trim() === "") {
      continue;
    }

    const indent = leadingSpaces(line);
    if (indent <= keyIndent) {
      break;
    }

    if (indent <= itemIndent && !line.startsWith(itemPrefix)) {
      break;
    }
  }

  return items;
}

function extractScalar(contents, key, indent = 0) {
  const pattern = new RegExp(
    `^${" ".repeat(indent)}${escapeRegex(key)}:\\s*(.+)$`,
    "m",
  );
  const match = contents.match(pattern);
  return match ? stripQuotes(match[1].trim()) : "";
}

function stripQuotes(value) {
  return value.replace(/^['"]|['"]$/g, "");
}

function resolvePlaceholders(relativePath, project) {
  return relativePath
    .replaceAll("{current_project}", project.id)
    .replaceAll("{project_path}", project.path);
}

function readFrontmatter(relativePath) {
  const contents = read(relativePath);
  if (!contents.startsWith("---\n")) {
    return "";
  }

  const end = contents.indexOf("\n---\n", 4);
  if (end === -1) {
    return "";
  }

  return contents.slice(4, end);
}

function stripFrontmatter(contents) {
  if (!contents.startsWith("---\n")) {
    return contents;
  }

  const end = contents.indexOf("\n---\n", 4);
  if (end === -1) {
    return contents;
  }

  return contents.slice(end + 5);
}

function hasFrontmatterKey(frontmatter, key) {
  return new RegExp(`^${escapeRegex(key)}:\\s*(?:.*)?$`, "m").test(frontmatter);
}

function pathReferenceExists(relativePath) {
  if (!relativePath) {
    return false;
  }

  if (relativePath.endsWith("/")) {
    return directoryExists(relativePath);
  }

  return exists(relativePath);
}

function walk(relativeDir) {
  const absoluteDir = path.join(root, relativeDir);
  const entries = fs.readdirSync(absoluteDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (ignoredRoots.has(entry.name)) {
      continue;
    }

    const childRelative = path.join(relativeDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(childRelative));
      continue;
    }

    if (entry.isFile()) {
      files.push(childRelative);
    }
  }

  return files;
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function directoryExists(relativePath) {
  try {
    return fs.statSync(path.join(root, relativePath)).isDirectory();
  } catch {
    return false;
  }
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function leadingSpaces(value) {
  return value.match(/^ */)[0].length;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function failIfAny(label, entries) {
  if (entries.length === 0) {
    return;
  }

  console.error(label);
  for (const entry of entries) {
    console.error(`- ${entry}`);
  }
  process.exit(1);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
