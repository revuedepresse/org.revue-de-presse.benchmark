import { useStore } from '@builder.io/mitosis';

import { sourcesOf, type SourceRow } from '../utils/sources';

type SourcesPageProps = {
  // Publisher list whose sources are shown; French media when absent.
  listId?: string;
};

export default function SourcesPage(props: SourcesPageProps) {
  const state = useStore({
    get sources() {
      return sourcesOf(props.listId);
    },
    get sortedRoster(): SourceRow[] {
      return sourcesOf(props.listId).roster;
    },
  });

  return (
    <article class="rdp-sources-page">
      <h1>Sources des brèves</h1>
      <p>
        {/* The comma right after the link, with no line break in between: the
            generated Vue template would turn it into a space before the comma. */}
        Les brèves de publications sont&nbsp;
        <a class="rdp-sources-page__internal-link" href="#rdp-sources-page-footnote">triées par popularité</a>, au choix en fin de journée ou à leur première mesure. Elles proviennent des comptes Bluesky
        {/* One expression, and the full stop in its own element after the link:
            the generated Vue template must not put a space before the full stop. */}
        <Show when={!state.sources.originLink}>{state.sources.origin + '.'}</Show>
        <Show when={state.sources.originLink}>
          {state.sources.origin}
          <a
            class="rdp-sources-page__external-link"
            href={state.sources.originLink?.href}
            rel="noreferrer noopener"
            target="_blank"
          >{state.sources.originLink?.label}</a>
          <span>.</span>
        </Show>
      </p>

      <ul class="rdp-sources-page__list" role="list">
        <For each={state.sortedRoster}>
          {(row: SourceRow) => (
            <li class="rdp-sources-page__item">
              <a
                class="rdp-sources-page__row"
                href={`https://bsky.app/profile/${row.handle}`}
                rel="noreferrer nofollow noopener"
                target="_blank"
              >
                <img
                  class="rdp-sources-page__avatar"
                  src={row.avatar}
                  alt=""
                  width="48"
                  height="48"
                  loading="lazy"
                />
                <span class="rdp-sources-page__meta">
                  <span class="rdp-sources-page__name">{row.displayName}</span>
                  <span class="rdp-sources-page__handle">@{row.handle}</span>
                </span>
              </a>
            </li>
          )}
        </For>
      </ul>

      <p id="rdp-sources-page-footnote" class="rdp-sources-page__footnote">
        La popularité est déduite des partages des publications sur Bluesky : « Fin de journée » compte ceux de toute la journée de publication, « Première mesure » ceux relevés à la première collecte de chaque publication.
      </p>
      <style>{`
        .rdp-sources-page {
          background: var(--color-white);
          border-radius: var(--radius-default);
          padding: var(--separation-3);
          font-family: Roboto, sans-serif;
          color: var(--color-content-text);
        }
        .rdp-sources-page h1 {
          font-family: Signika, sans-serif;
          color: var(--color-brand);
          margin: 0 0 var(--separation-2);
        }
        .rdp-sources-page p { margin: 0 0 var(--separation-1); }
        .rdp-sources-page__internal-link,
        .rdp-sources-page__external-link { color: var(--color-brand); }

        .rdp-sources-page__list {
          list-style: none;
          padding: 0;
          margin: var(--separation-2) 0;
          display: flex;
          flex-direction: column;
          gap: var(--separation-1);
        }
        .rdp-sources-page__row {
          display: flex;
          align-items: center;
          gap: var(--separation-1);
          padding: var(--separation-2);
          background: var(--color-white);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-default);
          text-decoration: none;
          color: inherit;
          cursor: pointer;
          transition: background-color 120ms ease-in-out;
        }
        .rdp-sources-page__row:hover,
        .rdp-sources-page__row:focus-visible {
          background: var(--color-taupe-grey);
        }
        .rdp-sources-page__avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--color-light-grey);
          object-fit: cover;
          flex-shrink: 0;
        }
        .rdp-sources-page__meta {
          display: flex;
          flex-direction: column;
          gap: var(--separation-0);
          min-width: 0;
        }
        .rdp-sources-page__name {
          font-weight: 700;
          font-size: var(--font-size-status-text);
          color: var(--color-content-text);
          line-height: 1.2;
        }
        .rdp-sources-page__handle {
          font-size: var(--font-size-publication-date);
          color: var(--color-light-grey);
        }

        .rdp-sources-page__footnote {
          font-size: var(--font-size-publication-date);
          color: var(--color-light-grey);
          border-top: 1px solid var(--color-border);
          padding-top: var(--separation-1);
          margin-top: var(--separation-2);
        }
      `}</style>
    </article>
  );
}
