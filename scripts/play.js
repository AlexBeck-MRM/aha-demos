#!/usr/bin/env node

const fs = require("node:fs");
const net = require("node:net");
const path = require("node:path");
const { spawn, execFileSync } = require("node:child_process");

const PORT = 4173;
const HOST = "127.0.0.1";
const PID_FILE = path.join(process.cwd(), ".aha-server.pid");

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
  const child = spawn("python3", ["-m", "http.server", String(PORT), "--bind", HOST], {
    cwd: process.cwd(),
    detached: true,
    stdio: ["ignore", out, out]
  });
  child.unref();
  fs.writeFileSync(PID_FILE, String(child.pid));
  return child.pid;
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
  const urls = [base, `${base}/css.html`, `${base}/shader.html`];
  if (!noOpen) {
    try {
      openUrls(urls);
      console.log("Opened chooser + both visualisers.");
    } catch {
      console.log("Could not auto-open browser in this environment. Open these URLs manually:");
      console.log(urls.join("\n"));
    }
  } else {
    console.log(urls.join("\n"));
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
