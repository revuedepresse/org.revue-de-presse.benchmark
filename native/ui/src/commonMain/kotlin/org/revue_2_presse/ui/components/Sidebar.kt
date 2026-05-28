package org.revue_2_presse.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import kotlinx.datetime.Clock
import kotlinx.datetime.DatePeriod
import kotlinx.datetime.TimeZone
import kotlinx.datetime.minus
import kotlinx.datetime.todayIn
import org.revue_2_presse.design.theme.LocalRdpSizes
import org.revue_2_presse.design.theme.LocalRdpSpacing

// Parity target: e2e/parity/captures/home.json (Sidebar + Calendar + BannerAbout).
// Nuxt's sidebar is a transparent flex column hosting Calendar (top) + BannerAbout (bottom),
// gap 16. No background of its own. Nav lives inside BannerAbout's view-buttons.
@Composable
fun Sidebar(onNavigate: (String) -> Unit, modifier: Modifier = Modifier) {
    val sizes = LocalRdpSizes.current
    val spacing = LocalRdpSpacing.current
    // Matches HomeScreen's data target: yesterday in Europe/Paris (the day the
    // daily snapshot job has actually finalised). Drives Calendar's initial pick.
    val yesterday = Clock.System.todayIn(TimeZone.of("Europe/Paris")).minus(DatePeriod(days = 1))
    Column(
        modifier
            .testTag("Sidebar.root")
            .width(sizes.LeftColumnDesktopWidth),
        verticalArrangement = Arrangement.spacedBy(spacing.Separation2),
    ) {
        Calendar(initial = yesterday, onSelect = { date -> onNavigate("/$date") })
        BannerAbout(onNavigate = onNavigate)
    }
}
