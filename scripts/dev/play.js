#!/usr/bin/env node

const fs = require("node:fs");
const http = require("node:http");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawn, execFileSync } = require("node:child_process");

const PORT = 4173;
const HOST = "127.0.0.1";
const PID_FILE = path.join(process.cwd(), ".aha-server.pid");
const LAB_PATH = "/reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/";
const LAB_SCRIPT = path.join(process.cwd(), "reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js");
const CODEBASE_SAVE_ENDPOINT = "/__gradient-lab/save-settings";
const HQ_MP4_ENDPOINTS = {
  start: "/__gradient-lab/hq-mp4/start",
  frame: "/__gradient-lab/hq-mp4/frame",
  finish: "/__gradient-lab/hq-mp4/finish",
  cancel: "/__gradient-lab/hq-mp4/cancel",
  download: "/__gradient-lab/hq-mp4/download",
};
const FFMPEG_BIN = "/opt/homebrew/bin/ffmpeg";
const HQ_MP4_ROOT = path.join(process.cwd(), ".artifacts", "tmp", "aha-living-gradient-hq-mp4");
const HQ_MP4_FILENAME = "aha-living-gradient-background-hq.mp4";
const HQ_MP4_MAX_FRAMES = 30 * 160;
const HQ_MP4_MAX_FRAME_BYTES = 20 * 1024 * 1024;
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
  "redExtraSway",
  "colorIntensity",
  "shaderContrast",
  "shaderBlur",
  "surfaceBlurBoost",
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
  "logoExportResolution",
  "minimapSurface",
  "minimapContextScale",
  "figmaExportGrade",
];
const MINIMAP_SURFACES = new Set(["logo", "background", "card", "button"]);
const MIME_TYPES = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".mp4", "video/mp4"],
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

function readBinaryRequestBody(request, maxBytes = HQ_MP4_MAX_FRAME_BYTES) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error("Request body is too large."));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => resolve(Buffer.concat(chunks, size)));
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
      return;
    }
    if (key === "minimapSurface" && MINIMAP_SURFACES.has(value)) {
      next[key] = value;
      return;
    }
    if (typeof value === "boolean") {
      next[key] = value;
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

function isSafeSessionId(sessionId) {
  return typeof sessionId === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(sessionId);
}

function getHqMp4SessionDir(sessionId) {
  if (!isSafeSessionId(sessionId)) {
    throw new Error("Invalid HQ MP4 export session.");
  }
  return path.join(HQ_MP4_ROOT, sessionId);
}

function getHqMp4FramesDir(sessionId) {
  return path.join(getHqMp4SessionDir(sessionId), "frames");
}

function getHqMp4ManifestPath(sessionId) {
  return path.join(getHqMp4SessionDir(sessionId), "manifest.json");
}

function getHqMp4OutputPath(sessionId) {
  return path.join(getHqMp4SessionDir(sessionId), HQ_MP4_FILENAME);
}

function readHqMp4Manifest(sessionId) {
  const manifestPath = getHqMp4ManifestPath(sessionId);
  if (!fs.existsSync(manifestPath)) {
    throw new Error("HQ MP4 export session was not found.");
  }
  return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
}

function writeHqMp4Manifest(sessionId, manifest) {
  fs.writeFileSync(getHqMp4ManifestPath(sessionId), `${JSON.stringify(manifest, null, 2)}\n`);
}

function validateHqMp4Plan(candidate) {
  const width = Number(candidate?.width);
  const height = Number(candidate?.height);
  const fps = Number(candidate?.fps);
  const frames = Number(candidate?.frames);
  const seconds = Number(candidate?.seconds);
  if (width !== 2160 || height !== 1620) {
    throw new Error("HQ MP4 export currently expects a 2160x1620 background frame.");
  }
  if (fps !== 30) {
    throw new Error("HQ MP4 export currently expects 30fps frames.");
  }
  if (!Number.isInteger(frames) || frames <= 0 || frames > HQ_MP4_MAX_FRAMES) {
    throw new Error(`HQ MP4 export frame count must be between 1 and ${HQ_MP4_MAX_FRAMES}.`);
  }
  if (!Number.isFinite(seconds) || seconds <= 0 || seconds > 160) {
    throw new Error("HQ MP4 export duration must be between 0 and 160 seconds.");
  }
  return {
    ...candidate,
    width,
    height,
    fps,
    frames,
    seconds,
  };
}

function hasPngSignature(buffer) {
  return buffer.length > 8
    && buffer[0] === 0x89
    && buffer[1] === 0x50
    && buffer[2] === 0x4e
    && buffer[3] === 0x47
    && buffer[4] === 0x0d
    && buffer[5] === 0x0a
    && buffer[6] === 0x1a
    && buffer[7] === 0x0a;
}

function hqMp4FrameName(frame) {
  return `frame-${String(frame).padStart(5, "0")}.png`;
}

async function startHqMp4Export(request, response) {
  try {
    const body = JSON.parse(await readRequestBody(request));
    const plan = validateHqMp4Plan(body?.plan);
    const sessionId = crypto.randomUUID();
    const sessionDir = getHqMp4SessionDir(sessionId);
    const framesDir = getHqMp4FramesDir(sessionId);
    fs.mkdirSync(framesDir, { recursive: true });
    const manifest = {
      sessionId,
      createdAt: new Date().toISOString(),
      host: os.hostname(),
      status: "receiving-frames",
      plan,
      state: body?.state ?? null,
      config: body?.config ?? null,
      expectedFrames: plan.frames,
      receivedFrames: 0,
      ffmpeg: {
        binary: FFMPEG_BIN,
        codec: "libx264",
        preset: "slow",
        crf: 14,
        pixelFormat: "yuv420p",
        colorPrimaries: "bt709",
        colorTransfer: "bt709",
        colorSpace: "bt709",
        x264Params: "colorprim=bt709:transfer=bt709:colormatrix=bt709",
      },
    };
    writeHqMp4Manifest(sessionId, manifest);
    sendJson(response, 200, {
      sessionId,
      expectedFrames: plan.frames,
      framePattern: path.join(framesDir, "frame-%05d.png"),
      outputPath: getHqMp4OutputPath(sessionId),
    });
  } catch (error) {
    sendJson(response, 400, { started: false, message: error.message });
  }
}

async function uploadHqMp4Frame(request, response) {
  try {
    const parsedUrl = new URL(request.url, `http://${HOST}:${PORT}`);
    const sessionId = parsedUrl.searchParams.get("sessionId");
    const frame = Number(parsedUrl.searchParams.get("frame"));
    const manifest = readHqMp4Manifest(sessionId);
    if (!Number.isInteger(frame) || frame < 0 || frame >= manifest.expectedFrames) {
      sendJson(response, 400, { saved: false, message: "Frame index is outside the expected export range." });
      return;
    }
    const body = await readBinaryRequestBody(request);
    if (!hasPngSignature(body)) {
      sendJson(response, 400, { saved: false, message: "Uploaded frame is not a PNG." });
      return;
    }
    const framePath = path.join(getHqMp4FramesDir(sessionId), hqMp4FrameName(frame));
    fs.writeFileSync(framePath, body);
    manifest.receivedFrames = Math.max(manifest.receivedFrames ?? 0, frame + 1);
    manifest.lastFrameReceivedAt = new Date().toISOString();
    writeHqMp4Manifest(sessionId, manifest);
    sendJson(response, 200, { saved: true, frame, bytes: body.length });
  } catch (error) {
    sendJson(response, 500, { saved: false, message: error.message });
  }
}

function missingHqMp4Frames(sessionId, expectedFrames) {
  const framesDir = getHqMp4FramesDir(sessionId);
  const missing = [];
  for (let frame = 0; frame < expectedFrames; frame += 1) {
    if (!fs.existsSync(path.join(framesDir, hqMp4FrameName(frame)))) {
      missing.push(frame);
      if (missing.length >= 10) break;
    }
  }
  return missing;
}

function runFfmpeg(args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(FFMPEG_BIN, args, { cwd, stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
      if (stderr.length > 80_000) stderr = stderr.slice(-80_000);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stderr });
        return;
      }
      reject(new Error(`FFmpeg exited with code ${code}: ${stderr.slice(-4000)}`));
    });
  });
}

async function finishHqMp4Export(request, response) {
  try {
    const body = JSON.parse(await readRequestBody(request));
    const sessionId = body?.sessionId;
    const manifest = readHqMp4Manifest(sessionId);
    if (!fs.existsSync(FFMPEG_BIN)) {
      sendJson(response, 500, { encoded: false, message: `FFmpeg was not found at ${FFMPEG_BIN}.` });
      return;
    }
    const missing = missingHqMp4Frames(sessionId, manifest.expectedFrames);
    if (missing.length > 0) {
      sendJson(response, 400, { encoded: false, message: `Missing frame(s): ${missing.join(", ")}.` });
      return;
    }

    const framesDir = getHqMp4FramesDir(sessionId);
    const outputPath = getHqMp4OutputPath(sessionId);
    const ffmpegArgs = [
      "-y",
      "-framerate", String(manifest.plan.fps),
      "-i", "frame-%05d.png",
      "-c:v", "libx264",
      "-preset", "slow",
      "-crf", "14",
      "-pix_fmt", "yuv420p",
      "-x264-params", "colorprim=bt709:transfer=bt709:colormatrix=bt709",
      "-color_primaries", "bt709",
      "-color_trc", "bt709",
      "-colorspace", "bt709",
      "-movflags", "+faststart",
      outputPath,
    ];
    manifest.status = "encoding";
    manifest.ffmpeg.command = [FFMPEG_BIN, ...ffmpegArgs];
    manifest.encodingStartedAt = new Date().toISOString();
    writeHqMp4Manifest(sessionId, manifest);

    await runFfmpeg(ffmpegArgs, framesDir);
    const stat = fs.statSync(outputPath);
    manifest.status = "encoded";
    manifest.outputPath = outputPath;
    manifest.outputBytes = stat.size;
    manifest.encodedAt = new Date().toISOString();
    writeHqMp4Manifest(sessionId, manifest);
    sendJson(response, 200, {
      encoded: true,
      sessionId,
      filename: HQ_MP4_FILENAME,
      bytes: stat.size,
      outputPath,
      downloadUrl: `${HQ_MP4_ENDPOINTS.download}?sessionId=${encodeURIComponent(sessionId)}`,
      ffmpegCommand: manifest.ffmpeg.command,
    });
  } catch (error) {
    sendJson(response, 500, { encoded: false, message: error.message });
  }
}

async function cancelHqMp4Export(request, response) {
  try {
    const body = JSON.parse(await readRequestBody(request));
    const sessionId = body?.sessionId;
    fs.rmSync(getHqMp4SessionDir(sessionId), { recursive: true, force: true });
    sendJson(response, 200, { cancelled: true });
  } catch (error) {
    sendJson(response, 500, { cancelled: false, message: error.message });
  }
}

function downloadHqMp4Export(request, response) {
  try {
    const parsedUrl = new URL(request.url, `http://${HOST}:${PORT}`);
    const sessionId = parsedUrl.searchParams.get("sessionId");
    const outputPath = getHqMp4OutputPath(sessionId);
    if (!fs.existsSync(outputPath)) {
      response.writeHead(404);
      response.end("Encoded MP4 was not found.");
      return;
    }
    const stat = fs.statSync(outputPath);
    response.writeHead(200, {
      "Content-Type": "video/mp4",
      "Content-Length": stat.size,
      "Content-Disposition": `attachment; filename="${HQ_MP4_FILENAME}"`,
      "Cache-Control": "no-store",
    });
    if (request.method === "HEAD") {
      response.end();
      return;
    }
    fs.createReadStream(outputPath).pipe(response);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(error.message);
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
    if (request.method === "POST" && request.url?.startsWith(HQ_MP4_ENDPOINTS.start)) {
      void startHqMp4Export(request, response);
      return;
    }
    if (request.method === "POST" && request.url?.startsWith(HQ_MP4_ENDPOINTS.frame)) {
      void uploadHqMp4Frame(request, response);
      return;
    }
    if (request.method === "POST" && request.url?.startsWith(HQ_MP4_ENDPOINTS.finish)) {
      void finishHqMp4Export(request, response);
      return;
    }
    if (request.method === "POST" && request.url?.startsWith(HQ_MP4_ENDPOINTS.cancel)) {
      void cancelHqMp4Export(request, response);
      return;
    }
    if ((request.method === "GET" || request.method === "HEAD") && request.url?.startsWith(HQ_MP4_ENDPOINTS.download)) {
      downloadHqMp4Export(request, response);
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
