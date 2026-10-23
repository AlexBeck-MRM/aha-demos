const colourEngine = {
  hex: (rgb) => `#${rgb.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`,
  fromHex: (value) => [1, 3, 5].map((start) => parseInt(value.slice(start, start + 2), 16)),
};
const settings = AdaptiveColourSettings;
const root = document.querySelector("[data-image-row]");
const controlsRoot = document.querySelector("[data-control-root]");
const output = document.querySelector("[data-config-output]");
const status = document.querySelector("[data-copy-status]");
const samplingStatus = document.querySelector("[data-sampling-status]");
const controllers = /* @__PURE__ */ new Map(), results = /* @__PURE__ */ new Map();
let state = { ...settings.defaults }, overrides = {}, authored;
const coverageControls = ["A", "B"].flatMap((family) => ["Vertical", "Horizontal"].map((axis) => ({
  key: `overlay${family}${axis}Coverage`,
  family,
  label: axis === "Vertical" ? "Vertical height" : "Horizontal width"
})));
function renderExamples() {
  root.innerHTML = Object.entries(imageGroupTitles).map(([family, title]) => `
    <section class="image-example-group" aria-labelledby="family-${family}">
      <h2 class="image-group-title" id="family-${family}">${title}</h2><div class="image-examples">
      ${cards.filter((card) => (card.group || card.family) === family).map((card) => `
        <figure class="image-example ${card.family === "B" ? "image-example-background" : ""} ${card.compact ? "image-example-compact" : ""} ${card.stacked ? "image-example-mobile" : ""}" data-example="${card.id}">
          <div class="image-view-label">${card.label}</div>
          <div class="image-surface is-pending" data-image-id="${card.id}" style="--photo-position:${card.photoPosition || "50% 50%"};--image-tone:#000;--image-tone-rgb:0 0 0">
            <img class="image-photo" src="${card.sampleSrc}" alt="">
            <div class="image-gradient" aria-hidden="true"></div>
            <div class="image-content"><div class="image-copy"><h3 class="image-title">${card.title}</h3><p class="image-body">${card.body}</p></div></div>
          </div>
          <figcaption class="image-analysis"><span class="tone-swatch" data-swatch aria-hidden="true"></span><span>
            <strong data-colour>Loading image…</strong><small data-sample></small><small data-contrast-readout></small><small data-reason></small>
          </span></figcaption>
        </figure>`).join("")}
      </div>
    </section>`).join("");
  for (const card of cards) {
    const surface = root.querySelector(`[data-image-id="${card.id}"]`);
    controllers.set(card.id, attachAdaptiveColour(surface, {
      fallback: card.fallbackTone,
      ...optionsFor(card),
      onResult: (result) => showResult(card, surface, result)
    }));
  }
}
function optionsFor(card) {
  const width = root.querySelector(`[data-image-id="${card.id}"]`)?.getBoundingClientRect().width || 320;
  const stacked = Boolean(card.stacked || card.family === "B" && width < 720 || card.family === "A" && card.horizontal && width < 520);
  return {
    targetContrast: state.targetContrast,
    override: overrides[card.id] ? colourEngine.fromHex(overrides[card.id]) : null,
    direction: card.horizontal || null,
    stacked,
    aspect: card.horizontal ? card.family === "A" ? 2 : 1600 / 618 : card.family === "A" ? 320 / 471 : 16 / 9,
    stackedCoverage: state[`overlay${card.family}VerticalCoverage`] / 100,
    coverage: state[`overlay${card.family}${card.horizontal && !stacked ? "Horizontal" : "Vertical"}Coverage`] / 100,
    opacity: settings.photoPeaks[card.family]
  };
}
function showResult(card, surface, result) {
  results.set(card.id, result);
  const figure = surface.closest("figure");
  figure.querySelector("[data-swatch]").style.setProperty("--swatch", colourEngine.hex(result.rgb));
  figure.querySelector("[data-colour]").textContent = `${result.source === "automatic" ? "Auto" : result.source === "override" ? "Override" : "Fallback"} ${colourEngine.hex(result.rgb).toUpperCase()}`;
  figure.querySelector("[data-sample]").textContent = result.error ? `Image pixels unavailable · Authored fallback ${colourEngine.hex(result.sample).toUpperCase()}` : `${surface.dataset.sampleEdge === "bottom" ? "Bottom" : surface.dataset.sampleEdge === "right" ? "Right" : "Left"} 50% · Sample ${colourEngine.hex(result.sample).toUpperCase()}`;
  const measured = Math.floor(result.contrast * 100) / 100;
  const level = result.contrast >= 7 ? "AAA" : result.contrast >= 4.5 ? "AA" : "Below AA";
  figure.querySelector("[data-contrast-readout]").textContent = result.verified === false ? "Unverified rendering · Review unsupported text or image effects" : `${level} · Measured ≥ ${measured.toFixed(2)}:1 · Target ${state.targetContrast.toFixed(1)}:1${result.stacked ? " · Solid text panel" : " · Photo + fade"}`;
  const reason = figure.querySelector("[data-reason]");
  reason.textContent = result.error || (result.reason === "contrast" ? "Test fallback: the photo fade could not meet this target." : result.reason === "margin" ? "Test fallback: the overlay misses the numerical safety margin." : result.reason === "space" ? "Test fallback: text moved below to fit the sample copy." : "");
  reason.hidden = !reason.textContent;
  const failed = [...results.values()].filter((value) => value.error).length;
  samplingStatus.textContent = `${results.size - failed}/${cards.length} images sampled${failed ? ` · ${failed} need review. Checked solid fallbacks are used for image-access failures.` : results.size === cards.length ? ". All text meets the selected target." : ". Loading remaining images…"}`;
}
function renderControls() {
  controlsRoot.innerHTML = `
    <section class="contrast-controls" aria-label="Text contrast">
      <label class="contrast-heading" for="targetContrast">Contrast target <output data-target-output>${state.targetContrast.toFixed(1)}:1</output></label>
      <input id="targetContrast" type="range" min="4.5" max="7.1" step="0.1" value="${state.targetContrast}" data-control="targetContrast" aria-describedby="contrast-help">
      <div class="contrast-scale"><span>4.5:1 · AA</span><span>7:1 · AAA</span></div>
      <div class="contrast-presets"><button type="button" class="parameterizer-button" data-target="4.5">AA · 4.5:1</button><button type="button" class="parameterizer-button" data-target="7">AAA · 7:1</button></div>
      <p id="contrast-help">Updates every example live. Finds the lightest passing shade towards black. A 0.02 numerical margin and one 8-bit pixel step allow for tested browser paint differences.</p>
    </section>
    ${["A", "B"].map((family) => `<details class="parameterizer-folder image-type-controls" open>
      <summary class="parameterizer-folder-title">${imageGroupTitles[family]} <span>${settings.photoPeaks[family] * 100}%</span></summary>
      <div class="parameterizer-folder-body">${coverageControls.filter((item) => item.family === family).map(({ key, label }) => `
        <label class="parameterizer-row" for="${key}"><span class="parameterizer-label">${label}</span><input class="parameterizer-range" type="range" id="${key}" min="${settings.ranges[key][0]}" max="${settings.ranges[key][1]}" step="1" value="${state[key]}" data-control="${key}"><output class="parameterizer-value" data-output="${key}">${state[key]}%</output></label>`).join("")}</div>
      </details>`).join("")}`;
  controlsRoot.addEventListener("submit", (event) => event.preventDefault());
  controlsRoot.addEventListener("input", (event) => {
    if (!event.target.dataset.control) return;
    state = settings.normalizeState({ ...state, [event.target.dataset.control]: Number(event.target.value) });
    apply();
  });
  controlsRoot.addEventListener("click", (event) => {
    const button = event.target.closest("[data-target]");
    if (button) {
      state.targetContrast = Number(button.dataset.target);
      apply();
    }
  });
  const select = document.querySelector("[data-override-example]");
  select.innerHTML = cards.map((card) => `<option value="${card.id}">${card.label}</option>`).join("");
  const enabled = document.querySelector("[data-override-enabled]");
  const colourInput = document.querySelector("[data-override-colour]");
  select.addEventListener("change", syncOverride);
  enabled.addEventListener("change", () => {
    if (enabled.checked) overrides[select.value] = colourInput.value;
    else delete overrides[select.value];
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
  document.querySelector("[data-override-enabled]").checked = Boolean(overrides[id]);
  colourInput.disabled = !overrides[id];
  colourInput.value = overrides[id] || (results.get(id) ? colourEngine.hex(results.get(id).sample) : "#86715c");
}
function payload() {
  return { schema: settings.schema, surface: "AHA Adaptive Image Colour Lab", state: settings.normalizeState(state), overrides: settings.normalizeOverrides(overrides) };
}
function apply() {
  for (const input of controlsRoot.querySelectorAll("[data-control]")) {
    input.value = state[input.dataset.control];
    const readout = controlsRoot.querySelector(`[data-output="${input.dataset.control}"]`);
    if (readout) readout.textContent = `${input.value}%`;
  }
  document.querySelector("[data-target-output]").textContent = `${state.targetContrast.toFixed(1)}:1`;
  const slider = document.querySelector("#targetContrast");
  slider.setAttribute("aria-valuetext", `${state.targetContrast.toFixed(1)} to 1, ${state.targetContrast >= 7 ? "AAA" : "AA"} text contrast target`);
  document.querySelector("[data-target-label]").textContent = `${state.targetContrast >= 7 ? "AAA" : "AA"} · ${state.targetContrast.toFixed(1)}:1`;
  for (const button of controlsRoot.querySelectorAll("[data-target]")) button.setAttribute("aria-pressed", String(Number(button.dataset.target) === state.targetContrast));
  for (const card of cards) controllers.get(card.id)?.update(optionsFor(card));
  output.value = JSON.stringify(payload(), null, 2);
  status.textContent = "";
}
async function copy(value, message) {
  try {
    await navigator.clipboard.writeText(value);
    status.textContent = message;
  } catch {
    output.value = value;
    output.closest("details").open = true;
    output.focus();
    output.select();
    status.textContent = "Copy unavailable. Select and copy the output.";
  }
}
function bindActions() {
  document.querySelector("[data-copy-config]").addEventListener("click", () => copy(JSON.stringify(payload(), null, 2), "Configuration copied."));
  document.querySelector("[data-copy-css]").addEventListener("click", () => {
    const css = ["/* Current dimensions only. Use adaptive-colour.min.js for responsive contrast checks. */", ...cards.map((card) => {
      const surface = root.querySelector(`[data-image-id="${card.id}"]`);
      return `[data-image-id="${card.id}"] { ${surface.style.cssText} }`;
    })].join("\n");
    void copy(css, "CSS snapshot copied.");
  });
  document.querySelector("[data-reset-config]").addEventListener("click", () => {
    state = { ...authored.state };
    overrides = { ...authored.overrides };
    apply();
    syncOverride();
    status.textContent = "Authored settings restored.";
  });
  document.querySelector("[data-save-config]").addEventListener("click", async (event) => {
    const button = event.currentTarget, saved = payload();
    button.disabled = true;
    try {
      const response = await fetch("/__adaptive-card-lab/save-settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(saved) });
      if (!response.ok || !(await response.json()).saved) throw new Error("Local save unavailable.");
      authored = saved;
      status.textContent = "Saved to config.json.";
    } catch {
      output.value = JSON.stringify(saved, null, 2);
      output.closest("details").open = true;
      output.focus();
      output.select();
      status.textContent = "Static preview: copy the configuration to save it. The local runner supports Save.";
    } finally {
      button.disabled = false;
    }
  });
  const recheck = document.createElement("button");
  recheck.type = "button";
  recheck.className = "parameterizer-button recheck";
  recheck.textContent = "Recheck images";
  recheck.addEventListener("click", () => {
    for (const controller of controllers.values()) controller.refresh({ retry: true });
  });
  samplingStatus.before(recheck);
  const resized = new ResizeObserver(() => {
    for (const card of cards) controllers.get(card.id)?.update(optionsFor(card));
  });
  resized.observe(root);
}
async function init() {
  try {
    const response = await fetch("config.json?v=aa-rebuild-v1", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const config = settings.migrateConfig(await response.json());
    state = config.state;
    overrides = config.overrides;
    const notice = document.querySelector("[data-migration-status]");
    notice.textContent = config.notes.join(" ");
    notice.hidden = !config.notes.length;
  } catch (failure) {
    const notice = document.querySelector("[data-migration-status]");
    notice.textContent = `Configuration unavailable (${failure.message}). Using AA defaults.`;
    notice.hidden = false;
  }
  authored = payload();
  renderExamples();
  renderControls();
  bindActions();
  apply();
  syncOverride();
}
void init();
