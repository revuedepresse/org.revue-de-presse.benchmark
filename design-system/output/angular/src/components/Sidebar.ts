import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Output, EventEmitter, Component, Input } from "@angular/core";

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
  locale?: Locale;
  onListSelect?: (id: string) => void;
  onDateSelect?: (date: Date) => void;
  onLegalNoticeClick?: () => void;
  onContactClick?: () => void;
  onSupportClick?: () => void;
  onSourcesClick?: () => void;
};

import type { Locale } from "../utils/i18n";

@Component({
  selector: "sidebar",
  template: `
    <aside class="rdp-sidebar">
      <calendar
        [selectedDate]="selectedDate"
        [locale]="locale"
        [yearRange]="yearRange"
        (select)="onDateSelect?.($event)"
      ></calendar>
      <banner-about
        (legalNoticeClick)="this.onLegalNoticeClick.emit()"
        (contactClick)="this.onContactClick.emit()"
        (supportClick)="this.onSupportClick.emit()"
        (sourcesClick)="this.onSourcesClick.emit()"
      ></banner-about>
      <style>
        {{\`
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
              \`}}
      </style>
    </aside>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export default class Sidebar {
  @Input() selectedDate!: SidebarProps["selectedDate"];
  @Input() locale!: SidebarProps["locale"];
  @Input() yearRange!: SidebarProps["yearRange"];
  @Input() onDateSelect!: SidebarProps["onDateSelect"];
  @Output() onLegalNoticeClick = new EventEmitter<any>();
  @Output() onContactClick = new EventEmitter<any>();
  @Output() onSupportClick = new EventEmitter<any>();
  @Output() onSourcesClick = new EventEmitter<any>();
}

@NgModule({
  declarations: [Sidebar],
  imports: [CommonModule, CalendarModule, BannerAboutModule],
  exports: [Sidebar],
})
export class SidebarModule {}
