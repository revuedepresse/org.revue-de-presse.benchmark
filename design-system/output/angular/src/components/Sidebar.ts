import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

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

import type { Locale } from "../utils/i18n";

@Component({
  selector: "sidebar",
  template: `
    <aside class="rdp-sidebar">
      <snapshots-list
        [items]="lists"
        [selectedId]="selectedListId"
        (select)="onListSelect?.($event)"
      ></snapshots-list>
      <calendar
        [selectedDate]="selectedDate"
        [locale]="locale"
        [yearRange]="yearRange"
        (select)="onDateSelect?.($event)"
      ></calendar>
      <banner-about></banner-about>
      <footer></footer>
      <style>
        {{\`
                .rdp-sidebar {
                  width: 336px;
                  display: flex;
                  flex-direction: column;
                  gap: var(--separation-2);
                }
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
  @Input() lists!: SidebarProps["lists"];
  @Input() selectedListId!: SidebarProps["selectedListId"];
  @Input() onListSelect!: SidebarProps["onListSelect"];
  @Input() selectedDate!: SidebarProps["selectedDate"];
  @Input() locale!: SidebarProps["locale"];
  @Input() yearRange!: SidebarProps["yearRange"];
  @Input() onDateSelect!: SidebarProps["onDateSelect"];
}

@NgModule({
  declarations: [Sidebar],
  imports: [
    CommonModule,
    SnapshotsListModule,
    CalendarModule,
    BannerAboutModule,
    FooterModule,
  ],
  exports: [Sidebar],
})
export class SidebarModule {}
