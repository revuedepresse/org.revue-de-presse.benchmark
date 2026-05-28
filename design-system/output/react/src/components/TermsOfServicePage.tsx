import * as React from "react";

type TermsOfServicePageProps = {
  site?: string;
  editor?: string;
  email?: string;
  effectiveAt?: string;
  tiktokAccount?: string;
};

function TermsOfServicePage(props: TermsOfServicePageProps) {
  return (
    <article className="rdp-terms-of-service">
      <h1>Conditions d'utilisation</h1>
      <p>En vigueur au {props.effectiveAt ?? "27/05/26"}</p>
      <p>
        {" "}
        Les présentes conditions générales d'utilisation (les «&nbsp;CGU&nbsp;»)
        régissent l'accès au site {props.site ?? "revue-de-presse.org"},
        ci-après le «&nbsp;Site&nbsp;», ainsi qu'à l'ensemble des services
        associés exposés par {props.editor ?? "Thierry Marianne"}, ci-après
        l'«&nbsp;Éditeur&nbsp;», joignable à l'adresse&nbsp;{" "}
        <a href={`mailto:${props.email ?? "contact@revue-de-presse.org"}`}>
          {props.email ?? "contact@revue-de-presse.org"}
        </a>
        . La navigation sur le Site et l'usage des services associés impliquent
        l'acceptation pleine et entière des présentes CGU.{" "}
      </p>
      <h2>ARTICLE 1 – OBJET</h2>
      <p>
        {" "}
        Le Site édite chaque jour une sélection des dix publications de presse
        les plus relayées sur le réseau social Bluesky et propose des
        fonctionnalités complémentaires&nbsp;: archivage par date et
        consultation des sources. L'ensemble des contenus est publié à titre
        d'information et sans valeur contractuelle.{" "}
      </p>
      <h2>ARTICLE 2 – ACCÈS AU SERVICE</h2>
      <p>
        {" "}
        Le Site est accessible gratuitement, 7j/7 et 24h/24, sauf cas de force
        majeure ou interruption pour maintenance. L'Éditeur ne saurait être tenu
        responsable des interruptions, ni de toute conséquence pouvant en
        résulter pour l'Utilisateur ou tout tiers.{" "}
      </p>
      <h2>ARTICLE 3 – COMPTES DE DIFFUSION SUR LES RÉSEAUX SOCIAUX</h2>
      <p>
        {" "}
        Afin de diffuser la sélection quotidienne au-delà du Site, l'Éditeur
        opère plusieurs comptes officiels sur les principaux réseaux sociaux,
        notamment&nbsp;:
      </p>
      <ul>
        <li>
          Bluesky&nbsp;:
          <a
            href="https://bsky.app/profile/revue-de-presse.org"
            rel="noreferrer nofollow noopener"
            target="_blank"
          >
            @revue-de-presse.org
          </a>
          &nbsp;;
        </li>
        <li>
          TikTok&nbsp;:
          <a
            rel="noreferrer nofollow noopener"
            target="_blank"
            href={`https://www.tiktok.com/@${(
              props.tiktokAccount ?? "revue_2_presse"
            ).replace(/^@/, "")}`}
          >
            @{(props.tiktokAccount ?? "revue_2_presse").replace(/^@/, "")}
          </a>
          .
        </li>
      </ul>
      <p>
        Ces comptes sont exclusivement administrés par l'Éditeur pour son propre
        compte. Aucune fonctionnalité du Site ne permet à un Utilisateur tiers
        de publier sur ces comptes, ni de connecter son propre compte TikTok à
        revue-de-presse.org.{" "}
      </p>
      <h2 id="tiktok">ARTICLE 4 – INTÉGRATION TIKTOK</h2>
      <p>
        {" "}
        L'Éditeur exploite une application TikTok déclarée auprès de
        <a
          href="https://developers.tiktok.com/"
          rel="noreferrer nofollow noopener"
          target="_blank"
        >
          TikTok for Developers
        </a>
        afin de publier automatiquement, chaque jour, une vidéo de format 9:16
        reprenant les dix publications les plus relayées de la veille sur le
        compte&nbsp;
        <a
          rel="noreferrer nofollow noopener"
          target="_blank"
          href={`https://www.tiktok.com/@${(
            props.tiktokAccount ?? "revue_2_presse"
          ).replace(/^@/, "")}`}
        >
          @{(props.tiktokAccount ?? "revue_2_presse").replace(/^@/, "")}
        </a>
        .
      </p>
      <p>
        Cette application TikTok demande les autorisations
        («&nbsp;scopes&nbsp;») suivantes, et uniquement pour le compte officiel
        @{(props.tiktokAccount ?? "revue_2_presse").replace(/^@/, "")}&nbsp;:
      </p>
      <ul>
        <li>
          <strong>user.info.basic</strong> (Login Kit)&nbsp;: lecture des
          informations publiques de profil du compte connecté (identifiant
          opaque, nom affiché, image d'avatar). Ces informations servent
          uniquement à confirmer que l'autorisation a bien été délivrée pour le
          compte attendu. Elles ne sont ni revendues, ni rapprochées d'autres
          jeux de données.{" "}
        </li>
        <li>
          <strong>video.upload</strong> (Content Posting API)&nbsp;: dépôt de la
          vidéo quotidienne en tant que brouillon dans la boîte de réception du
          compte officiel pour validation manuelle, ou publication directe
          lorsque l'application est habilitée.
        </li>
        <li>
          <strong>video.list</strong> (Content Posting API)&nbsp;: lecture de la
          liste des vidéos publiques du compte officiel afin de vérifier le bon
          déroulement des publications quotidiennes et d'éviter les doublons.{" "}
        </li>
      </ul>
      <p>
        {" "}
        Aucun de ces accès n'est utilisé pour collecter ou afficher des données
        relatives à des Utilisateurs tiers. L'Éditeur ne stocke ni n'expose
        l'identifiant TikTok, l'image d'avatar ou le nom affiché du compte
        officiel sur le Site&nbsp;; ces informations ne servent qu'à
        l'administration interne de la publication automatique.{" "}
      </p>
      <h2>ARTICLE 5 – USAGE LOYAL</h2>
      <p>
        {" "}
        L'Utilisateur s'engage à utiliser le Site et les services associés de
        bonne foi, à des fins d'information personnelle. Sont notamment
        interdits&nbsp;: la collecte automatisée de contenus en dehors des
        canaux prévus (RSS, sitemap), le contournement des quotas d'usage de
        l'assistant de discussion, l'envoi massif de requêtes, la sollicitation
        de contenus illicites, diffamatoires, haineux ou portant atteinte aux
        droits de tiers. L'Éditeur se réserve le droit de suspendre l'accès,
        sans préavis, en cas d'usage manifestement abusif.
      </p>
      <h2>ARTICLE 6 – PROPRIÉTÉ INTELLECTUELLE</h2>
      <p>
        L'ensemble des éléments éditoriaux propres au Site (mise en page,
        rédactionnels, identité visuelle) est protégé par le droit de la
        propriété intellectuelle. Les extraits de presse repris par le Site
        restent la propriété de leurs éditeurs respectifs et sont reproduits à
        titre de courte citation, conformément à l'article L.122-5 du Code de la
        propriété intellectuelle, avec mention systématique de la source
        d'origine.{" "}
      </p>
      <h2>ARTICLE 7 – DONNÉES PERSONNELLES</h2>
      <p>
        {" "}
        Les modalités détaillées de collecte et de traitement des données
        personnelles, y compris celles liées à l'intégration TikTok, sont
        décrites dans la
        <a href="/mentions-legales#confidentialite">
          politique de confidentialité
        </a>
        du Site.
      </p>
      <h2>ARTICLE 8 – MODIFICATION DES CGU</h2>
      <p>
        L'Éditeur se réserve la faculté de modifier les présentes CGU à tout
        moment. La version applicable est celle en vigueur à la date de l'accès
        au Site, dont la date d'effet figure en tête du présent document.{" "}
      </p>
      <h2>ARTICLE 9 – DROIT APPLICABLE</h2>
      <p>
        {" "}
        Les présentes CGU sont soumises au droit français. À défaut de
        résolution amiable, tout litige sera porté devant les tribunaux français
        compétents.{" "}
      </p>
      <style>{`         .rdp-terms-of-service {           background: var(--color-white);           border-radius: var(--radius-default);           padding: var(--separation-3);           font-family: Roboto, sans-serif;           color: var(--color-content-text);         }         .rdp-terms-of-service h1 {           font-family: Signika, sans-serif;           color: var(--color-brand);           margin: 0 0 var(--separation-2);         }         .rdp-terms-of-service h2 {           font-family: Signika, sans-serif;           color: var(--color-brand);           font-size: var(--font-size-status-text);           margin: var(--separation-2) 0 var(--separation-1);         }         .rdp-terms-of-service p {           margin: 0 0 var(--separation-2);           line-height: var(--line-height-base);         }         .rdp-terms-of-service ul {           margin: 0 0 var(--separation-2);           padding-left: var(--separation-3);           line-height: var(--line-height-base);         }         .rdp-terms-of-service li {           margin: 0 0 var(--separation-1);         }         .rdp-terms-of-service a {           color: var(--color-brand);           text-decoration: underline;         }       `}</style>
    </article>
  );
}
export default TermsOfServicePage;
