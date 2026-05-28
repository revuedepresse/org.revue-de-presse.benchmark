<template>
  <article class="rdp-legal-notice">
    <h1>Politique de confidentialité</h1>
    <p>En vigueur au {{ effectiveAt ?? "27/05/26" }}</p>
    <p>
      Conformément aux dispositions des Articles 6-III et 19 de la Loi
      n°2004-575 du 21 juin 2004 pour la Confiance dans l'économie numérique,
      dite L.C.E.N., il est porté à la connaissance des utilisateurs et
      visiteurs, ci-après l'«&nbsp;Utilisateur&nbsp;», du site
      {{ site ?? "revue-de-presse.org" }}, ci-après le «&nbsp;Site&nbsp;», les
      présentes mentions légales.
      <br />
      La connexion et la navigation sur le Site par l'Utilisateur implique
      acceptation intégrale et sans réserve des présentes mentions légales.
    </p>
    <h2>ARTICLE 1 – L'ÉDITEUR</h2>
    <p>
      L'édition et la direction de la publication du Site sont assurées par{{
        editor ?? "Thierry Marianne"
      }}, dont l'adresse e-mail est{{ email ?? "contact@revue-de-presse.org" }},
      ci-après l'«&nbsp;Éditeur&nbsp;».
    </p>
    <h2>ARTICLE 2 – HÉBERGEURS</h2>
    <p>
      Les hébergeurs du Site sont la société Scaleway (8 rue de la Ville
      l'Évêque, 75008 Paris, +33 (0)1 84 13 00 00) ainsi que la société Netlify
      (44 Montgomery Street, Suite 300, San Francisco, California 94104), dont
      l'adresse de support est support@netlify.com.
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
      Le Site est exempté de déclaration à la Commission Nationale Informatique
      et Libertés (CNIL) dans la mesure où il ne collecte aucune donnée
      concernant les utilisateurs.
    </p>
    <h2 id="tiktok">ARTICLE 5 – DIFFUSION SUR TIKTOK</h2>
    <p>
      L'Éditeur opère, pour son propre compte, une application déclarée auprès
      de TikTok afin de publier chaque jour, sur le compte officiel @{{
        (tiktokAccount ?? "revue_2_presse").replace(/^@/, "")
      }}, une vidéo verticale reprenant les dix publications les plus relayées
      de la veille. Aucune fonctionnalité du Site ne permet à un Utilisateur
      tiers de se connecter à TikTok via revue-de-presse.org.
    </p>
    <p>
      Cette application demande à TikTok, exclusivement pour le compte officiel
      précité, les autorisations suivantes&nbsp;:
    </p>
    <ul>
      <li>
        <strong>user.info.basic</strong>&nbsp;: identifiant opaque, nom affiché
        et image d'avatar du compte officiel, utilisés uniquement pour confirmer
        que le jeton d'accès correspond bien au compte attendu&nbsp;;
      </li>
      <li>
        <strong>video.upload</strong>&nbsp;: dépôt de la vidéo quotidienne en
        tant que brouillon dans la boîte de réception du compte officiel, en vue
        d'une finalisation manuelle ou d'une publication directe&nbsp;;
      </li>
      <li>
        <strong>video.list</strong>&nbsp;: lecture de la liste des vidéos
        publiques du compte officiel, à seule fin de vérifier qu'une publication
        quotidienne a bien abouti et d'éviter les doublons.
      </li>
    </ul>
    <p>
      Les informations obtenues via ces autorisations restent strictement
      internes au processus de publication automatique. Elles ne sont jamais
      affichées sur le Site, ne sont jamais transmises à des tiers commerciaux,
      et ne servent à aucune finalité publicitaire ou de profilage. Les jetons
      d'accès et de rafraîchissement délivrés par TikTok sont conservés de
      manière chiffrée sur l'infrastructure de publication, sont renouvelés à
      chaque exécution conformément aux recommandations de TikTok, et peuvent
      être révoqués à tout moment par l'Éditeur depuis sa console
      TikTok&nbsp;for Developers.
    </p>
    <p>
      Toute demande relative aux données traitées dans le cadre de cette
      intégration peut être adressée à
      <a href="mailto:contact@revue-de-presse.org"
        >&nbsp;contact@revue-de-presse.org</a
      >.
    </p>
    <component :is="'style'">{{
      `
        .rdp-legal-notice {
          background: var(--color-white);
          border-radius: var(--radius-default);
          padding: var(--separation-3);
          font-family: "Roboto", sans-serif;
          color: var(--color-content-text);
        }
        .rdp-legal-notice h1 {
          font-family: "Signika", sans-serif;
          color: var(--color-brand);
          margin: 0 0 var(--separation-2);
        }
        .rdp-legal-notice h2 {
          font-family: "Signika", sans-serif;
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
      `
    }}</component>
  </article>
</template>

<script setup lang="ts">
type LegalNoticePageProps = {
  site?: string;
  editor?: string;
  email?: string;
  effectiveAt?: string;
  tiktokAccount?: string;
};

const props = defineProps<LegalNoticePageProps>();
</script>