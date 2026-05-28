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
fun TermsOfServicePage(modifier: Modifier = Modifier) {
    val spacing = LocalRdpSpacing.current
    RdpStaticPageSurface(
        title = rdpString(RdpStrings.Key.PagesTermsOfServiceTitle),
        modifier = modifier.testTag("TermsOfServicePage.root"),
    ) {
        Text(rdpString(RdpStrings.Key.PagesTermsOfServiceEffectiveAt), style = RdpStaticPageStyles.body())
        Spacer(Modifier.height(spacing.Separation1))
        Text(
            "Les présentes conditions générales d'utilisation (les « CGU ») régissent l'accès au site revue-de-presse.org, ci-après le « Site », ainsi qu'à l'ensemble des services associés exposés par Thierry Marianne, ci-après l'« Éditeur », joignable à l'adresse contact@revue-de-presse.org. La navigation sur le Site et l'usage des services associés impliquent l'acceptation pleine et entière des présentes CGU.",
            style = RdpStaticPageStyles.body(),
        )

        Section(rdpString(RdpStrings.Key.PagesTermsOfServiceArticle1Title))
        Text(
            "Le Site édite chaque jour une sélection des dix publications de presse les plus relayées sur le réseau social Bluesky et propose des fonctionnalités complémentaires : archivage par date et consultation des sources. L'ensemble des contenus est publié à titre d'information et sans valeur contractuelle.",
            style = RdpStaticPageStyles.body(),
        )

        Section(rdpString(RdpStrings.Key.PagesTermsOfServiceArticle2Title))
        Text(
            "Le Site est accessible gratuitement, 7j/7 et 24h/24, sauf cas de force majeure ou interruption pour maintenance. L'Éditeur ne saurait être tenu responsable des interruptions, ni de toute conséquence pouvant en résulter pour l'Utilisateur ou tout tiers.",
            style = RdpStaticPageStyles.body(),
        )

        Section(rdpString(RdpStrings.Key.PagesTermsOfServiceArticle3Title))
        Text(
            "Afin de diffuser la sélection quotidienne au-delà du Site, l'Éditeur opère plusieurs comptes officiels sur les principaux réseaux sociaux, notamment :",
            style = RdpStaticPageStyles.body(),
        )
        Spacer(Modifier.height(spacing.Separation1))
        RdpListItem("Bluesky : @revue-de-presse.org ;")
        RdpListItem("TikTok : @revue_2_presse.")
        Spacer(Modifier.height(spacing.Separation1))
        Text(
            "Ces comptes sont exclusivement administrés par l'Éditeur pour son propre compte. Aucune fonctionnalité du Site ne permet à un Utilisateur tiers de publier sur ces comptes, ni de connecter son propre compte TikTok à revue-de-presse.org.",
            style = RdpStaticPageStyles.body(),
        )

        Section(rdpString(RdpStrings.Key.PagesTermsOfServiceArticle4Title))
        Text(
            "L'Éditeur exploite une application TikTok déclarée auprès de TikTok for Developers afin de publier automatiquement, chaque jour, une vidéo de format 9:16 reprenant les dix publications les plus relayées de la veille sur le compte @revue_2_presse.",
            style = RdpStaticPageStyles.body(),
        )
        Spacer(Modifier.height(spacing.Separation1))
        Text(
            "Cette application TikTok demande les autorisations (« scopes ») suivantes, et uniquement pour le compte officiel @revue_2_presse :",
            style = RdpStaticPageStyles.body(),
        )
        Spacer(Modifier.height(spacing.Separation1))
        BoldScopeItem(
            "user.info.basic",
            " (Login Kit) : lecture des informations publiques de profil du compte connecté (identifiant opaque, nom affiché, image d'avatar). Ces informations servent uniquement à confirmer que l'autorisation a bien été délivrée pour le compte attendu. Elles ne sont ni revendues, ni rapprochées d'autres jeux de données.",
        )
        BoldScopeItem(
            "video.upload",
            " (Content Posting API) : dépôt de la vidéo quotidienne en tant que brouillon dans la boîte de réception du compte officiel pour validation manuelle, ou publication directe lorsque l'application est habilitée.",
        )
        BoldScopeItem(
            "video.list",
            " (Content Posting API) : lecture de la liste des vidéos publiques du compte officiel afin de vérifier le bon déroulement des publications quotidiennes et d'éviter les doublons.",
        )
        Spacer(Modifier.height(spacing.Separation1))
        Text(
            "Aucun de ces accès n'est utilisé pour collecter ou afficher des données relatives à des Utilisateurs tiers. L'Éditeur ne stocke ni n'expose l'identifiant TikTok, l'image d'avatar ou le nom affiché du compte officiel sur le Site ; ces informations ne servent qu'à l'administration interne de la publication automatique.",
            style = RdpStaticPageStyles.body(),
        )

        Section(rdpString(RdpStrings.Key.PagesTermsOfServiceArticle5Title))
        Text(
            "L'Utilisateur s'engage à utiliser le Site et les services associés de bonne foi, à des fins d'information personnelle. Sont notamment interdits : la collecte automatisée de contenus en dehors des canaux prévus (RSS, sitemap), le contournement des quotas d'usage de l'assistant de discussion, l'envoi massif de requêtes, la sollicitation de contenus illicites, diffamatoires, haineux ou portant atteinte aux droits de tiers. L'Éditeur se réserve le droit de suspendre l'accès, sans préavis, en cas d'usage manifestement abusif.",
            style = RdpStaticPageStyles.body(),
        )

        Section(rdpString(RdpStrings.Key.PagesTermsOfServiceArticle6Title))
        Text(
            "L'ensemble des éléments éditoriaux propres au Site (mise en page, rédactionnels, identité visuelle) est protégé par le droit de la propriété intellectuelle. Les extraits de presse repris par le Site restent la propriété de leurs éditeurs respectifs et sont reproduits à titre de courte citation, conformément à l'article L.122-5 du Code de la propriété intellectuelle, avec mention systématique de la source d'origine.",
            style = RdpStaticPageStyles.body(),
        )

        Section(rdpString(RdpStrings.Key.PagesTermsOfServiceArticle7Title))
        Text(
            "Les modalités détaillées de collecte et de traitement des données personnelles, y compris celles liées à l'intégration TikTok, sont décrites dans la politique de confidentialité du Site.",
            style = RdpStaticPageStyles.body(),
        )

        Section(rdpString(RdpStrings.Key.PagesTermsOfServiceArticle8Title))
        Text(
            "L'Éditeur se réserve la faculté de modifier les présentes CGU à tout moment. La version applicable est celle en vigueur à la date de l'accès au Site, dont la date d'effet figure en tête du présent document.",
            style = RdpStaticPageStyles.body(),
        )

        Section(rdpString(RdpStrings.Key.PagesTermsOfServiceArticle9Title))
        Text(
            "Les présentes CGU sont soumises au droit français. À défaut de résolution amiable, tout litige sera porté devant les tribunaux français compétents.",
            style = RdpStaticPageStyles.body(),
        )
    }
}
