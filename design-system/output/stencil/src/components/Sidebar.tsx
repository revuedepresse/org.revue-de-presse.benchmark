import { Calendar } from "./Calendar";
import { BannerAbout } from "./BannerAbout";
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
  @Prop() selectedDate: any;
  @Prop() locale: any;
  @Prop() yearRange: any;
  @Prop() minDate: any;
  @Event() dateSelect: any;
  @Event() legalNoticeClick: any;
  @Event() contactClick: any;
  @Event() supportClick: any;
  @Event() sourcesClick: any;

  componentDidLoad() {}

  render() {
    return (
      <aside class="rdp-sidebar">
        <calendar
          selectedDate={this.selectedDate}
          locale={this.locale}
          yearRange={this.yearRange}
          minDate={this.minDate}
          onSelect={(d) => this.dateSelect?.(d)}
        ></calendar>
        <banner-about
          onLegalNoticeClick={() => this.legalNoticeClick.emit()}
          onContactClick={() => this.contactClick.emit()}
          onSupportClick={() => this.supportClick.emit()}
          onSourcesClick={() => this.sourcesClick.emit()}
        ></banner-about>
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
