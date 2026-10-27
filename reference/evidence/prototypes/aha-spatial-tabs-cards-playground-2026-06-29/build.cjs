const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const directory = __dirname;
const sources = ["gradient-colour.js", "adapter.js"].map((name) => fs.readFileSync(path.join(directory, name), "utf8"));
const source = sources.join("\n");
const checksum = crypto.createHash("sha256").update(source).digest("hex");
const banner = `/* Adaptive image colour. Source SHA256: ${checksum} */
`;
let compiler;
for (const location of [process.env.ESBUILD_MODULE, "esbuild", path.join(directory, "../aha-soft-skeuomorphic-hover-system-2026-07-06/node_modules/esbuild")].filter(Boolean)) {
  try {
    compiler = require(location);
    break;
  } catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") {
      throw error;
    }
  }
}
if (!compiler) {
  throw new Error("Regeneration requires esbuild (development only). Install the existing demo dependencies or set ESBUILD_MODULE.");
}
for (const [filename, minify] of [["adaptive-colour.js", false], ["adaptive-colour.min.js", true]]) {
  // Keep the development delivery identical to the commented source. Only the
  // production delivery is transformed/minified; readers should not debug a
  // compiler's rewritten function names and expressions.
  const code = banner + (minify ? compiler.transformSync(source, {
    loader: "js",
    target: "es2020",
    charset: "utf8",
    legalComments: "none",
    minify
  }).code : source);
  const destination = path.join(directory, filename);
  if (process.argv.includes("--check")) {
    if (fs.readFileSync(destination, "utf8") !== code) {
      throw new Error(`${filename} is stale. Run node ${path.relative(process.cwd(), __filename)}.`);
    }
  } else {
    fs.writeFileSync(destination, code);
  }
}
const coreSource = fs.readFileSync(path.join(directory, "gradient-colour.js"), "utf8");
const coreDelivery = compiler.transformSync(coreSource, { loader: "js", target: "es2020", charset: "utf8", legalComments: "none", minify: true }).code;
const corePath = path.join(directory, "gradient-colour.min.js");
if (process.argv.includes("--check")) {
  if (fs.readFileSync(corePath, "utf8") !== coreDelivery) throw new Error("gradient-colour.min.js is stale.");
} else fs.writeFileSync(corePath, coreDelivery);
console.log(process.argv.includes("--check") ? "Browser delivery matches the maintained sources." : "Generated readable and minified single-file browser deliveries.");
