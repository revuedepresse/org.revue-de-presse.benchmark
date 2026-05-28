package org.revue_2_presse.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.pointer.PointerIcon
import androidx.compose.ui.input.pointer.pointerHoverIcon
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import org.revue_2_presse.design.RdpColors
import org.revue_2_presse.design.i18n.rdpString
import org.revue_2_presse.design.theme.LocalRdpSpacing
import org.revue_2_presse.domain.i18n.RdpStrings

// Parity target: e2e/parity/captures/home.json (AppHeaderRibbon + AppHeaderInner).
// Ribbon: full-bleed white, border-bottom 1px #e6e6e6 (Border).
// Inner: max-width 952dp centred, padding Separation1×Separation3, Logo at left,
// right slot reserved for MySpace + Account once auth state is wired.
@Composable
fun AppHeader(
    modifier: Modifier = Modifier,
    onLogoClick: (() -> Unit)? = null,
    right: (@Composable () -> Unit)? = null,
) {
    val spacing = LocalRdpSpacing.current
    // Box just paints the full-width white ribbon. The inner Row is anchored to
    // the box centre via Modifier.align(TopCenter) so the logo + wordmark sit on
    // the LEFT of the centred 952dp content area, NOT on the screen's leftmost
    // edge. Same centring trick the body uses in App.kt.
    Box(
        modifier
            .testTag("AppHeader.root")
            .fillMaxWidth()
            .background(RdpColors.White),
    ) {
        Row(
            Modifier
                .align(Alignment.TopCenter)
                .testTag("AppHeader.inner")
                .widthIn(max = 952.dp)
                .fillMaxWidth()
                .padding(
                    PaddingValues(
                        horizontal = spacing.Separation3,
                        vertical = spacing.Separation1,
                    ),
                ),
            horizontalArrangement = Arrangement.spacedBy(spacing.Separation2),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            val brandModifier = Modifier
                .testTag("AppHeader.brand")
                .let { base ->
                    if (onLogoClick != null) {
                        base.pointerHoverIcon(PointerIcon.Hand).clickable { onLogoClick() }
                    } else base
                }
            Row(
                brandModifier,
                horizontalArrangement = Arrangement.spacedBy(spacing.Separation2),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Logo()
                Text(
                    rdpString(RdpStrings.Key.HeaderWordmark),
                    style = MaterialTheme.typography.titleLarge,
                    modifier = Modifier.testTag("AppHeader.wordmark"),
                )
            }
            Box(Modifier.weight(1f))
            right?.invoke()
        }
        HorizontalDivider(
            Modifier.align(Alignment.BottomCenter),
            thickness = 1.dp,
            color = RdpColors.Border,
        )
    }
}
