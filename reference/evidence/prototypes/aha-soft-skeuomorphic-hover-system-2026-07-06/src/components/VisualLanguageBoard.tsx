import { SpecimenSection } from "./lab/SpecimenSection";
import { CardsSpecimen } from "./specimens/CardsSpecimen";
import { ButtonsSpecimen, FieldsSpecimen, SegmentsSpecimen, SelectionSpecimen, StatusLabelsSpecimen } from "./specimens/ControlSpecimens";
import { DialogSpecimen, DisclosureSpecimen } from "./specimens/DisclosureSpecimens";
import { ActionCardsSpecimen, CallsToActionSpecimen, NewsletterSpecimen } from "./specimens/MessagingSpecimens";
import { ContentTabsSpecimen, GuideNavigationSpecimen, JourneyTabsSpecimen, PrimaryNavigationSpecimen } from "./specimens/NavigationSpecimens";

export function VisualLanguageBoard() {
  return (
    <div className="visual-language-board" aria-label="AHA visual language component specimens">
      <SpecimenSection id="cards"><CardsSpecimen /></SpecimenSection>
      <SpecimenSection id="buttons" size="third"><ButtonsSpecimen /></SpecimenSection>
      <SpecimenSection id="fields" size="third"><FieldsSpecimen /></SpecimenSection>
      <SpecimenSection id="status-labels" size="third"><StatusLabelsSpecimen /></SpecimenSection>
      <SpecimenSection id="journeys"><JourneyTabsSpecimen /></SpecimenSection>
      <SpecimenSection id="selection"><SelectionSpecimen /></SpecimenSection>
      <SpecimenSection id="segments"><SegmentsSpecimen /></SpecimenSection>
      <SpecimenSection id="dialog" size="half"><DialogSpecimen /></SpecimenSection>
      <SpecimenSection id="disclosure" size="half"><DisclosureSpecimen /></SpecimenSection>
      <SpecimenSection id="content-tabs"><ContentTabsSpecimen /></SpecimenSection>
      <SpecimenSection id="calls-to-action"><CallsToActionSpecimen /></SpecimenSection>
      <SpecimenSection id="guide-navigation" size="half"><GuideNavigationSpecimen /></SpecimenSection>
      <SpecimenSection id="newsletter" size="half"><NewsletterSpecimen /></SpecimenSection>
      <SpecimenSection id="primary-navigation"><PrimaryNavigationSpecimen /></SpecimenSection>
      <SpecimenSection id="action-cards"><ActionCardsSpecimen /></SpecimenSection>
    </div>
  );
}
