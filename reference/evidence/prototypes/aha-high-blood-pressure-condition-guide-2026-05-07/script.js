const sectionLinks = [...document.querySelectorAll(".rail-link")];
const floatingHeader = document.querySelector(".floating-header");
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

let activeSectionId = "";
let scrollTicking = false;
let lastHeaderScrollY = window.scrollY;
let headerTicking = false;

function setActiveSection(section, options = {}) {
  if (!section) return;
  const isNewSection = section.id !== activeSectionId;

  activeSectionId = section.id;

  sectionLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${section.id}`;
    link.classList.toggle("is-active", isActive);
    link.toggleAttribute("aria-current", isActive);

    const rail = link.closest(".side-rail");
    const railScrollsHorizontally = rail && rail.scrollWidth > rail.clientWidth + 1;

    if (
      isActive &&
      railScrollsHorizontally &&
      (isNewSection || options.forceRailScroll) &&
      window.matchMedia("(max-width: 1180px)").matches
    ) {
      link.scrollIntoView({ behavior: "auto", inline: "center", block: "nearest" });
    }
  });
}

function updateActiveSection() {
  scrollTicking = false;
  if (!sections.length) return;

  const readingLine = window.scrollY + Math.min(window.innerHeight * 0.38, 340);
  let current = sections[0];

  sections.forEach((section) => {
    if (section.offsetTop <= readingLine) {
      current = section;
    }
  });

  const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24;
  setActiveSection(nearBottom ? sections[sections.length - 1] : current);
}

function requestActiveSectionUpdate() {
  if (scrollTicking) return;
  scrollTicking = true;
  window.requestAnimationFrame(updateActiveSection);
}

function updateFloatingHeader() {
  headerTicking = false;
  if (!floatingHeader) return;

  const currentY = Math.max(window.scrollY, 0);
  const delta = currentY - lastHeaderScrollY;
  const nearTop = currentY < 32;

  if (nearTop || delta < -6) {
    floatingHeader.classList.remove("is-hidden");
  } else if (delta > 8 && currentY > 120) {
    floatingHeader.classList.add("is-hidden");
  }

  lastHeaderScrollY = currentY;
}

function requestFloatingHeaderUpdate() {
  if (headerTicking) return;
  headerTicking = true;
  window.requestAnimationFrame(updateFloatingHeader);
}

function syncActiveSectionFromHash() {
  if (location.hash) {
    const target = document.querySelector(location.hash);
    const ownerSection = target?.closest(".guide-section");

    if (ownerSection) {
      setActiveSection(ownerSection, { forceRailScroll: true });
      return;
    }
  }

  requestActiveSectionUpdate();
}

sectionLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const target = document.querySelector(link.getAttribute("href"));
    setActiveSection(target, { forceRailScroll: true });
  });
});

window.addEventListener(
  "scroll",
  () => {
    requestActiveSectionUpdate();
    requestFloatingHeaderUpdate();
  },
  { passive: true },
);
window.addEventListener("resize", requestActiveSectionUpdate);
window.addEventListener("hashchange", syncActiveSectionFromHash);
window.addEventListener("load", syncActiveSectionFromHash);
syncActiveSectionFromHash();

document.querySelectorAll("details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    const summary = detail.querySelector("summary");
    summary?.setAttribute("aria-expanded", "true");
  });
});

const systolicInput = document.querySelector("#systolic-input");
const diastolicInput = document.querySelector("#diastolic-input");
const seriousSymptomsInput = document.querySelector("#serious-symptoms-input");
const readingButton = document.querySelector("#reading-helper-button");
const readingResult = document.querySelector("#reading-helper-result");

function classifyReading(systolic, diastolic, hasSeriousSymptoms) {
  if (Number.isNaN(systolic) || Number.isNaN(diastolic)) {
    return {
      title: "Enter both numbers.",
      body: "Use the top number and bottom number from one blood pressure reading.",
      urgent: false,
    };
  }

  if (systolic < 40 || systolic > 260 || diastolic < 30 || diastolic > 180) {
    return {
      title: "Check the numbers entered.",
      body: "These values are outside the range this helper can read. Re-enter the numbers or contact a health care professional if you are unsure.",
      urgent: false,
    };
  }

  if (systolic > 180 || diastolic > 120) {
    if (hasSeriousSymptoms) {
      return {
        title: "Very high reading with serious symptoms.",
        body: "Call 911 now. A very high reading with chest pain, shortness of breath, weakness, vision changes, trouble speaking, or another new serious symptom may need emergency care.",
        urgent: true,
      };
    }

    return {
      title: "Very high reading.",
      body: "Wait at least one minute and take it again. If the second reading is still higher than 180 and/or higher than 120, contact a health care professional right away.",
      urgent: true,
    };
  }

  if (hasSeriousSymptoms) {
    return {
      title: "Serious symptoms matter.",
      body: "New chest pain, shortness of breath, weakness, vision changes, trouble speaking, or another serious symptom can need urgent help even when the reading is not in the very high range.",
      urgent: true,
    };
  }

  const hasLowNumber = systolic < 90 || diastolic < 60;
  const hasHighNumber = systolic >= 130 || diastolic >= 80;

  if (hasLowNumber && hasHighNumber) {
    return {
      title: "Mixed reading pattern.",
      body: "One number is low while the other is high. Save the reading and ask your care team how to understand the pattern.",
      urgent: false,
    };
  }

  if (hasLowNumber) {
    return {
      title: "Lower than common adult readings.",
      body: "Some people normally run low. If you feel dizzy, faint, weak, confused, or different than usual, contact a health care professional.",
      urgent: false,
    };
  }

  if (systolic < 120 && diastolic < 80) {
    return {
      title: "Normal range.",
      body: "Keep recording readings as advised and keep up heart-healthy habits. If this is different from your usual pattern, bring it to your care team.",
      urgent: false,
    };
  }

  if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    return {
      title: "Elevated range.",
      body: "This is a good time to focus on prevention habits and track future readings. Ask your care team how often to check.",
      urgent: false,
    };
  }

  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return {
      title: "Stage 1 high blood pressure range.",
      body: "One reading is not a diagnosis. Record a pattern and talk with your health care professional about your risk, goal, and what to watch.",
      urgent: false,
    };
  }

  if (systolic >= 140 || diastolic >= 90) {
    return {
      title: "Stage 2 high blood pressure range.",
      body: "Write down the reading and contact your health care professional, especially if repeated readings are in this range.",
      urgent: false,
    };
  }

  return {
    title: "Mixed reading pattern.",
    body: "Blood pressure categories depend on both numbers. Save the reading and ask your care team how to understand your pattern.",
    urgent: false,
  };
}

function updateReadingHelper() {
  if (!readingResult || !systolicInput || !diastolicInput || !seriousSymptomsInput) return;

  const systolic = Number.parseInt(systolicInput.value, 10);
  const diastolic = Number.parseInt(diastolicInput.value, 10);
  const result = classifyReading(systolic, diastolic, seriousSymptomsInput.checked);

  readingResult.classList.toggle("is-urgent", result.urgent);
  readingResult.innerHTML = `<strong>${result.title}</strong>${result.body}`;
}

[systolicInput, diastolicInput, seriousSymptomsInput].forEach((input) => {
  input?.addEventListener("input", updateReadingHelper);
  input?.addEventListener("change", updateReadingHelper);
});

readingButton?.addEventListener("click", updateReadingHelper);

document.querySelector(".reading-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  updateReadingHelper();
});
