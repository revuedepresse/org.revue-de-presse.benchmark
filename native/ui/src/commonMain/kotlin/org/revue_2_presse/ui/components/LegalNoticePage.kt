package org.revue_2_presse.ui.components

import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import org.revue_2_presse.design.i18n.rdpString
import org.revue_2_presse.design.theme.LocalRdpSpacing
import org.revue_2_presse.domain.i18n.RdpStrings

@Composable
fun LegalNoticePage(modifier: Modifier = Modifier) {
    val spacing = LocalRdpSpacing.current
    RdpStaticPageSurface(
        title = rdpString(RdpStrings.Key.PagesLegalNoticeTitle),
        modifier = modifier.testTag("LegalNoticePage.root"),
    ) {
        Text(rdpString(RdpStrings.Key.PagesLegalNoticeEffectiveAt), style = RdpStaticPageStyles.body())
        Spacer(Modifier.height(spacing.Separation1))
        Text(
            "Conformément aux dispositions des Articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l'économie numérique, dite L.C.E.N., il est porté à la connaissance des utilisateurs et visiteurs, ci-après l'« Utilisateur », du site revue-de-presse.org, ci-après le « Site », les présentes mentions légales.",
            style = RdpStaticPageStyles.body(),
        )
        Spacer(Modifier.height(spacing.Separation1))
        Text(
            "La connexion et la navigation sur le Site par l'Utilisateur implique acceptation intégrale et sans réserve des présentes mentions légales.",
            style = RdpStaticPageStyles.body(),
        )

        Section(rdpString(RdpStrings.Key.PagesLegalNoticeArticle1Title))
        Text(
            "L'édition et la direction de la publication du Site sont assurées par Thierry Marianne, dont l'adresse e-mail est contact@revue-de-presse.org, ci-après l'« Éditeur ».",
            style = RdpStaticPageStyles.body(),
        )

        Section(rdpString(RdpStrings.Key.PagesLegalNoticeArticle2Title))
        Text(
            "Les hébergeurs du Site sont la société Scaleway (8 rue de la Ville l'Évêque, 75008 Paris, +33 (0)1 84 13 00 00) ainsi que la société Netlify (44 Montgomery Street, Suite 300, San Francisco, California 94104), dont l'adresse de support est support@netlify.com.",
            style = RdpStaticPageStyles.body(),
        )

        Section(rdpString(RdpStrings.Key.PagesLegalNoticeArticle3Title))
        Text(
            "Le Site est accessible en tout endroit, 7j/7, 24h/24, sauf cas de force majeure, interruption programmée ou non pouvant découler d'une nécessité de maintenance. En cas de modification, interruption ou suspension du Site, l'Éditeur ne saurait être tenu responsable.",
            style = RdpStaticPageStyles.body(),
        )

        Section(rdpString(RdpStrings.Key.PagesLegalNoticeArticle4Title))
        Text(
            "Le Site est exempté de déclaration à la Commission Nationale Informatique et Libertés (CNIL) dans la mesure où il ne collecte aucune donnée concernant les utilisateurs.",
            style = RdpStaticPageStyles.body(),
        )

        Section(rdpString(RdpStrings.Key.PagesLegalNoticeArticle5Title))
        Text(
            "L'Éditeur opère, pour son propre compte, une application déclarée auprès de TikTok afin de publier chaque jour, sur le compte officiel @revue_2_presse, une vidéo verticale reprenant les dix publications les plus relayées de la veille. Aucune fonctionnalité du Site ne permet à un Utilisateur tiers de se connecter à TikTok via revue-de-presse.org.",
            style = RdpStaticPageStyles.body(),
        )
        Spacer(Modifier.height(spacing.Separation1))
        Text(
            "Cette application demande à TikTok, exclusivement pour le compte officiel précité, les autorisations suivantes :",
            style = RdpStaticPageStyles.body(),
        )
        Spacer(Modifier.height(spacing.Separation1))
        BoldScopeItem(
            "user.info.basic",
            " : identifiant opaque, nom affiché et image d'avatar du compte officiel, utilisés uniquement pour confirmer que le jeton d'accès correspond bien au compte attendu ;",
        )
        BoldScopeItem(
            "video.upload",
            " : dépôt de la vidéo quotidienne en tant que brouillon dans la boîte de réception du compte officiel, en vue d'une finalisation manuelle ou d'une publication directe ;",
        )
        BoldScopeItem(
            "video.list",
            " : lecture de la liste des vidéos publiques du compte officiel, à seule fin de vérifier qu'une publication quotidienne a bien abouti et d'éviter les doublons.",
        )
        Spacer(Modifier.height(spacing.Separation1))
        Text(
            "Les informations obtenues via ces autorisations restent strictement internes au processus de publication automatique. Elles ne sont jamais affichées sur le Site, ne sont jamais transmises à des tiers commerciaux, et ne servent à aucune finalité publicitaire ou de profilage. Les jetons d'accès et de rafraîchissement délivrés par TikTok sont conservés de manière chiffrée sur l'infrastructure de publication, sont renouvelés à chaque exécution conformément aux recommandations de TikTok, et peuvent être révoqués à tout moment par l'Éditeur depuis sa console TikTok for Developers.",
            style = RdpStaticPageStyles.body(),
        )
        Spacer(Modifier.height(spacing.Separation1))
        Text(
            "Toute demande relative aux données traitées dans le cadre de cette intégration peut être adressée à contact@revue-de-presse.org.",
            style = RdpStaticPageStyles.body(),
        )
    }
}

