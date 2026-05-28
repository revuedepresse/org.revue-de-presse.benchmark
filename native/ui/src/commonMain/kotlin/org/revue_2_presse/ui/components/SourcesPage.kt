package org.revue_2_presse.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.input.pointer.PointerIcon
import androidx.compose.ui.input.pointer.pointerHoverIcon
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import coil3.compose.AsyncImage
import org.revue_2_presse.design.i18n.rdpString
import org.revue_2_presse.design.theme.LocalRdpSpacing
import org.revue_2_presse.design.RdpColors
import org.revue_2_presse.domain.entities.Source
import org.revue_2_presse.domain.i18n.RdpStrings

// SourcesPage in the Nuxt app shows an intro card (h1 + intro paragraph + footnote)
// followed by the list of sources. Mirroring that here: a fixed RdpStaticPageSurface
// header sticks to the top of the LazyColumn via the `item {}` slot, then each Source
// renders as an OutlinedCard row beneath it.
@Composable
fun SourcesPage(
    sources: List<Source>,
    onSourceClick: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    val spacing = LocalRdpSpacing.current
    val openExternalUrl = LocalOpenExternalUrl.current
    // Sort alphanumerically by displayName (case-insensitive), with screenName as
    // a stable tie-breaker. Matches the Nuxt sources page reading order.
    val sorted = remember(sources) {
        sources.sortedWith(compareBy({ it.displayName.lowercase() }, { it.screenName }))
    }
    LazyColumn(modifier.testTag("SourcesPage.root").fillMaxSize(),
               contentPadding = PaddingValues(spacing.Separation2),
               verticalArrangement = Arrangement.spacedBy(spacing.Separation1)) {
        item("intro") {
            RdpStaticPageSurface(title = rdpString(RdpStrings.Key.PagesSourcesTitle), scrollable = false) {
                Text(
                    rdpString(RdpStrings.Key.PagesSourcesIntro),
                    style = RdpStaticPageStyles.body(),
                    modifier = Modifier.testTag("SourcesPage.intro"),
                )
                Spacer(Modifier.height(spacing.Separation2))
                Text(
                    rdpString(RdpStrings.Key.PagesSourcesFootnote),
                    style = RdpStaticPageStyles.footnote(),
                    modifier = Modifier.testTag("SourcesPage.footnote"),
                )
            }
        }
        items(sorted, key = { it.screenName }) { src ->
            OutlinedCard(
                modifier = Modifier
                    .testTag("SourcesPage.row.${src.screenName}")
                    .fillMaxWidth()
                    .pointerHoverIcon(PointerIcon.Hand)
                    .clickable {
                        openExternalUrl("https://bsky.app/profile/${src.screenName}")
                        onSourceClick(src.screenName)
                    },
                colors = CardDefaults.outlinedCardColors(containerColor = RdpColors.White),
                border = BorderStroke(1.dp, RdpColors.Border),
            ) {
                Row(
                    Modifier.padding(spacing.Separation2),
                    horizontalArrangement = Arrangement.spacedBy(spacing.Separation1),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    AsyncImage(
                        model = src.avatarUrl,
                        contentDescription = null,
                        modifier = Modifier
                            .size(48.dp)
                            .clip(CircleShape)
                            .background(RdpColors.LightGrey)
                            .testTag("SourcesPage.avatar.${src.screenName}"),
                    )
                    Column(
                        Modifier.weight(1f),
                        verticalArrangement = Arrangement.spacedBy(spacing.Separation0),
                    ) {
                        Text(
                            src.displayName,
                            style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Bold),
                        )
                        Text(
                            "@${src.screenName}",
                            style = MaterialTheme.typography.labelSmall,
                        )
                    }
                }
            }
        }
    }
}
