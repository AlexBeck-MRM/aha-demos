#!/usr/bin/env node

import { execSync } from "child_process";

const EXPECTED_ACCOUNT = "alexander.beck@mrm.com";

const STATUS = {
  ok: "🟢",
  warning: "🟡",
  blocked: "🔴",
};

function parseArgs(argv) {
  const args = {
    url: null,
    json: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--url") args.url = argv[++i];
    else if (arg === "--json") args.json = true;
    else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  if (args.url) {
    const parsed = parseFigmaUrl(args.url);
    args.fileKey = parsed.fileKey;
    args.nodeId = parsed.nodeId;
  }

  return args;
}

function printHelp() {
  console.log(`Usage:
  node scripts/dev/figma-check.mjs [--url <figma-url>] [--json]

Examples:
  node scripts/dev/figma-check.mjs
  node scripts/dev/figma-check.mjs --url "https://www.figma.com/design/3qEMU5hYtAJ3S7vWGijJhQ/AHA---Design-Workbench?node-id=2138-29678"
  npm run figma:check -- --url "https://www.figma.com/design/3qEMU5hYtAJ3S7vWGijJhQ/AHA---Design-Workbench?node-id=2138-29678"

What it checks:
  1. Whether the native remote Figma MCP server is configured in Codex
  2. Whether the native connector is currently logged in
  3. Which account this repo expects for Figma work
  4. Which direct commands to use for rebinding
  5. Which live in-app checks to run next for whoami/read/write verification
`);
}

function parseFigmaUrl(raw) {
  const url = new URL(raw);
  const parts = url.pathname.split("/").filter(Boolean);
  let fileKey = null;
  if (parts[0] === "design" || parts[0] === "board") {
    fileKey = parts[1] || null;
  }
  const nodeId = (url.searchParams.get("node-id") || "").replace(/-/g, ":") || null;
  return { fileKey, nodeId };
}

function run(cmd) {
  return execSync(cmd, { stdio: ["ignore", "pipe", "pipe"] }).toString();
}

function printLine(label, status, detail) {
  console.log(`- ${STATUS[status]} ${label}: ${detail}`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const listOutput = run("codex mcp list");
  const remoteLine = listOutput
    .split("\n")
    .find((line) => line.trim().startsWith("figma "));

  const configured = Boolean(remoteLine);
  const loggedIn = configured && !remoteLine.includes("Not logged in");

  const report = {
    checkedAt: new Date().toISOString(),
    target: {
      url: args.url,
      fileKey: args.fileKey || null,
      nodeId: args.nodeId || null,
    },
    configured,
    loggedIn,
    remoteLine: remoteLine ? remoteLine.replace(/\s+/g, " ").trim() : null,
    blocker: configured ? (loggedIn ? "none" : "native_figma_not_logged_in") : "native_figma_not_configured",
    guidance: [],
    expectedAccount: EXPECTED_ACCOUNT,
  };

  if (!configured) {
    report.guidance.push("Add the native Figma MCP server to Codex config at `https://mcp.figma.com/mcp`.");
  } else if (!loggedIn) {
    report.guidance.push(`Open the browser profile signed into \`${EXPECTED_ACCOUNT}\`, then run \`codex mcp login figma\` directly.`);
  } else {
    report.guidance.push(`Native Figma MCP is logged in. Verify inside Codex that \`whoami\` returns \`${EXPECTED_ACCOUNT}\` before real work.`);
  }

  report.guidance.push("For intentional account switching, always run `codex mcp logout figma` before `codex mcp login figma`.");
  report.guidance.push("Do not use private windows or wrapper scripts for Figma auth.");
  report.guidance.push(`This repo is work-only for Figma. Treat any account other than \`${EXPECTED_ACCOUNT}\` as not ready.`);
  report.guidance.push("After login, verify inside Codex with: `whoami`, then `get_metadata` or `get_design_context`, then a reversible `use_figma` write test.");

  if (args.json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log("Figma diagnostic");
  console.log("");
  console.log("Environment");
  printLine("Native remote MCP", configured ? "ok" : "blocked", configured ? "configured in Codex" : "missing from Codex MCP config");
  printLine("Native remote auth", loggedIn ? "ok" : "warning", configured ? (loggedIn ? "logged in" : "not logged in") : "unavailable");
  printLine("Expected Figma account", "ok", EXPECTED_ACCOUNT);

  console.log("");
  console.log("Target");
  if (args.fileKey) console.log(`- File key: ${args.fileKey}`);
  if (args.nodeId) console.log(`- Node id: ${args.nodeId}`);
  if (!args.fileKey && !args.nodeId) console.log("- No target specified");

  console.log("");
  console.log("Commands");
  console.log("- `codex mcp logout figma`");
  console.log("- `codex mcp login figma`");
  console.log("- `codex mcp list`");

  console.log("");
  console.log("Next steps");
  for (const step of report.guidance) {
    console.log(`- ${step}`);
  }
}

main();
