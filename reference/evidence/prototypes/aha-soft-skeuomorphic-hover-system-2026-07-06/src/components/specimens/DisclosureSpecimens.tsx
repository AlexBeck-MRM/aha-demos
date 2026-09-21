import { useState } from "react";
import { Icon } from "../Icon";
import { InteractiveSurface } from "../InteractiveSurface";
import { usePreviewState } from "../lab/PreviewStateContext";
import { persistentGradientEffect } from "./shared";

export function DialogSpecimen() {
  return (
    <InteractiveSurface as="div" body={3} className="modal-preview-card" effect={persistentGradientEffect} previewStateOverride="rest" aria-label="Health plan confirmation preview">
      <div className="modal-topline">
        <span className="success-icon"><Icon name="check" /></span>
      </div>
      <div className="modal-copy">
        <strong>Your heart-health plan is ready</strong>
        <span>We’ve brought your selected topics and next steps together in one place.</span>
      </div>
      <div className="modal-actions">
        <InteractiveSurface body="flat" className="aha-button ghost compact" type="button">Not now</InteractiveSurface>
        <InteractiveSurface body={1} className="aha-button secondary compact" type="button">View my plan</InteractiveSurface>
      </div>
    </InteractiveSurface>
  );
}

const questions = [
  { id: "reading", question: "What do my blood pressure numbers mean?", answer: "Your readings can help you and your healthcare professional understand patterns over time. Keep a record and bring it to your next conversation." },
  { id: "check", question: "How often should I check my blood pressure?", answer: "Your healthcare professional can help you decide what is right for you. If you monitor at home, try to measure at the same times and in the same way." },
  { id: "prepare", question: "How can I prepare for an appointment?", answer: "Bring your readings, medicines and questions. Writing things down beforehand can make the conversation feel easier." },
  { id: "support", question: "Where can I find more support?", answer: "Explore practical guides, local programmes and stories from people managing similar health concerns." }
];

export function DisclosureSpecimen() {
  const [inlineOpen, setInlineOpen] = useState(false);
  const [openRow, setOpenRow] = useState<string | null>(questions[0].id);
  const previewState = usePreviewState();
  const previewTarget = questions.find((question) => question.id !== openRow)?.id;
  return (
    <div className="accordion-stack">
      <div className="static-body" data-body="1">
        <InteractiveSurface body="flat" className={`accordion-inline ${inlineOpen ? "is-expanded" : ""}`} type="button" aria-expanded={inlineOpen} aria-controls="reading-detail" onClick={() => setInlineOpen((value) => !value)}>
          <Icon name="plus" /><span>Why tracking readings can help</span>
        </InteractiveSurface>
        <div className={`accordion-inline-panel ${inlineOpen ? "is-open" : ""}`} id="reading-detail" aria-hidden={!inlineOpen} inert={!inlineOpen}>
          <p>A simple record can make patterns easier to see and gives you something concrete to discuss with your healthcare professional.</p>
        </div>
      </div>
      <div className="accordion-group static-body" data-body="1">
        {questions.map((item) => {
          const open = openRow === item.id;
          const triggerId = `accordion-trigger-${item.id}`;
          const panelId = `accordion-panel-${item.id}`;
          return (
            <div className={`accordion-item ${open ? "is-expanded" : ""}`} key={item.id}>
              <InteractiveSurface
                body="flat"
                className="accordion-row"
                type="button"
                id={triggerId}
                aria-expanded={open}
                aria-controls={panelId}
                previewStateOverride={item.id === previewTarget ? previewState : "rest"}
                onClick={() => setOpenRow(open ? null : item.id)}
              >
                <strong>{item.question}</strong><Icon name="chevron" />
              </InteractiveSurface>
              <div className="accordion-answer" id={panelId} role="region" aria-labelledby={triggerId} aria-hidden={!open} inert={!open}>
                <p>{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
