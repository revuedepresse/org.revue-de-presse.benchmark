/** @jsx h */
import { h, Fragment } from "preact";

type NoticeProps = {
  headlineKey: string;
  bodyKey: string;
  headlineVars?: Record<string, string | number>;
  bodyVars?: Record<string, string | number>;
};
import { t } from "../utils/i18n";

function Notice(props: NoticeProps) {
  return (
    <div className="rdp-notice" role="status">
      <h2 className="rdp-notice__headline">
        {t(props.headlineKey, props.headlineVars)}
      </h2>
      <p className="rdp-notice__body">{t(props.bodyKey, props.bodyVars)}</p>
      <style>{`
        .rdp-notice {
          background: var(--color-white);
          padding: var(--separation-3);
          border-radius: var(--radius-default);
          font-family: 'Roboto', sans-serif;
          color: var(--color-content-text);
          max-width: 360px;
        }
        .rdp-notice__headline {
          margin: 0 0 var(--separation-1);
          font-family: 'Signika', sans-serif;
          font-size: var(--font-size-status-text);
          color: var(--color-vanity-metric-like);
        }
        .rdp-notice__body { margin: 0; font-size: var(--font-size-content); }
      `}</style>
    </div>
  );
}

export default Notice;
