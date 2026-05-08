function SupportPage(props: any) {
  return (
    <>
      <article class="rdp-support-page">
        <h1>Nous soutenir</h1>
        <h2>Projet citoyen, ouvert et libre</h2>
        <p>
          Revue de presse s'appuie sur l'API de Bluesky et relaie des brèves de
          presse en provenance exclusive de médias Français d'après le succès
          rencontré par ses brèves auprès du public.
        </p>
        <p>
          En effet, un classement s'appuyant sur les partages, offre chaque jour
          une visibilité sur 10 publications médias.
        </p>
        <p>
          L'intégralité du code source du projet est proposée sous licence libre
          (GNU General Public License v3.0) et est hébergée par l'organisation «
          Revue de Presse » :
          <br />
          <a
            class="rdp-support-page__external-link"
            href="https://github.com/revuedepresse"
            rel="noreferrer nofollow noopener"
          >
            github.com/revuedepresse
          </a>
        </p>
        <h2>Soyez partie prenante du projet</h2>
        <p>
          <strong>
            Contribuez directement au
            <a href="https://revue-de-presse.org">projet</a>
          </strong>
          en nous offrant de la visibilité autour de vous lorsque vous :
        </p>
        <ul>
          <li>
            vous abonnez à
            <a
              href="https://bsky.app/profile/revue-de-presse.org"
              rel="noreferrer nofollow noopener"
              target="_blank"
            >
              @revue-de-presse.org
            </a>
            sur Bluesky
          </li>
          <li>
            partagez les publications et la mission du projet sur les réseaux
            sociaux
          </li>
          <li>
            nous suggérez de nouveaux médias de la presse française pas encore
            référencés
          </li>
        </ul>
        <style>{`
        .rdp-support-page {
          background: var(--color-white);
          border-radius: var(--radius-default);
          padding: var(--separation-3);
          font-family: 'Roboto', sans-serif;
          color: var(--color-content-text);
        }
        .rdp-support-page h1 {
          font-family: 'Signika', sans-serif;
          color: var(--color-brand);
          margin: 0 0 var(--separation-2);
        }
        .rdp-support-page h2 {
          font-family: 'Signika', sans-serif;
          color: var(--color-brand);
          font-size: var(--font-size-status-text);
          margin: var(--separation-2) 0 var(--separation-1);
        }
        .rdp-support-page p { margin: 0 0 var(--separation-1); }
        .rdp-support-page a { color: var(--color-brand); }
        .rdp-support-page ul { padding-left: var(--separation-3); margin: var(--separation-1) 0; }
        .rdp-support-page li { margin: 0 0 var(--separation-1); }
      `}</style>
      </article>
    </>
  );
}

export default SupportPage;
