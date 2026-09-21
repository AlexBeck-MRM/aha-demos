import { Icon } from "../Icon";
import { InteractiveSurface } from "../InteractiveSurface";
import { usePreviewState } from "../lab/PreviewStateContext";
import { useRovingTabs } from "../lab/useRovingTabs";
import { LivingGradientLayer } from "../../living-gradient/LivingGradient";
import { asset, markGradientEffect, persistentGradientEffect, primaryGradientEffect } from "./shared";

const journeys = [
  { id: "for-you", label: "For you", image: "journey-for-you.png" },
  { id: "conditions", label: "Understand conditions", image: "journey-conditions.png" },
  { id: "healthy", label: "Stay healthy", image: "journey-healthy.png" },
  { id: "care", label: "Care for someone", image: "journey-care.png" },
  { id: "contribution", label: "Make a contribution", image: "journey-contribution.png" },
  { id: "volunteer", label: "Volunteer", image: "journey-volunteer.png" },
  { id: "cpr", label: "Learn CPR", image: "journey-cpr.png" }
];

export function JourneyTabsSpecimen() {
  const ids = journeys.map((journey) => journey.id);
  const { activeId, setActiveId, onKeyDown } = useRovingTabs(ids);
  const previewState = usePreviewState();
  const previewTarget = journeys.find((journey) => journey.id !== activeId)?.id;

  return (
    <div className="journey-tabs">
      <div className="journey-tab-row" role="group" aria-label="AHA journeys" onKeyDown={onKeyDown}>
        {journeys.map((journey) => {
          const selected = activeId === journey.id;
          return (
            <InteractiveSurface
              body={1}
              className={`journey-pill ${selected ? "is-current" : ""}`}
              type="button"
              aria-pressed={selected}
              tabIndex={selected ? 0 : -1}
              data-tab-id={journey.id}
              previewStateOverride={journey.id === previewTarget ? previewState : "rest"}
              onClick={() => setActiveId(journey.id)}
              key={journey.id}
            >
              <img src={asset(journey.image)} alt="" aria-hidden="true" />
              <span>{journey.label}</span>
            </InteractiveSurface>
          );
        })}
      </div>
    </div>
  );
}

const guideTabs = [
  { id: "overview", label: "Overview", body: "A clear starting point for understanding the condition." },
  { id: "symptoms", label: "Symptoms", body: "What to notice, what it might mean and when to get help." },
  { id: "treatment", label: "Treatment", body: "Questions to discuss with your healthcare professional." },
  { id: "living-well", label: "Living well", body: "Everyday steps that can support your health and confidence." },
  { id: "support", label: "Support", body: "Tools, stories and services to help you keep moving forward." }
];

function GuideTabList({ variant }: { variant: "contained" | "underline" }) {
  const ids = guideTabs.map((tab) => tab.id);
  const { activeId, setActiveId, onKeyDown } = useRovingTabs(ids);
  const activeTab = guideTabs.find((tab) => tab.id === activeId) ?? guideTabs[0];
  const previewState = usePreviewState();
  const previewTarget = guideTabs.find((tab) => tab.id !== activeId)?.id;
  const prefix = `${variant}-guide`;

  return (
    <div className={`guide-tab-example ${variant}`}>
      <span className="variant-label">{variant === "contained" ? "Contained tabs" : "Underline tabs"}</span>
      <div className={`${variant}-tabs`} role="tablist" aria-label={`${variant} condition guide tabs`} onKeyDown={onKeyDown}>
        {guideTabs.map((tab) => {
          const selected = activeId === tab.id;
          return (
            <InteractiveSurface
              body={variant === "contained" ? 1 : "flat"}
              className={`tab-button ${variant} ${selected ? "is-active" : ""}`}
              role="tab"
              aria-selected={selected}
              aria-controls={`${prefix}-panel`}
              id={`${prefix}-tab-${tab.id}`}
              data-tab-id={tab.id}
              tabIndex={selected ? 0 : -1}
              type="button"
              previewStateOverride={tab.id === previewTarget ? previewState : "rest"}
              onClick={() => setActiveId(tab.id)}
              key={tab.id}
            >
              {tab.label}
            </InteractiveSurface>
          );
        })}
      </div>
      <div className="tab-panel" id={`${prefix}-panel`} role="tabpanel" aria-labelledby={`${prefix}-tab-${activeId}`}>
        {activeTab.body}
      </div>
    </div>
  );
}

export function ContentTabsSpecimen() {
  return <div className="tabs-stack"><GuideTabList variant="contained" /><GuideTabList variant="underline" /></div>;
}

const guideItems = [
  ["1", "Overview", "Start with the essentials."],
  ["2", "Symptoms and readings", "Know what to look for."],
  ["3", "Risk factors", "See what can affect your health."],
  ["4", "Treatment", "Prepare for care conversations."],
  ["5", "Living well", "Build routines that fit."],
  ["6", "Support", "Keep useful help close."]
];

export function GuideNavigationSpecimen() {
  const previewState = usePreviewState();
  return (
    <aside className="guide-sidebar" aria-label="Condition guide contents">
      <h3>Guide contents</h3>
      <div>
        {guideItems.map(([number, title, body], index) => (
          <InteractiveSurface
            body="flat"
            className={`sidebar-link ${index === 0 ? "is-current" : ""}`}
            type="button"
            aria-current={index === 0 ? "page" : undefined}
            previewStateOverride={index === 1 ? previewState : "rest"}
            key={number}
          >
            <span className="sidebar-step">{number}</span>
            <span><strong>{title}</strong><small>{body}</small></span>
          </InteractiveSurface>
        ))}
      </div>
    </aside>
  );
}

const menuColumns = [
  ["Conditions", "High blood pressure", "Heart attack", "Stroke", "Heart failure", "Arrhythmia"],
  ["Healthy living", "Eat smart", "Move more", "Sleep well", "Manage stress", "Quit tobacco"]
];

export function PrimaryNavigationSpecimen() {
  return (
    <div className="mega-menu-demo">
      <nav className="menu-bar static-body" data-body="3" aria-label="Primary navigation preview">
        <span className="aha-mark" aria-hidden="true">
          <LivingGradientLayer effect={markGradientEffect} />
        </span>
        <a className="is-active" href="#cards">Health information</a>
        <a href="#calls-to-action">Help and support</a>
        <a href="#action-cards">Get involved</a>
        <a href="#newsletter">About us</a>
        <span className="menu-spacer" />
        <a className="pro-link" href="#guide-navigation">For professionals</a>
        <InteractiveSurface body={1} className="aha-button primary compact" effect={primaryGradientEffect} type="button">Donate</InteractiveSurface>
        <InteractiveSurface body={1} className="search-button" type="button" aria-label="Search"><Icon name="search" /></InteractiveSurface>
        <InteractiveSurface body={1} className="menu-button" type="button" aria-label="Open navigation menu"><Icon name="menu" /></InteractiveSurface>
      </nav>
      <div className="mega-drawer">
        <div className="menu-feature-grid">
          <InteractiveSurface body={2} className="menu-card image-menu-card" type="button">
            <img src={asset("card-friends-health.png")} alt="" />
            <strong>Explore health information</strong>
            <span>Clear guidance for understanding conditions and living well.</span>
          </InteractiveSurface>
          <InteractiveSurface body={2} className="menu-card red-menu-card" effect={persistentGradientEffect} type="button">
            <span className="menu-card-icon"><Icon name="activity" /></span>
            <strong>Take a health assessment</strong>
            <span>Answer a few questions and find a useful place to start.</span>
          </InteractiveSurface>
        </div>
        <div className="menu-link-grid">
          {menuColumns.map(([heading, ...items]) => (
            <div className="menu-column" key={heading}>
              <h3>{heading} <Icon name="chevron-right" /></h3>
              {items.map((item) => <a href="#cards" key={item}>{item}</a>)}
            </div>
          ))}
        </div>
        <div className="emergency-strip static-body" data-body="1">
          <span className="emergency-icon"><Icon name="activity" /></span>
          <span className="emergency-copy"><strong>Know the warning signs</strong><span>Learn when symptoms may need urgent medical attention.</span></span>
          <Icon name="arrow-right" />
        </div>
      </div>
    </div>
  );
}
