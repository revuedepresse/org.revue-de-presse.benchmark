package org.revue_2_presse.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Repeat
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import org.revue_2_presse.design.RdpType
import org.revue_2_presse.design.theme.LocalRdpSpacing
import org.revue_2_presse.design.RdpColors
import org.revue_2_presse.domain.entities.Metrics

// Nuxt CSS (design-system/src/tokens/tokens.css:23-24): like-bg #fac5d2, retweet-bg #c5e9d5.
// Reply has no bg tint in Nuxt — components.css:797-799 only tints --repost and --like.
// TODO: promote these two pastels to RdpColors via live-tokens.json regen.
private val LikeIconBg   = Color(0xFFFAC5D2)
private val RepostIconBg = Color(0xFFC5E9D5)

@Composable
fun MetricsBar(metrics: Metrics, modifier: Modifier = Modifier) {
    val spacing = LocalRdpSpacing.current
    // Reply cell removed by product decision — only repost + like surface here.
    Row(modifier.testTag("MetricsBar.root"),
        horizontalArrangement = Arrangement.spacedBy(spacing.Separation2),
        verticalAlignment = Alignment.CenterVertically) {
        MetricCell("reposts", metrics.reposts.toString(),
                   icon = Icons.Filled.Repeat,
                   fg = RdpColors.VanityMetricRetweet,
                   bg = RepostIconBg)
        MetricCell("likes", metrics.likes.toString(),
                   icon = Icons.Filled.Favorite,
                   fg = RdpColors.VanityMetricLike,
                   bg = LikeIconBg)
    }
}

@Composable
private fun MetricCell(name: String, value: String, icon: ImageVector, fg: Color, bg: Color) {
    Row(
        modifier = Modifier.testTag("MetricsBar.$name"),
        horizontalArrangement = Arrangement.spacedBy(5.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            Modifier.size(24.dp).clip(CircleShape).background(bg),
            contentAlignment = Alignment.Center,
        ) {
            Icon(icon, contentDescription = null, tint = fg, modifier = Modifier.size(16.dp))
        }
        Text(
            value,
            style = MaterialTheme.typography.labelSmall.copy(
                fontSize = RdpType.FontSizeVanityMetric,
                lineHeight = RdpType.LineSpacingVanityMetric,
                color = fg,
            ),
        )
    }
}
