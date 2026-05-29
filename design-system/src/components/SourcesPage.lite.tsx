import { useStore } from '@builder.io/mitosis';

// Canonical roster of French press Bluesky accounts. Same handles, display
// names, and Bluesky CDN avatar URLs as the upstream API (resolved once via
// public.api.bsky.app/xrpc/app.bsky.actor.getProfile; CDN URLs are stable
// because they include the content hash).
type SourceRow = {
  handle: string;
  displayName: string;
  avatar: string;
};

const ROSTER: SourceRow[] = [
  { handle: 'afp.com', displayName: 'Agence France-Presse', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:ffccycfh6c6pmxwkhvq5clkv/bafkreiadcsh7hzzurk5joh7bhxxlyqlvr26mg25f6dnozuwhsz72jz2cme' },
  { handle: 'bfmtv.com', displayName: 'BFMTV', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:wb4ovhhcrif6cp66oe2pqx7i/bafkreic3fjfw4c2hbqailogxb2nusnspddwczt5bhyib3enp5qxl5bslla' },
  { handle: 'blast-info.fr', displayName: 'Blast le souffle de l’info', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:omtqqkwusnfvxos7pxvl4fgo/bafkreicuchhqcsd4zzhtp3rhrkgtfl2nhqbmxlfmpfar2sqs7fe4v2xt2a' },
  { handle: 'challengesfr.bsky.social', displayName: 'Challenges', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:56yk6cagxatjj2k4eh5cobpo/bafkreiav6xfv33jsusr7jkuukpzwwdoolsrmbmpjjtjgyrulh7zxffeuxa' },
  { handle: 'charliehebdo.fr', displayName: 'Charlie Hebdo', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:vm2tsoixg7vsygrolxd4rrho/bafkreibtzaftgx54wwclo7ocd6skgozsbx7jq5m7vyetmkpubyijdhzgf4' },
  { handle: 'courrierinter.bsky.social', displayName: 'Courrier international', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:kfygevef2pjjsyu7dfd6xpxi/bafkreidtpw344uym7ilh7mghqhjcdcvvzrhjfi2ovdzp4ag44wrd63vwqq' },
  { handle: 'franceculture.fr', displayName: 'France Culture', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:3qyubes27sne6inqymxi4b4j/bafkreihuf64adii44g3ero2j7mg43kdkvx5bjls4zjhumlmhtqxjnu6yya' },
  { handle: 'france24.com', displayName: 'FRANCE 24', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:wkreszch2k4mumsrlkeaflgn/bafkreibi3cdxrcwhr5togn3dtgihmtfmwx5u4fbydp767yxcvmo5jgbq7q' },
  { handle: 'humanite.fr', displayName: "l'Humanité", avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:vaats7pht5zoubxm6zaxq2zd/bafkreic27fcpk46xd5cgwxiqvgljb7lzdcb3rlqklyysq25omum4uy635a' },
  { handle: 'la-croix.com', displayName: 'La Croix', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:lv3e3gevfzmjvjcauffv4sjp/bafkreibuj6usfwybcc44gpjs3uxps3ksswdf6uwklm3tqoi3irnkmhq4ue' },
  { handle: 'lavoixdunord.fr', displayName: 'La Voix du Nord', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:5gboqophxgbh7htucfhyt5gb/bafkreihzviidt3sw6du4gs3c2jasyys244xo45uiqjsjywahc44tp3lfnm' },
  { handle: 'lefigaro.fr', displayName: 'Le Figaro', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:znu3bmhx5mx2icucilix5rpa/bafkreibrqh3inyl7cmhttheihnjznawqxo62v2k5x7ukwc3xgkvh72w4aq' },
  { handle: 'lecanardenchaine.fr', displayName: 'Le Canard enchaîné', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:uj54w5cel35z7qy3hk5zch4h/bafkreiawjxozxdvoarzasmvyiqku7ctsoqbwwpjcqahv5fyurttltmuvne' },
  { handle: 'lemonde.fr', displayName: 'Le Monde', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:qqxqxgdu5z3he2piqfbfaku4/bafkreiazagcb2d7ivnvgoqjufff3cbpjyj43jtxvyrqzulk5lrro7cemgm' },
  { handle: 'afrique.lemonde.fr', displayName: 'Le Monde Afrique', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:ggiopaobxfyknqlltcxddbmi/bafkreib65oh7hvdopn3kuqiul4ohuxhmfxvfdq6riuk42l3zi7h2mevc2a' },
  { handle: 'lepoint.fr', displayName: 'Le Point', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:aixwsdaeubfrxedelxe7rqwq/bafkreidcnybv5hzc3euw26cpxmodam6y3qsf5w6imxh6asax43a4mgrcoq' },
  { handle: 'lesechosfr.bsky.social', displayName: 'Les Echos', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:tuwg4bd73p5m7jrrmjhl2jix/bafkreidrfm5ta35ybp77vfda5jmrmlnug4yyt7le2ml37zp2qszxze55be' },
  { handle: 'lesjours.fr', displayName: 'Les Jours', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:fleaqu2yloy5vpnb3wamdp6m/bafkreiej5h2k73ts367cfdfvvljq3tznrndw4nfrm723uv7efp3kiowur4' },
  { handle: 'liberation.fr', displayName: 'Libération', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:uo4didwt5qe4onrscbmqwvwm/bafkreie5puv24c5xxzh2y2ovf3jnjlhtn3w5iprb4lz2scmfxtc2t2eebu' },
  { handle: 'mediapart.fr', displayName: 'Mediapart', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:2egpzsea27fru2vkrjgdw2ob/bafkreiell2vpjxbrvddt63enj7jd2rwqzl47ivryhyetxbpqxpk3tuppjq' },
  { handle: 'monde-diplomatique.fr', displayName: 'Le Monde diplomatique', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:q4q2hko2prboin62shrck5ix/bafkreidg3zq3cnbnrytsaxoemy6gtapydmpaykzs3symq4z63cbvmk4ggi' },
  { handle: 'nouvelobs.com', displayName: 'Le Nouvel Obs', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:xhye77kvlv7vddwpapebsljj/bafkreicpzhgen5w56sqx33jsnswsjxdtd7yuivwslmsa7knbcftslegjym' },
  { handle: 'ouest-france.fr', displayName: 'Ouest-France', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:p7gdpofkiswapwrhfos7nqqd/bafkreifq5hzqrfqo7gmhw7x4dtr7qx6hvm3guydiznszhjwerpd3b3z5fa' },
  { handle: 'pixelsfr.bsky.social', displayName: 'Pixels | Le Monde', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:ug64elynwv5wsbg6cgr75hc3/bafkreievkg4gk2o65zpv3nb7ioxvifrh4kngwiidew4p7ddx7awtajborq' },
  { handle: 'rfi.fr', displayName: 'RFI', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:vvlpfarso2eojm2xpzc7qrd7/bafkreiblpeqcmcska4t5jux5uiipvsmwci4xvffthimktqbphseggv72v4' },
  { handle: 'telerama.bsky.social', displayName: 'Télérama', avatar: 'https://cdn.bsky.app/img/avatar/plain/did:plc:d4mzml4o35ineocvaluv5vss/bafkreibwv7t72coic6z2zrfprda7onuesrw7xcjq2fsbpwagkez57xbvyy' },
];

export default function SourcesPage() {
  const state = useStore({
    get sortedRoster(): SourceRow[] {
      return [...ROSTER].sort((a, b) =>
        a.displayName.localeCompare(b.displayName, 'fr', { sensitivity: 'base' })
      );
    },
  });

  return (
    <article class="rdp-sources-page">
      <h1>Sources des brèves</h1>
      <p>
        Les sources des brèves de publications{' '}
        <a class="rdp-sources-page__internal-link" href="#rdp-sources-page-footnote">
          triées par popularité
        </a>{' '}
        en fin de chaque journée proviennent des comptes Bluesky de médias Français.
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
        La popularité est déduite des partages des publications depuis Bluesky.
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
        .rdp-sources-page__internal-link { color: var(--color-brand); }

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
