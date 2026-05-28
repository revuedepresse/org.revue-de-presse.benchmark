package org.revue_2_presse.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import org.revue_2_presse.design.i18n.rdpString
import org.revue_2_presse.design.theme.LocalRdpSizes
import org.revue_2_presse.design.theme.LocalRdpSpacing
import org.revue_2_presse.design.RdpColors
import org.revue_2_presse.domain.i18n.RdpStrings

// NOTE: RdpStrings has no Sidebar* keys.
// Fallback mapping (until keys are added to the design-system locales):
//   "/"               → FooterAboutHeading  ("À propos" / "About")
//   "/sources"        → FooterAboutSources
//   "/nous-contacter" → FooterAboutContact
//   "/nous-soutenir"  → FooterAboutSupport
data class SidebarItem(val route: String, val labelKey: RdpStrings.Key)

private val items = listOf(
    SidebarItem("/", RdpStrings.Key.FooterAboutHeading),
    SidebarItem("/sources", RdpStrings.Key.FooterAboutSources),
    SidebarItem("/nous-contacter", RdpStrings.Key.FooterAboutContact),
    SidebarItem("/nous-soutenir", RdpStrings.Key.FooterAboutSupport),
)

@Composable
fun Sidebar(currentRoute: String, onNavigate: (String) -> Unit, modifier: Modifier = Modifier) {
    val sizes = LocalRdpSizes.current
    val spacing = LocalRdpSpacing.current
    Column(modifier
        .testTag("Sidebar.root")
        .width(sizes.LeftColumnDesktopWidth)
        .background(RdpColors.ContentBackground)
        .padding(spacing.Separation2)) {
        Logo()
        items.forEach { item ->
            val active = currentRoute == item.route
            Box(Modifier
                .testTag("Sidebar.item.${item.route}")
                .fillMaxWidth()
                .clickable { onNavigate(item.route) }
                .padding(vertical = spacing.Separation1)) {
                Text(rdpString(item.labelKey),
                     color = if (active) RdpColors.BrandActive else RdpColors.ContentFont)
            }
        }
    }
}
