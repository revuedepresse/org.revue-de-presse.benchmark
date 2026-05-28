package org.revue_2_presse.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import coil3.compose.AsyncImage
import org.revue_2_presse.design.theme.LocalRdpSpacing
import org.revue_2_presse.design.RdpColors
import org.revue_2_presse.domain.entities.Highlight

@Composable
fun BlueskyPostCard(
    post: Highlight,
    modifier: Modifier = Modifier,
    onAuthorClick: () -> Unit = {},
    onShareClick: () -> Unit = {},
) {
    val spacing = LocalRdpSpacing.current
    Card(
        modifier = modifier.testTag("BlueskyPostCard.root").fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = RdpColors.White),
    ) {
        Column(Modifier.padding(spacing.Separation2), verticalArrangement = Arrangement.spacedBy(spacing.Separation1)) {
            Row(verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(spacing.Separation1),
                modifier = Modifier.testTag("BlueskyPostCard.header")) {
                AsyncImage(
                    model = post.authorAvatarUrl,
                    contentDescription = null,
                    modifier = Modifier.size(40.dp).clip(CircleShape).testTag("BlueskyPostCard.avatar"),
                )
                Column(Modifier.weight(1f)) {
                    Text(post.authorName, modifier = Modifier.testTag("BlueskyPostCard.authorName"))
                    Text("@${post.authorHandle}", modifier = Modifier.testTag("BlueskyPostCard.authorHandle"),
                         color = RdpColors.LightGrey)
                }
                IconButton(onClick = onShareClick, modifier = Modifier.testTag("BlueskyPostCard.shareButton")) {
                    Icon(Icons.Filled.Share, contentDescription = null)
                }
            }
            Text(post.body, modifier = Modifier.testTag("BlueskyPostCard.body"))
            MetricsBar(post.metrics)
        }
    }
}
