import fs from "fs";
import path from "path";

const root = process.cwd();
const args = parseArgs(process.argv.slice(2));

if (args.help || args.h) {
  printUsage();
  process.exit(0);
}

const title = args.title;
const projectId = args.id || (title ? slugify(title) : "");

if (!title || !projectId) {
  printUsage();
  process.exit(1);
}

const status = args.status || "active";
const date = args.date || new Date().toISOString().slice(0, 10);
const setCurrent = Boolean(args["set-current"] || args.setCurrent);
const projectPath = path.join("projects", projectId);
const projectDir = path.join(root, projectPath);

if (fs.existsSync(projectDir)) {
  console.error(`Project already exists: ${projectPath}`);
  process.exit(1);
}

fs.mkdirSync(projectDir, { recursive: true });

const replacements = {
  project_id: projectId,
  project_title: title,
  project_path: projectPath.replace(/\\/g, "/"),
  status,
  date,
};

writeTemplate("templates/project-state.yaml", path.join(projectPath, "project.yaml"), replacements);
writeTemplate("templates/project-brief.md", path.join(projectPath, "brief.md"), replacements);
writeTemplate("templates/project-open-questions.md", path.join(projectPath, "open-questions.md"), replacements);
writeTemplate("templates/project-session-log.md", path.join(projectPath, "session-log.md"), replacements);
writeTemplate("templates/project-retrieval-index.yaml", path.join(projectPath, "retrieval-index.yaml"), replacements);

updateProjectIndex({
  id: projectId,
  title,
  path: projectPath.replace(/\\/g, "/"),
  status,
  makeDefault: setCurrent,
});

if (setCurrent) {
  const currentProject = [
    `project_id: ${projectId}`,
    `project_path: ${projectPath.replace(/\\/g, "/")}`,
    `updated: ${date}`,
    `reason: Activated during project bootstrap.`,
    "",
  ].join("\n");

  fs.writeFileSync(path.join(root, "projects/current-project.yaml"), currentProject);
}

console.log(`Created project: ${projectPath}`);
if (setCurrent) {
  console.log("Marked as current project.");
}
console.log("Next step: run `npm test` to verify the new project wiring.");

function parseArgs(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const next = argv[index + 1];

    if (!next || next.startsWith("--")) {
      parsed[key] = true;
      continue;
    }

    parsed[key] = next;
    index += 1;
  }

  return parsed;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function renderTemplate(contents, replacements) {
  let rendered = contents;

  for (const [key, value] of Object.entries(replacements)) {
    rendered = rendered.replaceAll(`{{${key}}}`, value);
  }

  return rendered;
}

function writeTemplate(sourcePath, targetPath, replacements) {
  const source = fs.readFileSync(path.join(root, sourcePath), "utf8");
  const target = path.join(root, targetPath);
  fs.writeFileSync(target, renderTemplate(source, replacements));
}

function updateProjectIndex(entry) {
  const indexPath = path.join(root, "projects/index.yaml");
  let contents = fs.readFileSync(indexPath, "utf8");

  if (new RegExp(`^\\s*- id:\\s*${escapeRegex(entry.id)}$`, "m").test(contents)) {
    console.error(`Project is already registered in projects/index.yaml: ${entry.id}`);
    process.exit(1);
  }

  if (entry.makeDefault) {
    contents = contents.replace(/^(\s*default:\s*)true$/gm, "$1false");
  }

  if (!contents.endsWith("\n")) {
    contents += "\n";
  }

  contents += [
    `  - id: ${entry.id}`,
    `    title: ${entry.title}`,
    `    path: ${entry.path}`,
    `    status: ${entry.status}`,
    `    default: ${entry.makeDefault ? "true" : "false"}`,
    "",
  ].join("\n");

  fs.writeFileSync(indexPath, contents);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function printUsage() {
  console.log("Usage: node scripts/docs/init-project.mjs --title \"Project Title\" [--id project-slug] [--status active] [--set-current]");
}
