import { Icon } from "../Icon";
import { InteractiveSurface } from "../InteractiveSurface";
import { usePreviewState } from "../lab/PreviewStateContext";
import { asset, primaryGradientEffect } from "./shared";

export function CallsToActionSpecimen() {
  const previewState = usePreviewState();
  return (
    <div className="cta-stack">
      <article className="inline-cta-card static-body has-image" data-body="2">
        <img src={asset("inline-cta-update.png")} alt="" />
        <div>
          <span className="eyebrow">Know your numbers</span>
          <strong>Understanding your blood pressure is a powerful first step</strong>
          <span>Learn what the numbers mean and how to measure accurately at home.</span>
          <div className="inline-cta-actions">
            <InteractiveSurface body={1} className="aha-button secondary compact" type="button">Learn more</InteractiveSurface>
            <InteractiveSurface body={1} className="aha-button primary compact" effect={primaryGradientEffect} type="button">Check your numbers<Icon name="activity" /></InteractiveSurface>
          </div>
        </div>
      </article>
      <article className="inline-cta-card static-body" data-body="2">
        <span className="eyebrow">Stay informed</span>
        <strong>Heart-health guidance, when it is useful</strong>
        <span>Choose the topics you care about and we’ll send practical updates.</span>
        <label className="subscribe-inline">
          <span>Email address</span>
          <span className="field-shell interactive" data-body="1" data-preview-state={previewState}>
            <span className="material-layer" aria-hidden="true" />
            <span className="content-layer field-content"><Icon name="mail" /><input placeholder="you@example.com" disabled={previewState === "disabled"} /></span>
          </span>
          <InteractiveSurface body={1} className="aha-button primary compact" effect={primaryGradientEffect} type="button">Sign up</InteractiveSurface>
        </label>
      </article>
      <article className="inline-cta-card static-body" data-body="2">
        <span className="eyebrow">Your guide</span>
        <strong>Your blood pressure guide is ready</strong>
        <span>Keep a copy nearby or share it with someone who supports you.</span>
        <div className="receipt-row">
          <span className="pdf-icon"><Icon name="book-open" /></span>
          <span><strong>Blood_pressure_guide.pdf</strong><small>PDF · 1.2 MB</small></span>
          <InteractiveSurface body={1} className="aha-button secondary compact" type="button">Download<Icon name="download" /></InteractiveSurface>
          <InteractiveSurface body={1} className="aha-button primary compact" effect={primaryGradientEffect} type="button">Open guide<Icon name="book-open" /></InteractiveSurface>
        </div>
      </article>
      <div className="support-banner static-body" data-body="2">
        <div><strong>Still have questions?</strong><span>Find clear guidance or talk with someone who can help.</span></div>
        <InteractiveSurface body={1} className="aha-button primary compact" effect={primaryGradientEffect} type="button">Find support<Icon name="arrow-right" /></InteractiveSurface>
      </div>
    </div>
  );
}

export function NewsletterSpecimen() {
  const previewState = usePreviewState();
  return (
    <article className="subscribe-card static-body" data-body="2">
      <span className="subscribe-icon"><Icon name="heart" /></span>
      <div><strong>Heart-health updates</strong><span>Practical ideas, trusted information and stories to help you take the next step.</span></div>
      <label className="newsletter-field">
        <span className="field-shell interactive" data-body="1" data-preview-state={previewState}>
          <span className="material-layer" aria-hidden="true" />
          <span className="content-layer field-content"><Icon name="mail" /><input placeholder="Email address" disabled={previewState === "disabled"} /></span>
        </span>
        <small>By signing up, you agree to our privacy policy.</small>
      </label>
      <InteractiveSurface body={1} className="aha-button primary subscribe-button" effect={primaryGradientEffect} type="button">Sign up for updates</InteractiveSurface>
    </article>
  );
}

export function ActionCardsSpecimen() {
  return (
    <div className="action-card-stack">
      <InteractiveSurface body={2} className="mini-action-card" type="button">
        <span className="mini-action-icon"><Icon name="activity" /></span>
        <span><strong>Check your blood pressure</strong><small>Learn how to measure and record your readings.</small></span>
        <Icon name="chevron-right" />
      </InteractiveSurface>
      <InteractiveSurface body={2} className="mini-action-card" type="button">
        <span className="mini-action-icon"><Icon name="heart" /></span>
        <span><strong>Build a heart-healthy habit</strong><small>Choose one small step that feels realistic today.</small></span>
        <Icon name="chevron-right" />
      </InteractiveSurface>
    </div>
  );
}
