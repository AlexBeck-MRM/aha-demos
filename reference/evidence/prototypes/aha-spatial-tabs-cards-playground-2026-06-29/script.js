// Gallery controls and fixtures. The calculation lives in gradient-colour.js;
// adapter.js measures and updates each example. settings.js validates saved values.
const settings = AdaptiveColourSettings;
const examplesRoot = document.querySelector("[data-image-row]");
const controlsRoot = document.querySelector("[data-control-root]");
const configOutput = document.querySelector("[data-config-output]");
const copyStatus = document.querySelector("[data-copy-status]");
const samplingStatus = document.querySelector("[data-sampling-status]");
const controllers = new Map();
const results = new Map();
let state = { ...settings.defaults };
let overrides = {};
let authored;

const aspectRatios = {
  A: { horizontal: 2, vertical: 320 / 471 },
  B: { horizontal: 1600 / 618, vertical: 16 / 9 },
};
const sourceLabels = { automatic: "Auto", override: "Override", fallback: "Fallback" };
const edgeLabels = { bottom: "Bottom", right: "Right", left: "Left" };
const fallbackMessages = {
  contrast: "Test fallback: the photo fade could not meet this target.",
  margin: "Test fallback: the overlay misses the numerical safety margin.",
  space: "Test fallback: text moved below to fit the sample copy.",
};
const coverageControls = ["A", "B"].flatMap((family) => {
  return ["Vertical", "Horizontal"].map((axis) => ({
    key: `overlay${family}${axis}Coverage`,
    family,
    label: axis === "Vertical" ? "Vertical height" : "Horizontal width",
  }));
});

function toHex(rgb) {
  return `#${rgb.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function fromHex(value) {
  return [1, 3, 5].map((start) => parseInt(value.slice(start, start + 2), 16));
}

// These templates contain trusted bundled fixtures. Escape CMS content or use text
// nodes in a product integration; do not insert raw author input into these strings.
function exampleMarkup(card) {
  const classes = ["image-example"];
  if (card.family === "B") classes.push("image-example-background");
  if (card.compact) classes.push("image-example-compact");
  if (card.stacked) classes.push("image-example-mobile");

  return `
    <figure class="${classes.join(" ")}" data-example="${card.id}">
      <div class="image-view-label">${card.label}</div>
      <div class="image-surface is-pending" data-image-id="${card.id}"
           style="--photo-position:${card.photoPosition || "50% 50%"};--image-tone:#000;--image-tone-rgb:0 0 0">
        <img class="image-photo" src="${card.sampleSrc}" alt="">
        <div class="image-gradient" aria-hidden="true"></div>
        <div class="image-content">
          <div class="image-copy">
            <h3 class="image-title">${card.title}</h3>
            <p class="image-body">${card.body}</p>
          </div>
        </div>
      </div>
      <figcaption class="image-analysis">
        <span class="tone-swatch" data-swatch aria-hidden="true"></span>
        <span>
          <strong data-colour>Loading image…</strong>
          <small data-sample></small>
          <small data-contrast-readout></small>
          <small data-reason></small>
        </span>
      </figcaption>
    </figure>`;
}

function groupMarkup([family, title]) {
  const examples = cards.filter((card) => (card.group || card.family) === family);
  return `
    <section class="image-example-group" aria-labelledby="family-${family}">
      <h2 class="image-group-title" id="family-${family}">${title}</h2>
      <div class="image-examples">${examples.map(exampleMarkup).join("")}</div>
    </section>`;
}

function renderExamples() {
  examplesRoot.innerHTML = Object.entries(imageGroupTitles).map(groupMarkup).join("");
  for (const card of cards) {
    const surface = examplesRoot.querySelector(`[data-image-id="${card.id}"]`);
    const controller = attachAdaptiveColour(surface, {
      fallback: card.fallbackTone,
      ...optionsFor(card),
      onResult: (result) => showResult(card, surface, result),
    });
    controllers.set(card.id, controller);
  }
}

// The gallery chooses the layout. The calculation receives that choice.
function optionsFor(card) {
  const surface = examplesRoot.querySelector(`[data-image-id="${card.id}"]`);
  const width = surface?.getBoundingClientRect().width || 320;
  const narrowBackground = card.family === "B" && width < 720;
  const narrowHorizontalCard = card.family === "A" && card.horizontal && width < 520;
  const stacked = Boolean(card.stacked || narrowBackground || narrowHorizontalCard);
  const orientation = card.horizontal ? "horizontal" : "vertical";
  const coverageAxis = card.horizontal && !stacked ? "Horizontal" : "Vertical";
  const override = overrides[card.id];

  return {
    targetContrast: state.targetContrast,
    override: override ? fromHex(override) : null,
    direction: card.horizontal || null,
    stacked,
    aspect: aspectRatios[card.family][orientation],
    stackedCoverage: state[`overlay${card.family}VerticalCoverage`] / 100,
    coverage: state[`overlay${card.family}${coverageAxis}Coverage`] / 100,
    opacity: settings.photoPeaks[card.family],
  };
}

function contrastLevel(contrast) {
  if (contrast >= 7) return "AAA";
  if (contrast >= 4.5) return "AA";
  return "Below AA";
}

function updateSamplingStatus() {
  const failedCount = [...results.values()].filter((result) => result.error).length;
  let message = ". Loading remaining images…";
  if (failedCount) {
    message = ` · ${failedCount} need review. Checked solid fallbacks are used for image-access failures.`;
  } else if (results.size === cards.length) {
    message = ". All text meets the selected target.";
  }
  samplingStatus.textContent = `${results.size - failedCount}/${cards.length} images sampled${message}`;
}

// Readouts describe the current layout, not whole-component WCAG certification.
function showResult(card, surface, result) {
  results.set(card.id, result);
  const figure = surface.closest("figure");
  const colour = toHex(result.rgb);
  const sample = toHex(result.sample).toUpperCase();
  figure.querySelector("[data-swatch]").style.setProperty("--swatch", colour);
  figure.querySelector("[data-colour]").textContent = `${sourceLabels[result.source]} ${colour.toUpperCase()}`;

  let sampleMessage = `${edgeLabels[surface.dataset.sampleEdge]} 50% · Sample ${sample}`;
  if (result.error) {
    sampleMessage = `Image pixels unavailable · Authored fallback ${sample}`;
  }
  figure.querySelector("[data-sample]").textContent = sampleMessage;

  // Round down only for display. The pass/fail calculation uses the full ratio.
  const measured = (Math.floor(result.contrast * 100) / 100).toFixed(2);
  const treatment = result.stacked ? "Solid text panel" : "Photo + fade";
  let contrastMessage = `${contrastLevel(result.contrast)} · Measured ≥ ${measured}:1`
    + ` · Target ${state.targetContrast.toFixed(1)}:1 · ${treatment}`;
  if (result.verified === false) {
    contrastMessage = "Unverified rendering · Review unsupported text or image effects";
  }
  figure.querySelector("[data-contrast-readout]").textContent = contrastMessage;

  const reason = figure.querySelector("[data-reason]");
  reason.textContent = result.error || fallbackMessages[result.reason] || "";
  reason.hidden = !reason.textContent;
  updateSamplingStatus();
}

function coverageControlMarkup({ key, label }) {
  const [minimum, maximum] = settings.ranges[key];
  return `
    <label class="parameterizer-row" for="${key}">
      <span class="parameterizer-label">${label}</span>
      <input class="parameterizer-range" type="range" id="${key}"
             min="${minimum}" max="${maximum}" step="1"
             value="${state[key]}" data-control="${key}">
      <output class="parameterizer-value" data-output="${key}">${state[key]}%</output>
    </label>`;
}

function coverageGroupMarkup(family) {
  const controls = coverageControls.filter((control) => control.family === family);
  return `
    <details class="parameterizer-folder image-type-controls" open>
      <summary class="parameterizer-folder-title">
        ${imageGroupTitles[family]} <span>${settings.photoPeaks[family] * 100}%</span>
      </summary>
      <div class="parameterizer-folder-body">${controls.map(coverageControlMarkup).join("")}</div>
    </details>`;
}

function renderControls() {
  controlsRoot.innerHTML = `
    <section class="contrast-controls" aria-label="Text contrast">
      <label class="contrast-heading" for="targetContrast">
        Contrast target <output data-target-output>${state.targetContrast.toFixed(1)}:1</output>
      </label>
      <input id="targetContrast" type="range" min="4.5" max="7.1" step="0.1"
             value="${state.targetContrast}" data-control="targetContrast" aria-describedby="contrast-help">
      <div class="contrast-scale"><span>4.5:1 · AA</span><span>7:1 · AAA</span></div>
      <div class="contrast-presets">
        <button type="button" class="parameterizer-button" data-target="4.5">AA · 4.5:1</button>
        <button type="button" class="parameterizer-button" data-target="7">AAA · 7:1</button>
      </div>
      <p id="contrast-help">Updates every example live. Finds the lightest passing shade towards black. A 0.02 numerical margin and one 8-bit pixel step allow for tested browser paint differences.</p>
    </section>
    ${["A", "B"].map(coverageGroupMarkup).join("")}`;
  bindContrastControls();
  bindOverrideControls();
}

function bindContrastControls() {
  controlsRoot.addEventListener("submit", (event) => event.preventDefault());
  controlsRoot.addEventListener("input", (event) => {
    const key = event.target.dataset.control;
    if (!key) return;
    state = settings.normalizeState({ ...state, [key]: Number(event.target.value) });
    apply();
  });
  controlsRoot.addEventListener("click", (event) => {
    const button = event.target.closest("[data-target]");
    if (button) {
      state.targetContrast = Number(button.dataset.target);
      apply();
    }
  });
}

function bindOverrideControls() {
  const select = document.querySelector("[data-override-example]");
  const enabled = document.querySelector("[data-override-enabled]");
  const colourInput = document.querySelector("[data-override-colour]");
  select.innerHTML = cards.map((card) => `<option value="${card.id}">${card.label}</option>`).join("");
  select.addEventListener("change", syncOverride);
  enabled.addEventListener("change", () => {
    if (enabled.checked) {
      overrides[select.value] = colourInput.value;
    } else {
      delete overrides[select.value];
    }
    colourInput.disabled = !enabled.checked;
    apply();
  });
  colourInput.addEventListener("input", () => {
    overrides[select.value] = colourInput.value;
    apply();
  });
}

function syncOverride() {
  const id = document.querySelector("[data-override-example]").value;
  const colourInput = document.querySelector("[data-override-colour]");
  const override = overrides[id];
  document.querySelector("[data-override-enabled]").checked = Boolean(override);
  colourInput.disabled = !override;
  const sample = results.get(id)?.sample;
  colourInput.value = override || (sample ? toHex(sample) : "#86715c");
}

function payload() {
  return {
    schema: settings.schema,
    surface: "AHA Adaptive Image Colour Lab",
    state: settings.normalizeState(state),
    overrides: settings.normalizeOverrides(overrides),
  };
}

// Update existing controllers so target-only changes retain prepared pixels.
function apply() {
  for (const input of controlsRoot.querySelectorAll("[data-control]")) {
    input.value = state[input.dataset.control];
    const readout = controlsRoot.querySelector(`[data-output="${input.dataset.control}"]`);
    if (readout) readout.textContent = `${input.value}%`;
  }
  const target = state.targetContrast.toFixed(1);
  const level = contrastLevel(state.targetContrast);
  document.querySelector("[data-target-output]").textContent = `${target}:1`;
  document.querySelector("#targetContrast").setAttribute("aria-valuetext", `${target} to 1, ${level} text contrast target`);
  document.querySelector("[data-target-label]").textContent = `${level} · ${target}:1`;
  for (const button of controlsRoot.querySelectorAll("[data-target]")) {
    button.setAttribute("aria-pressed", String(Number(button.dataset.target) === state.targetContrast));
  }
  for (const card of cards) {
    controllers.get(card.id)?.update(optionsFor(card));
  }
  configOutput.value = JSON.stringify(payload(), null, 2);
  copyStatus.textContent = "";
}

function revealExport(value) {
  configOutput.value = value;
  configOutput.closest("details").open = true;
  configOutput.focus();
  configOutput.select();
}

async function copy(value, message) {
  try {
    await navigator.clipboard.writeText(value);
    copyStatus.textContent = message;
  } catch {
    revealExport(value);
    copyStatus.textContent = "Copy unavailable. Select and copy the output.";
  }
}

function copyCSS() {
  const rules = cards.map((card) => {
    const surface = examplesRoot.querySelector(`[data-image-id="${card.id}"]`);
    return `[data-image-id="${card.id}"] { ${surface.style.cssText} }`;
  });
  const warning = "/* Current dimensions only. Use adaptive-colour.min.js for responsive contrast checks. */";
  void copy([warning, ...rules].join("\n"), "CSS snapshot copied.");
}

function resetConfiguration() {
  state = { ...authored.state };
  overrides = { ...authored.overrides };
  apply();
  syncOverride();
  copyStatus.textContent = "Authored settings restored.";
}

async function saveConfiguration(event) {
  const button = event.currentTarget;
  const saved = payload();
  button.disabled = true;
  try {
    const response = await fetch("/__adaptive-card-lab/save-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(saved),
    });
    if (!response.ok || !(await response.json()).saved) {
      throw new Error("Local save unavailable.");
    }
    authored = saved;
    copyStatus.textContent = "Saved to config.json.";
  } catch {
    revealExport(JSON.stringify(saved, null, 2));
    copyStatus.textContent = "Static preview: copy the configuration to save it. The local runner supports Save.";
  } finally {
    button.disabled = false;
  }
}

function bindActions() {
  document.querySelector("[data-copy-config]").addEventListener("click", () => {
    void copy(JSON.stringify(payload(), null, 2), "Configuration copied.");
  });
  document.querySelector("[data-copy-css]").addEventListener("click", copyCSS);
  document.querySelector("[data-reset-config]").addEventListener("click", resetConfiguration);
  document.querySelector("[data-save-config]").addEventListener("click", saveConfiguration);

  const recheck = document.createElement("button");
  recheck.type = "button";
  recheck.className = "parameterizer-button recheck";
  recheck.textContent = "Recheck images";
  recheck.addEventListener("click", () => {
    for (const controller of controllers.values()) {
      controller.refresh({ retry: true });
    }
  });
  samplingStatus.before(recheck);

  const resizeObserver = new ResizeObserver(() => {
    for (const card of cards) {
      controllers.get(card.id)?.update(optionsFor(card));
    }
  });
  resizeObserver.observe(examplesRoot);
}

async function loadConfiguration() {
  const notice = document.querySelector("[data-migration-status]");
  try {
    const response = await fetch("config.json?v=aa-rebuild-v1", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const config = settings.migrateConfig(await response.json());
    state = config.state;
    overrides = config.overrides;
    notice.textContent = config.notes.join(" ");
    notice.hidden = !config.notes.length;
  } catch (failure) {
    notice.textContent = `Configuration unavailable (${failure.message}). Using AA defaults.`;
    notice.hidden = false;
  }
}

async function init() {
  await loadConfiguration();
  authored = payload();
  renderExamples();
  renderControls();
  bindActions();
  apply();
  syncOverride();
}

void init();
