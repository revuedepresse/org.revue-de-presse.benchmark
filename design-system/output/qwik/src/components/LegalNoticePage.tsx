import { Fragment, component$, h } from "@builder.io/qwik";

type LegalNoticePageProps = {
  site?: string;
  editor?: string;
  email?: string;
  effectiveAt?: string;
};
export const LegalNoticePage = component$((props: LegalNoticePageProps) => {
  return (
    <article class="rdp-legal-notice">
      <h1>Privacy policy</h1>
      <p>En vigueur au {props.effectiveAt ?? "09/05/25"}</p>
      <p>
        Conformément aux dispositions des Articles 6-III et 19 de la Loi
        n°2004-575 du 21 juin 2004 pour la Confiance dans l'économie numérique,
        dite L.C.E.N., il est porté à la connaissance des utilisateurs et
        visiteurs, ci-après l'« Utilisateur », du site{" "}
        {props.site ?? "revue-de-presse.org"}, ci-après le « Site », les
        présentes mentions légales.
        <br />
        La connexion et la navigation sur le Site par l'Utilisateur implique
        acceptation intégrale et sans réserve des présentes mentions légales.
      </p>
      <h2>ARTICLE 1 – L'ÉDITEUR</h2>
      <p>
        L'édition et la direction de la publication du Site sont assurées par
        {props.editor ?? "Thierry Marianne"}, dont l'adresse e-mail est
        {props.email ?? "contact@revue-de-presse.org"}, ci-après l'« Éditeur ».
      </p>
      <h2>ARTICLE 2 – HÉBERGEURS</h2>
      <p>
        Les hébergeurs du Site sont la société Scaleway (8 rue de la Ville
        l'Évêque, 75008 Paris, +33 (0)1 84 13 00 00) ainsi que la société
        Netlify (44 Montgomery Street, Suite 300, San Francisco, California
        94104), dont l'adresse de support est support@netlify.com.
      </p>
      <h2>ARTICLE 3 – ACCÈS AU SITE</h2>
      <p>
        Le Site est accessible en tout endroit, 7j/7, 24h/24, sauf cas de force
        majeure, interruption programmée ou non pouvant découler d'une nécessité
        de maintenance. En cas de modification, interruption ou suspension du
        Site, l'Éditeur ne saurait être tenu responsable.
      </p>
      <h2>ARTICLE 4 – COLLECTE DES DONNÉES</h2>
      <p>
        Le Site est exempté de déclaration à la Commission Nationale
        Informatique et Libertés (CNIL) dans la mesure où il ne collecte aucune
        donnée concernant les utilisateurs.
      </p>
      <style>{`
        .rdp-legal-notice {
          background: var(--color-white);
          border-radius: var(--radius-default);
          padding: var(--separation-3);
          font-family: 'Roboto', sans-serif;
          color: var(--color-content-text);
        }
        .rdp-legal-notice h1 {
          font-family: 'Signika', sans-serif;
          color: var(--color-brand);
          margin: 0 0 var(--separation-2);
        }
        .rdp-legal-notice h2 {
          font-family: 'Signika', sans-serif;
          color: var(--color-brand);
          font-size: var(--font-size-status-text);
          margin: var(--separation-2) 0 var(--separation-1);
        }
        .rdp-legal-notice p {
          margin: 0 0 var(--separation-2);
          line-height: var(--line-height-base);
        }
      `}</style>
    </article>
  );
});

export default LegalNoticePage;
