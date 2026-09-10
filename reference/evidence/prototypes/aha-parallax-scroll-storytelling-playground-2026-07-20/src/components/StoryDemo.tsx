import {
  ForegroundSection,
  ParallaxBackdropSection,
  ParallaxImageSection,
  ScrollRevealGroup,
  ScrollRevealTitle,
  SpatialScrollStory,
  type SpatialMotionSettings,
} from "../../../../../components/SpatialScrollStory";
import { Icon, type IconName } from "../../../aha-soft-skeuomorphic-hover-system-2026-07-06/src/components/Icon";
import { InteractiveSurface } from "../../../aha-soft-skeuomorphic-hover-system-2026-07-06/src/components/InteractiveSurface";
import { primaryGradientEffect } from "../../../aha-soft-skeuomorphic-hover-system-2026-07-06/src/components/specimens/shared";
import { ahaHeartTorch, marcusImage, volunteerImage } from "../assets";
import { LivingShaderBackdrop } from "./LivingShaderBackdrop";

type StoryDemoProps = {
  settings: SpatialMotionSettings;
  reducedMotionPreview: boolean;
  showLayerLabels: boolean;
};

type SurfaceStoryBlockProps = {
  id: string;
  lines: Array<{ text: string; accent?: boolean }>;
  body: string;
  action?: React.ReactNode;
};

function SurfaceStoryBlock({ id, lines, body, action }: SurfaceStoryBlockProps) {
  return (
    <div className="surface-story-block" id={id}>
      <ScrollRevealTitle
        className="surface-title"
        tone="surface"
        lines={lines}
      />
      <ScrollRevealGroup className="surface-support">
        <p>{body}</p>
        {action}
      </ScrollRevealGroup>
    </div>
  );
}

function StoryAction({
  href,
  children,
  icon,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  icon?: IconName;
  variant?: "primary" | "secondary";
}) {
  return (
    <InteractiveSurface
      as="a"
      body={1}
      className={`aha-button ${variant}`}
      effect={variant === "primary" ? primaryGradientEffect : undefined}
      href={href}
    >
      <span>{children}</span>
      {icon ? <Icon name={icon} /> : null}
    </InteractiveSurface>
  );
}

export function StoryDemo({ settings, reducedMotionPreview, showLayerLabels }: StoryDemoProps) {
  // Keep the varied story actions explicit. A data renderer would obscure semantic markup and
  // add a content schema even though the reusable behavior already lives in the primitives.
  return (
    <SpatialScrollStory
      settings={settings}
      forceReducedMotion={reducedMotionPreview}
      showLayerLabels={showLayerLabels}
    >
      <ParallaxImageSection
        aria-label="AHA impact story"
        src={volunteerImage}
        focalPoint={{ x: 0.69, y: 0.42 }}
        priority
      >
        <div className="hero-lockup">
          <ScrollRevealGroup className="brand-mark-wrap" delay={0}>
            <img className="brand-mark brand-mark-inverse" src={ahaHeartTorch} alt="American Heart Association symbol" />
          </ScrollRevealGroup>
          <ScrollRevealTitle
            as="h1"
            className="display-title"
            tone="image"
            lines={[
              { text: "A relentless" },
              { text: "force for a" },
              { text: "world of longer," },
              { text: "healthier lives" },
            ]}
          />
          <ScrollRevealGroup className="hero-action">
            <StoryAction href="#community" icon="arrow-right">Learn more</StoryAction>
          </ScrollRevealGroup>
        </div>
      </ParallaxImageSection>

      <ForegroundSection aria-label="Community story">
        <SurfaceStoryBlock
          id="community"
          lines={[{ text: "In your" }, { text: "community", accent: true }]}
          body="Local events, stories, and support for better health."
          action={<StoryAction href="#guidance" icon="arrow-right">Find support</StoryAction>}
        />
      </ForegroundSection>

      <ParallaxBackdropSection
        id="spatial-reveal"
        aria-label="Everyday wellbeing story on the AHA living red shader"
        backdrop={<LivingShaderBackdrop />}
        shade={false}
      >
        <div className="hero-lockup hero-lockup-wide">
          <ScrollRevealTitle
            className="display-title"
            tone="image"
            lines={[
              { text: "Small moments" },
              { text: "can strengthen" },
              { text: "every day" },
            ]}
          />
          <ScrollRevealGroup className="backdrop-support">
            <p>Find one small step that works for you.</p>
          </ScrollRevealGroup>
        </div>
      </ParallaxBackdropSection>

      <ForegroundSection className="surface-background-secondary" aria-label="Guidance story">
        <SurfaceStoryBlock
          id="guidance"
          lines={[{ text: "Support for" }, { text: "the next step", accent: true }]}
          body="Clear guidance should meet you where you are and help you move with confidence."
          action={<StoryAction href="#forward" icon="book-open" variant="secondary">Open guide</StoryAction>}
        />
      </ForegroundSection>

      <ParallaxImageSection
        aria-label="Living well story"
        src={marcusImage}
        focalPoint={{ x: 0.46, y: 0.45 }}
      >
        <div className="hero-lockup hero-lockup-wide">
          <ScrollRevealTitle
            className="display-title"
            tone="image"
            lines={[
              { text: "Life is why" },
              { text: "we keep moving" },
              { text: "forward" },
            ]}
          />
        </div>
      </ParallaxImageSection>

      <ForegroundSection aria-label="Prevention story">
        <SurfaceStoryBlock
          id="forward"
          lines={[{ text: "Know your heart." }, { text: "Shape your future.", accent: true }]}
          body="Understanding your numbers can turn useful information into a healthier next action."
          action={<StoryAction href="#top" icon="heart">Check heart health</StoryAction>}
        />
      </ForegroundSection>
    </SpatialScrollStory>
  );
}
