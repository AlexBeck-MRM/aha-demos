import { ahaLogo, cmLogo, mrmLogo } from "../assets";

export function DemoHeader() {
  return (
    <header className="status-bar playground-header" aria-label="Project partners">
      <img className="partner-logo logo-cm" src={cmLogo} alt="Critical Mass" />
      <span className="brand-divider" aria-hidden="true" />
      <img className="partner-logo logo-mrm" src={mrmLogo} alt="MRM" />
      <span className="brand-divider" aria-hidden="true" />
      <img className="partner-logo logo-aha-header" src={ahaLogo} alt="American Heart Association" />
      <a className="playground-back-link" href="../../../../">
        <span aria-hidden="true">←</span>
        <span className="back-link-long">Playground </span>overview
      </a>
    </header>
  );
}
