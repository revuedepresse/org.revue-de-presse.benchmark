import "./Calendar.ts";
import "./BannerAbout.ts";
import type { Locale } from "../utils/i18n";

import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators";

type ListItem = {
  id: string;
  label: string;
};
type SidebarProps = {
  lists?: ListItem[];
  selectedListId?: string;
  selectedDate: Date;
  yearRange: {
    min: number;
    max: number;
  };
  minDate?: Date;
  locale?: Locale;
  onListSelect?: (id: string) => void;
  onDateSelect?: (date: Date) => void;
  onLegalNoticeClick?: () => void;
  onContactClick?: () => void;
  onSupportClick?: () => void;
  onSourcesClick?: () => void;
};

@customElement("my-sidebar")
export default class Sidebar extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property() selectedDate: any;
  @property() locale: any;
  @property() yearRange: any;
  @property() minDate: any;
  @property() onDateSelect: any;
  @property() onLegalNoticeClick: any;
  @property() onContactClick: any;
  @property() onSupportClick: any;
  @property() onSourcesClick: any;

  render() {
    return html`

          <aside ><my-calendar  .selectedDate=${this.selectedDate}  .locale=${
      this.locale
    }  .yearRange=${this.yearRange}  .minDate=${this.minDate}  @select=${(d) =>
      this.onDateSelect?.(d)} ></my-calendar>
        <banner-about  @legalnoticeclick=${(event) =>
          this.onLegalNoticeClick()}  @contactclick=${(event) =>
      this.onContactClick()}  @supportclick=${(event) =>
      this.onSupportClick()}  @sourcesclick=${(event) =>
      this.onSourcesClick()} ></banner-about>
        <style >${`
              .rdp-sidebar {
                width: 336px;
                max-width: 100%;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                gap: var(--separation-2);
                min-width: 0;
              }
              .rdp-sidebar > * { min-width: 0; max-width: 100%; box-sizing: border-box; }
            `}</style></aside>
        `;
  }
}
