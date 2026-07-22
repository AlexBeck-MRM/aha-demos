import ahaLogo from "../../../../../../assets/aha-logo.png";
import cmLogo from "../../../../../../assets/playground-launcher/cm-logo.webp";
import mrmLogo from "../../../../../../assets/playground-launcher/mrm-logo.svg";
import { visualLanguageConfig } from "../../config/visualLanguage";

export function LabHeader() {
  return (
    <>
      <header className="playground-header" aria-label="Project partners">
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
      <nav className="lab-index" aria-label="Component index">
        <a className="lab-index-brand" href="#top">
          <strong>{visualLanguageConfig.lab.title}</strong>
          <span>{visualLanguageConfig.lab.status}</span>
        </a>
        <div className="lab-index-links">
          {visualLanguageConfig.navigation.map((item) => (
            <a href={`#${item.target}`} key={item.target}>{item.label}</a>
          ))}
        </div>
      </nav>
    </>
  );
}
