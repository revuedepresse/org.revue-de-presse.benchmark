import * as React from "react";

type LegalNoticePageProps = {
  site?: string;
  editor?: string;
  email?: string;
  effectiveAt?: string;
};

function LegalNoticePage(props: LegalNoticePageProps) {
  return (
    <article className="rdp-legal-notice">
      <h1>Privacy policy</h1>
      <p>En vigueur au {props.effectiveAt ?? "09/05/25"}</p>
      <p>
        Conformément aux dispositions des Articles 6-III et 19 de la Loi
        n°2004-575 du 21 juin 2004 pour la Confiance dans l'économie numérique,
        dite L.C.E.N., il est porté à la connaissance des utilisateurs et
        visiteurs, ci-après l'«&nbsp;Utilisateur&nbsp;», du site{" "}
        {props.site ?? "revue-de-presse.org"}, ci-après le «&nbsp;Site&nbsp;»,
        les présentes mentions légales.
        <br />
        La connexion et la navigation sur le Site par l'Utilisateur implique
        acceptation intégrale et sans réserve des présentes mentions légales.{" "}
      </p>
      <h2>ARTICLE 1 – L'ÉDITEUR</h2>
      <p>
        L'édition et la direction de la publication du Site sont assurées par
        {props.editor ?? "Thierry Marianne"}, dont l'adresse e-mail est
        {props.email ?? "contact@revue-de-presse.org"}, ci-après
        l'«&nbsp;Éditeur&nbsp;».{" "}
      </p>
      <h2>ARTICLE 2 – HÉBERGEURS</h2>
      <p>
        {" "}
        Les hébergeurs du Site sont la société Scaleway (8 rue de la Ville
        l'Évêque, 75008 Paris, +33 (0)1 84 13 00 00) ainsi que la société
        Netlify (44 Montgomery Street, Suite 300, San Francisco, California
        94104), dont l'adresse de support est support@netlify.com.{" "}
      </p>
      <h2>ARTICLE 3 – ACCÈS AU SITE</h2>
      <p>
        {" "}
        Le Site est accessible en tout endroit, 7j/7, 24h/24, sauf cas de force
        majeure, interruption programmée ou non pouvant découler d'une nécessité
        de maintenance. En cas de modification, interruption ou suspension du
        Site, l'Éditeur ne saurait être tenu responsable.{" "}
      </p>
      <h2>ARTICLE 4 – COLLECTE DES DONNÉES</h2>
      <p>
        {" "}
        Le Site est exempté de déclaration à la Commission Nationale
        Informatique et Libertés (CNIL) dans la mesure où il ne collecte aucune
        donnée concernant les utilisateurs.{" "}
      </p>
      <h2 id="cgu">
        ARTICLE 5 – CONDITIONS GÉNÉRALES D'UTILISATION DU SERVICE DE DISCUSSION
      </h2>
      <p>
        Le Site propose un service de discussion (l'«&nbsp;Assistant&nbsp;»)
        permettant à l'Utilisateur de poser des questions en langage naturel sur
        la revue de presse archivée. L'accès au service est réservé aux
        personnes ayant un compte Bluesky actif. La connexion est réalisée via
        le protocole OAuth de l'AT&nbsp;Protocol et ne donne au Site accès qu'à
        l'identifiant décentralisé (DID) du compte&nbsp;; aucun mot de passe
        n'est transmis au Site.{" "}
      </p>
      <p>
        {" "}
        L'Utilisateur s'engage à utiliser l'Assistant de bonne foi, à des fins
        d'information personnelle. Sont notamment interdits&nbsp;: les
        tentatives de contournement des quotas d'usage, l'envoi automatisé de
        requêtes, la sollicitation de contenus illicites, diffamatoires, haineux
        ou portant atteinte aux droits de tiers. L'Éditeur se réserve le droit
        de suspendre l'accès en cas d'usage manifestement abusif, sans préavis.
      </p>
      <p>
        Les réponses de l'Assistant sont générées par un modèle de langage et
        peuvent comporter des erreurs ou des omissions. Elles ne constituent ni
        un avis journalistique ni un conseil professionnel et ne sauraient
        engager la responsabilité de l'Éditeur. Chaque affirmation est citée par
        un numéro renvoyant à la publication source d'origine&nbsp;;
        l'Utilisateur est invité à consulter ces sources avant toute reprise.
      </p>
      <h2 id="confidentialite">
        ARTICLE 6 – DONNÉES PERSONNELLES &amp; CONFIDENTIALITÉ
      </h2>
      <p>
        Lorsque l'Utilisateur se connecte au service de discussion, le Site
        collecte et conserve les données suivantes&nbsp;:{" "}
      </p>
      <ul>
        <li>
          {" "}
          son identifiant décentralisé Bluesky (DID) et, à titre indicatif, son
          handle public, conservés pour la durée de la session (30&nbsp;jours
          maximum)&nbsp;;{" "}
        </li>
        <li>
          {" "}
          l'historique des conversations (messages envoyés et réponses
          générées), conservé tant que l'Utilisateur conserve son compte actif
          sur le Site, afin de permettre la reprise d'une conversation
          entamée&nbsp;;
        </li>
        <li>
          des compteurs techniques d'usage (nombre de requêtes par heure et par
          jour) servant à appliquer les quotas et à prévenir l'abus.
        </li>
      </ul>
      <p>
        Pour fonctionner, l'Assistant transmet chaque question au prestataire
        Mistral&nbsp;AI (mistral.ai, société de droit français) en tant que
        sous-traitant principal, et, en cas d'indisponibilité, à Google&nbsp;LLC
        (Gemini&nbsp;API) en tant que sous-traitant secondaire. Aucune donnée
        d'identification personnelle (DID, handle, adresse&nbsp;IP) n'est
        transmise à ces prestataires&nbsp;: seul le contenu de la question et
        les extraits de presse pertinents sont envoyés.
      </p>
      <p>
        Conformément au Règlement (UE) 2016/679 («&nbsp;RGPD&nbsp;») et à la loi
        Informatique et Libertés modifiée, l'Utilisateur dispose d'un droit
        d'accès, de rectification, d'effacement, de limitation et de portabilité
        de ses données. Pour l'exercer, il suffit d'écrire à
        <a href="mailto:contact@revue-de-presse.org">
          &nbsp;contact@revue-de-presse.org
        </a>
        . La suppression de l'ensemble des conversations et de la session peut
        également être déclenchée immédiatement par la fonction
        «&nbsp;Déconnexion&nbsp;» accessible depuis la page de discussion. Aucun
        cookie publicitaire ni traqueur tiers n'est déposé. Les seuls témoins de
        connexion utilisés sont techniques (cookie de session opaque, durée
        30&nbsp;jours, HTTP-only).
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
        .rdp-legal-notice ul {
          margin: 0 0 var(--separation-2);
          padding-left: var(--separation-3);
          line-height: var(--line-height-base);
        }
        .rdp-legal-notice li {
          margin: 0 0 var(--separation-1);
        }
        .rdp-legal-notice a {
          color: var(--color-brand);
          text-decoration: underline;
        }
      `}</style>
    </article>
  );
}

export default LegalNoticePage;
