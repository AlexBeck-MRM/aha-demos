#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const PID_FILE = path.join(process.cwd(), ".aha-server.pid");

function readPid() {
  try {
    const raw = fs.readFileSync(PID_FILE, "utf8").trim();
    const pid = Number(raw);
    return Number.isInteger(pid) ? pid : null;
  } catch {
    return null;
  }
}

function isAlive(pid) {
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

const pid = readPid();
if (!pid) {
  console.log("No managed server PID file found.");
  process.exit(0);
}

if (!isAlive(pid)) {
  fs.rmSync(PID_FILE, { force: true });
  console.log(`PID ${pid} is not running. Cleaned stale PID file.`);
  process.exit(0);
}

process.kill(pid, "SIGTERM");
fs.rmSync(PID_FILE, { force: true });
console.log(`Stopped server pid ${pid}.`);
