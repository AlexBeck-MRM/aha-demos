const prototype = document.querySelector(".prototype");
const cardRow = document.querySelector("[data-card-row]");
const tablist = document.querySelector("[data-tablist]");
const controlsRoot = document.querySelector("[data-control-root]");
const stateButtons = document.querySelectorAll("[data-state]");
const specHover = document.querySelector("[data-spec-hover]");
const specPressed = document.querySelector("[data-spec-pressed]");
const specTiming = document.querySelector("[data-spec-timing]");
const panelCopy = document.querySelector(".panel-copy");

const cards = [
  {
    id: "habits",
    title: "Build Healthier Habits",
    body: "Simple steps for food, movement, sleep, and more.",
    tone: "#173c3c",
    toneRgb: "23 60 60",
    imageLayers: [
      { type: "image", src: "assets/figma/card-habits-1.png" },
      { type: "image", src: "assets/figma/card-habits-2.png", className: "card-image-overlay" },
    ],
  },
  {
    id: "women",
    title: "Women’s Heart Health",
    body: "Know the signs, understand your risk, and plan ahead.",
    tone: "#503926",
    toneRgb: "80 57 38",
    imageLayers: [
      { type: "fill" },
      { type: "image", src: "assets/figma/card-women-1.png" },
      { type: "cropped", src: "assets/figma/card-women-2.png" },
      { type: "image", src: "assets/figma/card-women-3.png" },
    ],
  },
];

const tabs = [
  { id: "for-you", label: "For you", icon: "assets/figma/tab-for-you.png", width: 106.667 },
  { id: "conditions", label: "Understand conditions", icon: "assets/figma/tab-conditions.png", width: 106.667 },
  { id: "healthy", label: "Stay healthy", icon: "assets/figma/tab-healthy.png", width: 106.467 },
  { id: "care", label: "Care for someone", icon: "assets/figma/tab-care.png", width: 106.217 },
  { id: "contribution", label: "Make a contribution", icon: "assets/figma/tab-contribution.png", width: 105.883, selected: true },
  { id: "volunteer", label: "Find Volunteering", icon: "assets/figma/tab-volunteer.png", width: 105.383 },
  { id: "cpr", label: "Learn CPR", icon: "assets/figma/tab-cpr.png", width: 104.383 },
];

const presets = {
  quiet: {
    label: "Quiet",
    values: {
      hoverScale: 1.004,
      hoverLift: 2,
      hoverTilt: 0,
      pressedScale: 0.997,
      pressedDrop: 1,
      copyResponse: "stable",
      hoverTextLift: 1,
      pressedTextDrop: 0.5,
      hoverShadow: 0.7,
      pressedShadow: 0.4,
      mediaDrift: 0,
      chevronNudge: 1.5,
      hoverMs: 420,
      pressMs: 90,
      releaseMs: 560,
      overshoot: 0.08,
    },
  },
  default: {
    label: "Default",
    values: {
      hoverScale: 1.008,
      hoverLift: 4,
      hoverTilt: 0,
      pressedScale: 0.994,
      pressedDrop: 1.5,
      copyResponse: "stable",
      hoverTextLift: 1.5,
      pressedTextDrop: 0.5,
      hoverShadow: 0.95,
      pressedShadow: 0.55,
      mediaDrift: 0,
      chevronNudge: 2,
      hoverMs: 480,
      pressMs: 80,
      releaseMs: 640,
      overshoot: 0.18,
    },
  },
  anchored: {
    label: "Anchored",
    values: {
      hoverScale: 1.014,
      hoverLift: 5,
      hoverTilt: 0,
      pressedScale: 0.99,
      pressedDrop: 2,
      copyResponse: "anchored",
      hoverTextLift: 1,
      pressedTextDrop: 0.5,
      hoverShadow: 1.2,
      pressedShadow: 0.65,
      mediaDrift: 1,
      chevronNudge: 2.25,
      hoverMs: 540,
      pressMs: 90,
      releaseMs: 760,
      overshoot: 0.3,
    },
  },
  expressive: {
    label: "Expressive",
    values: {
      hoverScale: 1.035,
      hoverLift: 14,
      hoverTilt: 1.2,
      pressedScale: 0.972,
      pressedDrop: 7,
      copyResponse: "follow",
      hoverTextLift: 4,
      pressedTextDrop: 3,
      hoverShadow: 1.9,
      pressedShadow: 0.9,
      mediaDrift: 5,
      chevronNudge: 3,
      hoverMs: 620,
      pressMs: 110,
      releaseMs: 900,
      overshoot: 0.7,
    },
  },
};

const copyResponseOptions = [
  { value: "stable", label: "Stable" },
  { value: "anchored", label: "Anchored" },
  { value: "follow", label: "Follow 25%" },
  { value: "diagnostic", label: "Diagnostic" },
];

const controlGroups = [
  {
    id: "surface",
    title: "Surface",
    status: () => `${formatNumber(state.hoverLift)}px lift / ${formatNumber(state.pressedDrop)}px drop`,
    controls: [
      { key: "hoverScale", label: "Hover scale", min: 1, max: 1.065, step: 0.001, unit: "x" },
      { key: "hoverLift", label: "Hover lift", min: 0, max: 20, step: 1, unit: "px" },
      { key: "hoverTilt", label: "Hover tilt", min: 0, max: 2, step: 0.1, unit: "deg" },
      { key: "pressedScale", label: "Pressed scale", min: 0.94, max: 1, step: 0.001, unit: "x" },
      { key: "pressedDrop", label: "Pressed drop", min: 0, max: 12, step: 1, unit: "px" },
    ],
  },
  {
    id: "copy",
    title: "Copy",
    status: () => copyResponseOptions.find((option) => option.value === state.copyResponse).label,
    controls: [
      { key: "copyResponse", label: "Copy response", type: "segmented", options: copyResponseOptions },
      { key: "hoverTextLift", label: "Hover text lift", min: 0, max: 8, step: 0.5, unit: "px" },
      { key: "pressedTextDrop", label: "Pressed text drop", min: 0, max: 8, step: 0.5, unit: "px" },
    ],
  },
  {
    id: "depth",
    title: "Depth",
    status: () => `${formatNumber(state.hoverShadow)}x hover`,
    controls: [
      { key: "hoverShadow", label: "Hover shadow", min: 0.3, max: 2.6, step: 0.05, unit: "x" },
      { key: "pressedShadow", label: "Pressed shadow", min: 0, max: 1.2, step: 0.05, unit: "x" },
      { key: "mediaDrift", label: "Media drift", min: 0, max: 8, step: 0.5, unit: "px" },
      { key: "chevronNudge", label: "Chevron nudge", min: 0, max: 4, step: 0.5, unit: "px" },
    ],
  },
  {
    id: "timing",
    title: "Timing",
    status: () => `${state.hoverMs}/${state.pressMs}/${state.releaseMs}ms`,
    variant: "wide",
    controls: [
      { key: "hoverMs", label: "Hover timing", min: 160, max: 760, step: 10, unit: "ms" },
      { key: "pressMs", label: "Press timing", min: 60, max: 280, step: 10, unit: "ms" },
      { key: "releaseMs", label: "Release timing", min: 220, max: 1000, step: 10, unit: "ms" },
      { key: "overshoot", label: "Overshoot", min: 0, max: 1, step: 0.05, unit: "x" },
    ],
  },
];

const controls = controlGroups.flatMap((group) => group.controls.filter((control) => control.type !== "segmented"));
const state = { ...presets.quiet.values };

function init() {
  renderCards();
  renderTabs();
  renderControls();
  bindStateControls();
  bindTabs();
  bindPressFeedback();
  applyControls();
}

function renderCards() {
  cardRow.innerHTML = cards.map((card) => `
    <button class="card-md tactile-target demo-target" type="button" data-card-id="${card.id}" style="--card-tone: ${card.tone}; --card-tone-rgb: ${card.toneRgb}" aria-label="${card.title}. ${card.body}">
      <span class="tactile-surface card-surface" aria-hidden="true">
        <span class="card-media-stack">
          ${card.imageLayers.map(renderCardImageLayer).join("")}
        </span>
        <span class="card-gradient"></span>
      </span>
      <span class="tactile-content card-content">
        <span class="card-copy">
          <span class="card-title">${card.title}</span>
          <span class="card-body">${card.body}</span>
        </span>
        <span class="card-arrow" aria-hidden="true">
          <img src="assets/figma/icon-chevron.svg" alt="">
        </span>
      </span>
    </button>
  `).join("");
}

function renderCardImageLayer(layer) {
  if (layer.type === "fill") {
    return `<span class="card-media-fill"></span>`;
  }

  if (layer.type === "cropped") {
    return `
      <span class="card-image-frame">
        <img class="card-image card-image-crop" src="${layer.src}" alt="">
      </span>
    `;
  }

  return `<img class="card-image ${layer.className || ""}" src="${layer.src}" alt="">`;
}

function renderTabs() {
  tablist.innerHTML = tabs.map((tab) => renderTab(tab)).join("");
}

function renderTab(tab) {
  const selected = Boolean(tab.selected);
  return `
    <button class="journey-tab tactile-target demo-target${selected ? " is-selected" : ""}" type="button" id="tab-${tab.id}" role="tab" aria-selected="${selected}" tabindex="${selected ? "0" : "-1"}" data-tab-id="${tab.id}" style="--tab-width: ${tab.width}px">
      <span class="tactile-surface tab-surface" aria-hidden="true"></span>
      <span class="tactile-content tab-content">
        <img class="tab-icon" src="${tab.icon}" alt="" aria-hidden="true">
        <span class="tab-label">${tab.label}</span>
      </span>
    </button>
  `;
}

function renderControls() {
  controlsRoot.innerHTML = `
    <section class="control-group preset-group" aria-labelledby="control-presets">
      <div class="control-group-heading">
        <h3 id="control-presets">Presets</h3>
        <span data-active-preset>Default</span>
      </div>
      <div class="preset-controls">
        ${Object.entries(presets).map(([key, preset]) => `
          <button class="panel-button preset-button" type="button" data-preset="${key}">${preset.label}</button>
        `).join("")}
        <button class="panel-button preset-button" type="button" data-preset="reset">Reset</button>
      </div>
    </section>
    ${controlGroups.map(renderControlGroup).join("")}
  `;

  controlsRoot.addEventListener("input", (event) => {
    const input = event.target.closest("[data-control]");
    if (!input) return;
    state[input.dataset.control] = Number(input.value);
    applyControls();
  });

  controlsRoot.addEventListener("click", (event) => {
    const presetButton = event.target.closest("[data-preset]");
    if (presetButton) {
      applyPreset(presetButton.dataset.preset);
      return;
    }

    const copyButton = event.target.closest("[data-copy-response]");
    if (copyButton) {
      state.copyResponse = copyButton.dataset.copyResponse;
      applyControls();
    }
  });
}

function renderControlGroup(group) {
  return `
    <section class="control-group${group.variant ? ` control-group-${group.variant}` : ""}" aria-labelledby="control-${group.id}">
      <div class="control-group-heading">
        <h3 id="control-${group.id}">${group.title}</h3>
        <span data-group-status="${group.id}">${group.status()}</span>
      </div>
      <div class="control-grid">
        ${group.controls.map(renderControl).join("")}
      </div>
    </section>
  `;
}

function renderControl(control) {
  if (control.type === "segmented") {
    return `
      <fieldset class="copy-mode-control">
        <legend>${control.label}</legend>
        <div class="segmented-control">
          ${control.options.map((option) => `
            <button class="segmented-button" type="button" data-copy-response="${option.value}" aria-pressed="${option.value === state.copyResponse}">${option.label}</button>
          `).join("")}
        </div>
      </fieldset>
    `;
  }

  return `
    <label class="control-row" for="${control.key}">
      <span class="control-label">
        <span>${control.label}</span>
        <output data-output="${control.key}">${formatValue(state[control.key], control)}</output>
      </span>
      <input id="${control.key}" type="range" min="${control.min}" max="${control.max}" step="${control.step}" value="${state[control.key]}" data-control="${control.key}">
    </label>
  `;
}

function applyPreset(presetKey) {
  const targetPreset = presetKey === "reset" ? presets.quiet : presets[presetKey];
  Object.assign(state, targetPreset.values);

  controls.forEach((control) => {
    const input = controlsRoot.querySelector(`[data-control="${control.key}"]`);
    if (input) input.value = state[control.key];
  });

  applyControls();
}

function bindStateControls() {
  stateButtons.forEach((button) => {
    button.addEventListener("click", () => {
      prototype.dataset.demoState = button.dataset.state;
      stateButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
    });
  });
}

function bindTabs() {
  tablist.addEventListener("click", (event) => {
    const tab = event.target.closest("[role='tab']");
    if (tab) selectTab(tab);
  });

  tablist.addEventListener("keydown", (event) => {
    const tabButtons = [...tablist.querySelectorAll("[role='tab']")];
    const currentIndex = Math.max(0, tabButtons.indexOf(document.activeElement));
    const keyMap = {
      ArrowRight: (currentIndex + 1) % tabButtons.length,
      ArrowDown: (currentIndex + 1) % tabButtons.length,
      ArrowLeft: (currentIndex - 1 + tabButtons.length) % tabButtons.length,
      ArrowUp: (currentIndex - 1 + tabButtons.length) % tabButtons.length,
      Home: 0,
      End: tabButtons.length - 1,
    };

    if (event.key in keyMap) {
      event.preventDefault();
      selectTab(tabButtons[keyMap[event.key]]);
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectTab(document.activeElement);
    }
  });
}

function selectTab(selectedTab) {
  tablist.querySelectorAll("[role='tab']").forEach((tab) => {
    const selected = tab === selectedTab;
    tab.classList.toggle("is-selected", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  selectedTab.focus();
}

function bindPressFeedback() {
  document.addEventListener("pointerdown", (event) => {
    const target = event.target.closest(".tactile-target");
    if (target) target.classList.add("is-pointer-pressed");
  });

  document.addEventListener("pointerup", clearPressedState);
  document.addEventListener("pointercancel", clearPressedState);
  document.addEventListener("pointerleave", clearPressedState);
}

function clearPressedState() {
  document.querySelectorAll(".is-pointer-pressed").forEach((target) => {
    target.classList.remove("is-pointer-pressed");
  });
}

function applyControls() {
  const hoverCopyScaleFollow = 1 + ((state.hoverScale - 1) * 0.25);
  const pressedCopyScaleFollow = 1 + ((state.pressedScale - 1) * 0.25);
  const hoverEaseY2 = 1 + (state.overshoot * 0.4);
  const chevronHoverScale = 1 + (state.chevronNudge * 0.007);
  const chevronPressedScale = Math.max(0.965, 1 - (state.chevronNudge * 0.006));

  prototype.dataset.copyResponse = state.copyResponse;
  prototype.style.setProperty("--hover-surface-scale", state.hoverScale);
  prototype.style.setProperty("--hover-surface-y", `${state.hoverLift * -1}px`);
  prototype.style.setProperty("--hover-surface-tilt", `${state.hoverTilt}deg`);
  prototype.style.setProperty("--hover-content-y", `${state.hoverTextLift * -1}px`);
  prototype.style.setProperty("--hover-content-y-anchored", `${(state.hoverLift + state.hoverTextLift) * -1}px`);
  prototype.style.setProperty("--pressed-surface-scale", state.pressedScale);
  prototype.style.setProperty("--pressed-surface-y", `${state.pressedDrop}px`);
  prototype.style.setProperty("--pressed-content-y", `${state.pressedTextDrop}px`);
  prototype.style.setProperty("--pressed-content-y-anchored", `${state.pressedDrop + state.pressedTextDrop}px`);
  prototype.style.setProperty("--hover-copy-scale-follow", hoverCopyScaleFollow);
  prototype.style.setProperty("--pressed-copy-scale-follow", pressedCopyScaleFollow);
  prototype.style.setProperty("--media-hover-y", `${state.mediaDrift * -1}px`);
  prototype.style.setProperty("--chevron-hover-x", `${state.chevronNudge}px`);
  prototype.style.setProperty("--chevron-hover-scale", chevronHoverScale);
  prototype.style.setProperty("--chevron-pressed-x", `${state.chevronNudge * -0.35}px`);
  prototype.style.setProperty("--chevron-pressed-y", `${Math.min(0.9, state.chevronNudge * 0.18)}px`);
  prototype.style.setProperty("--chevron-pressed-scale", chevronPressedScale);
  prototype.style.setProperty("--state-duration", `${state.hoverMs}ms`);
  prototype.style.setProperty("--press-duration", `${state.pressMs}ms`);
  prototype.style.setProperty("--release-duration", `${state.releaseMs}ms`);
  prototype.style.setProperty("--state-ease", `cubic-bezier(.18, .72, .18, ${hoverEaseY2.toFixed(2)})`);
  prototype.style.setProperty("--shadow-hover", buildHoverShadow(state.hoverShadow));
  prototype.style.setProperty("--shadow-pressed", buildPressedShadow(state.pressedShadow));

  controls.forEach((control) => {
    const output = controlsRoot.querySelector(`[data-output="${control.key}"]`);
    if (output) output.textContent = formatValue(state[control.key], control);
  });

  controlGroups.forEach((group) => {
    const output = controlsRoot.querySelector(`[data-group-status="${group.id}"]`);
    if (output) output.textContent = group.status();
  });

  controlsRoot.querySelectorAll("[data-copy-response]").forEach((button) => {
    const active = button.dataset.copyResponse === state.copyResponse;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  controlsRoot.querySelectorAll("[data-preset]").forEach((button) => {
    const active = button.dataset.preset !== "reset" && matchesPreset(button.dataset.preset);
    button.classList.toggle("is-active", active);
  });

  const activePreset = controlsRoot.querySelector("[data-active-preset]");
  if (activePreset) activePreset.textContent = getPresetLabel();

  specHover.textContent = `Surface scales to ${formatValue(state.hoverScale, findControl("hoverScale"))}, lifts ${formatValue(state.hoverLift, findControl("hoverLift"))}, copy rises ${formatValue(state.hoverTextLift, findControl("hoverTextLift"))}, and shadow opens to ${formatValue(state.hoverShadow, findControl("hoverShadow"))}.`;
  specPressed.textContent = `Surface compresses to ${formatValue(state.pressedScale, findControl("pressedScale"))}, drops ${formatValue(state.pressedDrop, findControl("pressedDrop"))}, copy drops ${formatValue(state.pressedTextDrop, findControl("pressedTextDrop"))}, and shadow tightens to ${formatValue(state.pressedShadow, findControl("pressedShadow"))}.`;
  specTiming.textContent = `Hover in ${state.hoverMs}ms, press in ${state.pressMs}ms, release in ${state.releaseMs}ms.`;
  panelCopy.textContent = `${getPresetLabel()} preset. Stable keeps live text unscaled; half-pixel text values are for feel exploration. ${getCopyModeDescription()}`;
}

function buildHoverShadow(strength) {
  const s = Number(strength);
  return `0 ${Math.round(22 * s)}px ${Math.round(22 * s)}px rgb(0 0 0 / ${clamp(0.055 * s, 0, 0.13)}), 0 ${Math.round(9 * s)}px ${Math.round(9 * s)}px rgb(0 0 0 / ${clamp(0.075 * s, 0, 0.15)}), 0 1px 2px rgb(0 0 0 / ${clamp(0.13 + s * 0.025, 0, 0.2)})`;
}

function buildPressedShadow(strength) {
  const s = Number(strength);
  return `0 ${Math.round(4 * s)}px ${Math.round(3 * s)}px rgb(0 0 0 / ${clamp(0.055 * s, 0, 0.08)}), 0 0 1px rgb(0 0 0 / ${clamp(0.08 + s * 0.045, 0, 0.12)})`;
}

function formatValue(value, control) {
  if (control.unit === "x") return formatNumber(value);
  return `${formatNumber(value)}${control.unit}`;
}

function formatNumber(value) {
  return Number(value).toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}

function findControl(key) {
  return controls.find((control) => control.key === key);
}

function matchesPreset(presetKey) {
  const preset = presets[presetKey];
  if (!preset) return false;
  return Object.entries(preset.values).every(([key, value]) => state[key] === value);
}

function getPresetLabel() {
  const matchingPreset = Object.entries(presets).find(([key]) => matchesPreset(key));
  return matchingPreset ? matchingPreset[1].label : "Custom";
}

function getCopyModeDescription() {
  if (state.copyResponse === "anchored") return "Anchored copy remains unscaled but travels with the surface lift/drop, plus the text offset.";
  if (state.copyResponse === "follow") return "Copy follows 25% of surface scale for controlled exploration.";
  if (state.copyResponse === "diagnostic") return "Full surface diagnostic intentionally scales copy to expose blur and shimmer tradeoffs.";
  return "Stable copy translates only and does not scale.";
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

init();
