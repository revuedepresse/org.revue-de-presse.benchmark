package org.revue_2_presse.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import org.revue_2_presse.design.theme.LocalRdpSpacing

@Composable
fun RdpApp(
    currentRoute: String,
    onNavigate: (String) -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    // Nuxt parity: full-bleed AppHeader on top; body row capped at 952dp and centred
    // horizontally with auto-style gutters. The body uses Box(weight 1f).fillMaxWidth +
    // contentAlignment = TopCenter so wide windows give balanced left/right margins.
    // Inside, Sidebar 336dp + 16dp gap + main content (weight 1f), per
    // e2e/parity/captures/home.json (Sidebar x=180/width=336, Main x=532/width=568).
    val spacing = LocalRdpSpacing.current
    Column(modifier.testTag("App.root").fillMaxSize()) {
        AppHeader(
            modifier = Modifier.fillMaxWidth(),
            onLogoClick = { onNavigate("/") },
        )
        Box(
            Modifier.fillMaxWidth().weight(1f),
            contentAlignment = Alignment.TopCenter,
        ) {
            Row(
                Modifier
                    .widthIn(max = 952.dp)
                    .fillMaxWidth()
                    .fillMaxHeight()
                    .padding(
                        start = spacing.Separation2,
                        end = spacing.Separation2,
                        top = spacing.Separation2,
                    ),
                horizontalArrangement = Arrangement.spacedBy(spacing.Separation2),
            ) {
                Sidebar(onNavigate = onNavigate)
                Box(Modifier.weight(1f).fillMaxHeight()) { content() }
            }
        }
    }
}
