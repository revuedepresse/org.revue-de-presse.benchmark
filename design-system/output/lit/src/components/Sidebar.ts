import "./SnapshotsList.ts";
import "./Calendar.ts";
import "./BannerAbout.ts";
import "./Footer.ts";
import type { Locale } from "../utils/i18n";

import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators";

type ListItem = {
  id: string;
  label: string;
};
type SidebarProps = {
  lists: ListItem[];
  selectedListId?: string;
  selectedDate: Date;
  yearRange: {
    min: number;
    max: number;
  };
  locale?: Locale;
  onListSelect?: (id: string) => void;
  onDateSelect?: (date: Date) => void;
};

@customElement("my-sidebar")
export default class Sidebar extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property() lists: any;
  @property() selectedListId: any;
  @property() onListSelect: any;
  @property() selectedDate: any;
  @property() locale: any;
  @property() yearRange: any;
  @property() onDateSelect: any;

  render() {
    return html`

          <aside ><snapshots-list  .items=${this.lists}  .selectedId=${
      this.selectedListId
    }  @select=${(id) => this.onListSelect?.(id)} ></snapshots-list>
        <my-calendar  .selectedDate=${this.selectedDate}  .locale=${
      this.locale
    }  .yearRange=${this.yearRange}  @select=${(d) =>
      this.onDateSelect?.(d)} ></my-calendar>
        <banner-about ></banner-about>
        <my-footer ></my-footer>
        <style >${`
              .rdp-sidebar {
                width: 336px;
                display: flex;
                flex-direction: column;
                gap: var(--separation-2);
              }
            `}</style></aside>
        `;
  }
}
