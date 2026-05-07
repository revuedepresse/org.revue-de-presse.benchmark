import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

type ListItem = {
  id: string;
  label: string;
};
type SnapshotsListProps = {
  items: ListItem[];
  selectedId?: string;
  presentation?: "inline" | "sheet";
  onSelect?: (id: string) => void;
  onDismiss?: () => void;
};

import { t } from "../utils/i18n";

@Component({
  selector: "snapshots-list",
  template: `
    <div
      [class]="\`rdp-snapshots-list rdp-snapshots-list--\${presentation ?? 'inline'}\`"
    >
      <ng-container *ngIf="presentation === 'sheet'"
        ><div
          class="rdp-snapshots-list__scrim"
          aria-hidden="true"
          (click)="onDismiss?.()"
        ></div
      ></ng-container>
      <div class="rdp-snapshots-list__panel">
        <header class="rdp-snapshots-list__header">
          <icon name="pick-list" [size]="24" [decorative]="true"></icon>
          <span>{{t('snapshots-list.heading')}}</span>
        </header>
        <ng-container *ngIf="items.length === 0"
          ><p class="rdp-snapshots-list__empty">
            {{t('snapshots-list.empty')}}
          </p></ng-container
        >
        <ng-container *ngIf="items.length > 0"
          ><ol class="rdp-snapshots-list__items" role="listbox">
            <ng-container *ngFor="let item of items; index as index"
              ><li
                role="option"
                [attr.aria-selected]="item.id === selectedId ? 'true' : 'false'"
                [class]="\`rdp-snapshots-list__item\${item.id === selectedId ? ' rdp-snapshots-list__item--selected' : ''}\`"
                (click)="onSelect?.(item.id)"
              >
                <span class="rdp-snapshots-list__item-rank"
                  >{{index + 1}} .</span
                >
                <span
                  class="rdp-snapshots-list__item-label"
                  >{{item.label}}</span
                >
              </li></ng-container
            >
          </ol></ng-container
        >
      </div>
      <style>
        {{\`
                .rdp-snapshots-list {
                  background: var(--color-white);
                  border: 1px solid var(--color-border);
                  border-radius: var(--radius-default);
                  font-family: 'Roboto', sans-serif;
                }
                .rdp-snapshots-list--sheet { position: fixed; inset: 0; display: grid; align-items: end; }
                .rdp-snapshots-list__scrim { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); }
                .rdp-snapshots-list__header {
                  display: flex;
                  align-items: center;
                  gap: var(--separation-1);
                  padding: var(--separation-1) var(--separation-2);
                  background: var(--color-brand);
                  color: var(--color-white);
                  border-radius: var(--radius-default) var(--radius-default) 0 0;
                  font-size: var(--font-size-content);
                }
                .rdp-snapshots-list__items {
                  list-style: none;
                  margin: 0;
                  padding: 0;
                  font-size: var(--font-size-content);
                }
                .rdp-snapshots-list__item {
                  display: flex;
                  gap: var(--separation-1);
                  padding: var(--separation-1) var(--separation-2);
                  border-bottom: 1px solid var(--color-border);
                  color: var(--color-content-text);
                  cursor: pointer;
                }
                .rdp-snapshots-list__item-rank {
                  color: var(--color-brand);
                  font-variant-numeric: tabular-nums;
                  flex-shrink: 0;
                }
                .rdp-snapshots-list__item--selected .rdp-snapshots-list__item-rank {
                  color: var(--color-white);
                }
                .rdp-snapshots-list__item-label { flex: 1; }
                .rdp-snapshots-list__item:last-child { border-bottom: none; }
                .rdp-snapshots-list__item--selected {
                  background: var(--color-brand);
                  color: var(--color-white);
                }
                .rdp-snapshots-list__empty {
                  padding: var(--separation-2);
                  color: var(--color-light-grey);
                  font-size: var(--font-size-content);
                  margin: 0;
                }
              \`}}
      </style>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export default class SnapshotsList {
  t = t;

  @Input() presentation!: SnapshotsListProps["presentation"];
  @Input() onDismiss!: SnapshotsListProps["onDismiss"];
  @Input() items!: SnapshotsListProps["items"];
  @Input() selectedId!: SnapshotsListProps["selectedId"];
  @Input() onSelect!: SnapshotsListProps["onSelect"];
}

@NgModule({
  declarations: [SnapshotsList],
  imports: [CommonModule, IconModule],
  exports: [SnapshotsList],
})
export class SnapshotsListModule {}
