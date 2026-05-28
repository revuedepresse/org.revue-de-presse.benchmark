package org.revue_2_presse.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import org.revue_2_presse.design.theme.LocalRdpSpacing
import org.revue_2_presse.design.RdpColors
import org.revue_2_presse.domain.entities.Metrics

@Composable
fun MetricsBar(metrics: Metrics, modifier: Modifier = Modifier) {
    val spacing = LocalRdpSpacing.current
    Row(modifier.testTag("MetricsBar.root"),
        horizontalArrangement = Arrangement.spacedBy(spacing.Separation2),
        verticalAlignment = Alignment.CenterVertically) {
        MetricCell("replies", metrics.replies.toString(), RdpColors.VanityMetricReply)
        MetricCell("reposts", metrics.reposts.toString(), RdpColors.VanityMetricRetweet)
        MetricCell("likes",   metrics.likes.toString(),   RdpColors.VanityMetricLike)
    }
}

@Composable
private fun MetricCell(name: String, value: String, color: androidx.compose.ui.graphics.Color) {
    Row(modifier = Modifier.testTag("MetricsBar.$name")) {
        Text(value, color = color)
    }
}
