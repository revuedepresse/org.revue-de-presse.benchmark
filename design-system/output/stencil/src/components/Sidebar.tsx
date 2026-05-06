import { SnapshotsList } from "./SnapshotsList";
import { Calendar } from "./Calendar";
import { BannerAbout } from "./BannerAbout";
import { Footer } from "./Footer";
import type { Locale } from "../utils/i18n";

import {
  Component,
  h,
  Fragment,
  Event,
  EventEmitter,
  Prop,
} from "@stencil/core";

@Component({
  tag: "sidebar",
})
export class Sidebar {
  @Prop() lists: any;
  @Prop() selectedListId: any;
  @Event() listSelect: any;
  @Prop() selectedDate: any;
  @Prop() locale: any;
  @Prop() yearRange: any;
  @Event() dateSelect: any;

  componentDidLoad() {}

  render() {
    return (
      <aside class="rdp-sidebar">
        <snapshots-list
          items={this.lists}
          selectedId={this.selectedListId}
          onSelect={(id) => this.listSelect?.(id)}
        ></snapshots-list>
        <calendar
          selectedDate={this.selectedDate}
          locale={this.locale}
          yearRange={this.yearRange}
          onSelect={(d) => this.dateSelect?.(d)}
        ></calendar>
        <banner-about></banner-about>
        <footer></footer>
        <style>{`
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
      `}</style>
      </aside>
    );
  }
}
