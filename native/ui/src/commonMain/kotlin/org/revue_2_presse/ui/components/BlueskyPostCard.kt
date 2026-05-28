package org.revue_2_presse.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.input.pointer.PointerIcon
import androidx.compose.ui.input.pointer.pointerHoverIcon
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import coil3.compose.AsyncImage
import org.revue_2_presse.design.RdpColors
import org.revue_2_presse.design.drawables.rdpBlueskyPainter
import org.revue_2_presse.design.theme.LocalRdpSpacing
import org.revue_2_presse.domain.entities.Highlight

@Composable
fun BlueskyPostCard(
    post: Highlight,
    modifier: Modifier = Modifier,
    onAuthorClick: () -> Unit = {},
    onShareClick: () -> Unit = {},
) {
    val spacing = LocalRdpSpacing.current
    // Lift the MetricsBar out of the card so it floats above the body, right-aligned —
    // matches the Nuxt capture (MetricsBar y=260, PostCard y=293 = 8dp gap).
    Column(
        modifier = modifier.testTag("BlueskyPostCard.root").fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(spacing.Separation1),
    ) {
        MetricsBar(post.metrics, modifier = Modifier.align(Alignment.End))
        OutlinedCard(
            modifier = Modifier.fillMaxWidth().testTag("BlueskyPostCard.card"),
            colors = CardDefaults.outlinedCardColors(containerColor = RdpColors.White),
            border = BorderStroke(1.dp, RdpColors.Border),
        ) {
            Box {
                Column(
                    Modifier.padding(spacing.Separation2),
                    verticalArrangement = Arrangement.spacedBy(spacing.Separation1),
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(spacing.Separation1),
                        modifier = Modifier.testTag("BlueskyPostCard.header"),
                    ) {
                        AsyncImage(
                            model = post.authorAvatarUrl,
                            contentDescription = null,
                            modifier = Modifier
                                .size(48.dp)
                                .clip(CircleShape)
                                .background(RdpColors.LightGrey)
                                .testTag("BlueskyPostCard.avatar"),
                        )
                        Column(Modifier.weight(1f)) {
                            Text(
                                post.authorName,
                                modifier = Modifier.testTag("BlueskyPostCard.authorName"),
                                style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Bold),
                            )
                            Text(
                                "@${post.authorHandle}",
                                modifier = Modifier.testTag("BlueskyPostCard.authorHandle"),
                                style = MaterialTheme.typography.labelSmall,
                            )
                        }
                    }
                    Text(
                        post.body,
                        modifier = Modifier.testTag("BlueskyPostCard.body"),
                        style = MaterialTheme.typography.bodyLarge,
                    )
                }
                // Nuxt parity: 20×20 Bluesky-tinted butterfly pinned top-right of the card,
                // 16dp inset (e2e/parity/captures/home.json:PostBlueskyMark).
                Icon(
                    rdpBlueskyPainter(),
                    contentDescription = null,
                    tint = RdpColors.BrandBluesky,
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(spacing.Separation2)
                        .size(20.dp)
                        .pointerHoverIcon(PointerIcon.Hand)
                        .clickable { onShareClick() }
                        .testTag("BlueskyPostCard.blueskyMark"),
                )
            }
        }
    }
}
