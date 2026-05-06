import { t } from "../utils/i18n";

import { Component, h, Fragment, Prop } from "@stencil/core";

@Component({
  tag: "notice",
})
export class Notice {
  @Prop() headlineKey: any;
  @Prop() headlineVars: any;
  @Prop() bodyKey: any;
  @Prop() bodyVars: any;

  componentDidLoad() {}

  render() {
    return (
      <div class="rdp-notice" role="status">
        <h2 class="rdp-notice__headline">
          {t(this.headlineKey, this.headlineVars)}
        </h2>
        <p class="rdp-notice__body">{t(this.bodyKey, this.bodyVars)}</p>
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
}
