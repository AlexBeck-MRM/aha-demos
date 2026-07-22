import type { CSSProperties } from "react";
import { Icon } from "../Icon";
import { InteractiveSurface } from "../InteractiveSurface";
import { imageStyle } from "./shared";

function FeatureCard() {
  return (
    <InteractiveSurface
      body={2}
      className="feature-card"
      style={imageStyle("card-feature-marcus.png")}
      media={<span className="image-fill" />}
      type="button"
    >
      <span className="feature-badge">High blood pressure</span>
      <span className="feature-copy">
        <span>Marcus, 58</span>
        <strong>“I was ready to stop. Then we changed the plan.”</strong>
        <span>See how Marcus found a simpler way to keep track of his readings and daily routine.</span>
      </span>
      <span className="feature-action" aria-hidden="true"><Icon name="chevron-right" /></span>
    </InteractiveSurface>
  );
}

type ImageCardProps = {
  image: string;
  eyebrow: string;
  title: string;
  body: string;
  tone: string;
};

function ImageCard({ image, eyebrow, title, body, tone }: ImageCardProps) {
  const style = imageStyle(image, { "--card-gradient-tone": tone } as CSSProperties);

  return (
    <div className="image-card-specimen">
      <span className="variant-label">{eyebrow}</span>
      <InteractiveSurface body={2} className="image-instance-card" style={style} media={<span className="image-fill" />} type="button">
        <span className="card-footer">
          <span className="card-copy">
            <strong>{title}</strong>
            <span>{body}</span>
          </span>
          <span className="card-action" aria-hidden="true"><Icon name="chevron-right" /></span>
        </span>
      </InteractiveSurface>
    </div>
  );
}

export function CardsSpecimen() {
  return (
    <div className="cards-showcase">
      <FeatureCard />
      <div className="image-card-row">
        <ImageCard
          image="card-friends-health.png"
          eyebrow="Warm lifestyle crop"
          title="Build healthier habits together"
          body="Small changes can feel easier with someone beside you."
          tone="#54392b"
        />
        <ImageCard
          image="card-mindful-listening.png"
          eyebrow="Quiet portrait crop"
          title="Make space for calm"
          body="Find simple ways to support sleep, stress and heart health."
          tone="#1d2717"
        />
        <ImageCard
          image="card-build-healthier-habits.png"
          eyebrow="Open-sky activity crop"
          title="Move more, your way"
          body="Choose activities that fit your life and build from there."
          tone="#443831"
        />
      </div>
    </div>
  );
}
