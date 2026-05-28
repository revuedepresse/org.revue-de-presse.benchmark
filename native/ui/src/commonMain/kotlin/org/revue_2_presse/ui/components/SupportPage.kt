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
fun SupportPage(onDonateClick: () -> Unit, modifier: Modifier = Modifier) {
    val spacing = LocalRdpSpacing.current
    RdpStaticPageSurface(
        title = rdpString(RdpStrings.Key.PagesSupportTitle),
        modifier = modifier.testTag("SupportPage.root"),
    ) {
        Text(
            rdpString(RdpStrings.Key.PagesSupportSection1Title),
            style = RdpStaticPageStyles.h2(),
        )
        Text(
            "Revue de presse s'appuie sur l'API de Bluesky et relaie des brèves de presse en provenance exclusive de médias Français d'après le succès rencontré par ses brèves auprès du public.",
            style = RdpStaticPageStyles.body(),
        )
        Spacer(Modifier.height(spacing.Separation1))
        Text(
            "En effet, un classement s'appuyant sur les partages, offre chaque jour une visibilité sur 10 publications médias.",
            style = RdpStaticPageStyles.body(),
        )
        Spacer(Modifier.height(spacing.Separation1))
        Text(
            "L'intégralité du code source du projet est proposée sous licence libre (GNU General Public License v3.0) et est hébergée par l'organisation « Revue de Presse » :",
            style = RdpStaticPageStyles.body(),
        )
        Text(
            "github.com/revuedepresse",
            style = RdpStaticPageStyles.link(),
            modifier = Modifier.testTag("SupportPage.githubLink"),
        )

        Spacer(Modifier.height(spacing.Separation2))
        Text(
            rdpString(RdpStrings.Key.PagesSupportSection2Title),
            style = RdpStaticPageStyles.h2(),
        )
        Text(
            "Contribuez directement au projet en nous offrant de la visibilité autour de vous lorsque vous :",
            style = RdpStaticPageStyles.body(),
        )
        Spacer(Modifier.height(spacing.Separation1))
        RdpListItem("vous abonnez à @revue-de-presse.org sur Bluesky")
        RdpListItem("partagez les publications et la mission du projet sur les réseaux sociaux")
        RdpListItem("nous suggérez de nouveaux médias de la presse française pas encore référencés")
    }
}
