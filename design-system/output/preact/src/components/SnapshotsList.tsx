/** @jsx h */
import { h, Fragment } from "preact";

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
import Icon from "./Icon";

function SnapshotsList(props: SnapshotsListProps) {
  return (
    <div
      className={`rdp-snapshots-list rdp-snapshots-list--${
        props.presentation ?? "inline"
      }`}
    >
      {props.presentation === "sheet" ? (
        <div
          className="rdp-snapshots-list__scrim"
          aria-hidden="true"
          onClick={(event) => props.onDismiss?.()}
        />
      ) : null}
      <div className="rdp-snapshots-list__panel">
        <header className="rdp-snapshots-list__header">
          <Icon name="pick-list" size={24} decorative />
          <span>{t("snapshots-list.heading")}</span>
        </header>
        {props.items.length === 0 ? (
          <p className="rdp-snapshots-list__empty">
            {t("snapshots-list.empty")}
          </p>
        ) : null}
        {props.items.length > 0 ? (
          <ul className="rdp-snapshots-list__items" role="listbox">
            {props.items?.map((item) => (
              <li
                role="option"
                aria-selected={item.id === props.selectedId ? "true" : "false"}
                className={`rdp-snapshots-list__item${
                  item.id === props.selectedId
                    ? " rdp-snapshots-list__item--selected"
                    : ""
                }`}
                onClick={(event) => props.onSelect?.(item.id)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <style>{`
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
          background: var(--color-brand-active);
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
          padding: var(--separation-1) var(--separation-2);
          border-bottom: 1px solid var(--color-border);
          color: var(--color-content-text);
          cursor: pointer;
        }
        .rdp-snapshots-list__item:last-child { border-bottom: none; }
        .rdp-snapshots-list__item--selected {
          background: var(--color-brand-active);
          color: var(--color-white);
        }
        .rdp-snapshots-list__empty {
          padding: var(--separation-2);
          color: var(--color-light-grey);
          font-size: var(--font-size-content);
          margin: 0;
        }
      `}</style>
    </div>
  );
}

export default SnapshotsList;
