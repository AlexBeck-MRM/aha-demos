#!/usr/bin/env node

const fs = require("node:fs");
const http = require("node:http");
const net = require("node:net");
const path = require("node:path");
const { spawn, execFileSync } = require("node:child_process");

const PORT = 4173;
const HOST = "127.0.0.1";
const PID_FILE = path.join(process.cwd(), ".aha-server.pid");
const LAB_PATH = "/reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/";
const LAB_SCRIPT = path.join(process.cwd(), "reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js");
const CODEBASE_SAVE_ENDPOINT = "/__gradient-lab/save-settings";
const PRESET_VALUE_KEYS = [
  "duration",
  "evolutionSpeed",
  "flameScale",
  "flameRotation",
  "flameX",
  "flameY",
  "flameWidth",
  "flameHeight",
  "flameStrength",
  "redPlumeX",
  "redPlumeY",
  "taperPower",
  "edgeSoftness",
  "warmLight",
  "warmSpread",
  "orangePlumeX",
  "orangePlumeY",
  "orangePlumeHeight",
  "orangePlumeSoftness",
  "deepPressure",
  "turbulence",
  "noiseScale",
  "rise",
  "sway",
  "colorIntensity",
  "shaderContrast",
  "shaderBlur",
  "deepColor",
  "redColor",
  "orangeColor",
];
const AUTHORED_VALUE_KEYS = [
  ...PRESET_VALUE_KEYS,
  "logoShaderScale",
  "logoShaderX",
  "logoShaderY",
  "logoShaderRotation",
  "logoExportScale",
];
const MIME_TYPES = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
]);

function canConnect(port, host, timeoutMs = 250) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host });
    let settled = false;
    const done = (value) => {
      if (settled) {
        return;
      }
      settled = true;
      socket.destroy();
      resolve(value);
    };
    socket.setTimeout(timeoutMs);
    socket.on("connect", () => done(true));
    socket.on("timeout", () => done(false));
    socket.on("error", () => done(false));
  });
}

function readPid() {
  try {
    const raw = fs.readFileSync(PID_FILE, "utf8").trim();
    const pid = Number(raw);
    return Number.isInteger(pid) ? pid : null;
  } catch {
    return null;
  }
}

function isPidAlive(pid) {
  if (!pid) {
    return false;
  }
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function startServer() {
  const logPath = path.join("/tmp", "aha-visualisers.log");
  const out = fs.openSync(logPath, "a");
  const child = spawn(process.execPath, [__filename, "--serve"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      AHA_DEV_SERVER_CHILD: "1",
    },
    detached: true,
    stdio: ["ignore", out, out]
  });
  child.unref();
  fs.writeFileSync(PID_FILE, String(child.pid));
  return child.pid;
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body is too large."));
        request.destroy();
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function sanitizeStateValues(state, keys) {
  const next = {};
  keys.forEach((key) => {
    const value = state?.[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      next[key] = Number(value.toFixed(4));
      return;
    }
    if (typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value)) {
      next[key] = value.toLowerCase();
    }
  });
  return next;
}

function formatObjectLiteral(values, indent = "  ") {
  const lines = Object.entries(values).map(([key, value]) => {
    const formatted = typeof value === "string" ? `"${value}"` : String(value);
    return `${indent}${key}: ${formatted},`;
  });
  return `{\n${lines.join("\n")}\n${indent.slice(0, -2)}}`;
}

function findBalancedBlock(source, openBraceIndex) {
  let depth = 0;
  let inString = null;
  let escaped = false;

  for (let index = openBraceIndex; index < source.length; index += 1) {
    const char = source[index];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === inString) {
        inString = null;
      }
      continue;
    }
    if (char === "\"" || char === "'" || char === "`") {
      inString = char;
      continue;
    }
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return index;
    }
  }

  return -1;
}

function replaceAuthoredDefaults(source, values) {
  const marker = "const authoredDefaultValues = ";
  const start = source.indexOf(marker);
  if (start === -1) throw new Error("Could not find authoredDefaultValues.");
  const open = source.indexOf("{", start);
  const close = findBalancedBlock(source, open);
  if (open === -1 || close === -1) throw new Error("Could not parse authoredDefaultValues.");
  return `${source.slice(0, open)}${formatObjectLiteral(values, "  ")}${source.slice(close + 1)}`;
}

function replacePresetAValues(source, values) {
  const presetStart = source.indexOf('id: "A"');
  if (presetStart === -1) throw new Error("Could not find Preset A.");
  const valuesStart = source.indexOf("values:", presetStart);
  const open = source.indexOf("{", valuesStart);
  const close = findBalancedBlock(source, open);
  if (valuesStart === -1 || open === -1 || close === -1) throw new Error("Could not parse Preset A values.");
  return `${source.slice(0, open)}${formatObjectLiteral(values, "      ")}${source.slice(close + 1)}`;
}

async function saveGradientLabSettings(request, response) {
  try {
    const body = JSON.parse(await readRequestBody(request));
    const state = body?.state;
    const presetValues = sanitizeStateValues(state, PRESET_VALUE_KEYS);
    const authoredValues = sanitizeStateValues(state, AUTHORED_VALUE_KEYS);
    if (Object.keys(presetValues).length !== PRESET_VALUE_KEYS.length || Object.keys(authoredValues).length !== AUTHORED_VALUE_KEYS.length) {
      sendJson(response, 400, { saved: false, message: "State payload is missing required gradient values." });
      return;
    }

    let source = fs.readFileSync(LAB_SCRIPT, "utf8");
    source = replacePresetAValues(source, presetValues);
    source = replaceAuthoredDefaults(source, authoredValues);
    fs.writeFileSync(LAB_SCRIPT, source);
    sendJson(response, 200, { saved: true, message: "Updated Preset A and authored defaults in script.js." });
  } catch (error) {
    sendJson(response, 500, { saved: false, message: error.message });
  }
}

function serveStatic(request, response) {
  const parsedUrl = new URL(request.url, `http://${HOST}:${PORT}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);
  if (pathname === "/") pathname = LAB_PATH;
  let filePath = path.normalize(path.join(process.cwd(), pathname));
  if (!filePath.startsWith(process.cwd())) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }
  if (!fs.existsSync(filePath)) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
  const mimeType = MIME_TYPES.get(path.extname(filePath).toLowerCase()) ?? "application/octet-stream";
  response.writeHead(200, {
    "Content-Type": mimeType,
    "Cache-Control": "no-store",
  });
  fs.createReadStream(filePath).pipe(response);
}

function runServer() {
  const server = http.createServer((request, response) => {
    if (request.method === "POST" && request.url?.startsWith(CODEBASE_SAVE_ENDPOINT)) {
      void saveGradientLabSettings(request, response);
      return;
    }
    if (request.method === "GET" || request.method === "HEAD") {
      serveStatic(request, response);
      return;
    }
    response.writeHead(405);
    response.end("Method not allowed");
  });

  server.listen(PORT, HOST, () => {
    console.log(`AHA dev server listening on http://${HOST}:${PORT}`);
  });
}

function openUrls(urls) {
  const platform = process.platform;
  if (platform === "darwin") {
    const script = [
      'set targetUrls to {"' + urls.join('","') + '"}',
      'tell application "Safari"',
      "activate",
      "repeat with u in targetUrls",
      "open location u",
      "end repeat",
      "end tell"
    ].join("\n");
    try {
      execFileSync("osascript", ["-e", script], { stdio: "ignore" });
      return;
    } catch {
      // Fallback when AppleScript access is unavailable.
    }
    urls.forEach((url) => execFileSync("open", [url]));
    return;
  }
  if (platform === "win32") {
    urls.forEach((url) => execFileSync("cmd", ["/c", "start", "", url]));
    return;
  }
  urls.forEach((url) => execFileSync("xdg-open", [url]));
}

async function main() {
  const noOpen = process.argv.includes("--no-open");
  let running = await canConnect(PORT, HOST);
  if (!running) {
    const existingPid = readPid();
    if (isPidAlive(existingPid)) {
      process.kill(existingPid, "SIGTERM");
    }
    const pid = startServer();
    for (let i = 0; i < 12; i += 1) {
      running = await canConnect(PORT, HOST);
      if (running) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    if (!running) {
      throw new Error(`Server failed to start on ${HOST}:${PORT} (pid ${pid}).`);
    }
    console.log(`Started server on http://${HOST}:${PORT} (pid ${pid})`);
  } else {
    console.log(`Server already running on http://${HOST}:${PORT}`);
  }

  const base = `http://localhost:${PORT}`;
  const urls = [`${base}${LAB_PATH}`];
  if (!noOpen) {
    try {
      openUrls(urls);
      console.log("Opened shader visualiser.");
    } catch {
      console.log("Could not auto-open browser in this environment. Open this URL manually:");
      console.log(urls.join("\n"));
    }
  } else {
    console.log(urls.join("\n"));
  }
}

if (process.argv.includes("--serve") || process.env.AHA_DEV_SERVER_CHILD === "1") {
  runServer();
} else {
main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
}
