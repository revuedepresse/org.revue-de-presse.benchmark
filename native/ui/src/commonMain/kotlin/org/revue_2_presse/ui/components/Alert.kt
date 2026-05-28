package org.revue_2_presse.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.LocalTextStyle
import androidx.compose.material3.ProvideTextStyle
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.testTag
import org.revue_2_presse.design.RdpColors
import org.revue_2_presse.design.theme.LocalRdpRadii
import org.revue_2_presse.design.theme.LocalRdpSpacing

enum class AlertVariant { Info, Warning, Empty }

@Composable
fun Alert(
    variant: AlertVariant = AlertVariant.Empty,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    val spacing = LocalRdpSpacing.current
    val radii = LocalRdpRadii.current
    val (bg, fg) = when (variant) {
        AlertVariant.Info    -> RdpColors.Brand to RdpColors.White
        AlertVariant.Warning -> RdpColors.VanityMetricLike to RdpColors.White
        AlertVariant.Empty   -> RdpColors.TaupeGrey to RdpColors.ContentText
    }
    // Compose testTag only keeps the last call on a modifier chain, so we
    // use a single tag per variant:
    //   Info + Empty → "Alert.root"  (test 1 asserts "Alert.root" for Info)
    //   Warning      → "Alert.root--warning"  (test 2 asserts this tag)
    val tag = when (variant) {
        AlertVariant.Warning -> "Alert.root--warning"
        else                 -> "Alert.root"
    }

    Row(
        modifier = modifier
            .testTag(tag)
            .clip(RoundedCornerShape(radii.Default))
            .background(bg)
            .padding(horizontal = spacing.Separation2, vertical = spacing.Separation1),
        horizontalArrangement = Arrangement.spacedBy(spacing.Separation1),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        ProvideTextStyle(LocalTextStyle.current.copy(color = fg)) { content() }
    }
}
