package org.revue_2_presse.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import org.revue_2_presse.design.theme.LocalRdpSpacing
import org.revue_2_presse.domain.entities.Source

@Composable
fun SourcesPage(
    sources: List<Source>,
    onSourceClick: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    val spacing = LocalRdpSpacing.current
    LazyColumn(modifier.testTag("SourcesPage.root").fillMaxSize(),
               contentPadding = PaddingValues(spacing.Separation2),
               verticalArrangement = Arrangement.spacedBy(spacing.Separation1)) {
        items(sources, key = { it.screenName }) { src ->
            Row(Modifier
                .testTag("SourcesPage.row.${src.screenName}")
                .fillMaxWidth()
                .clickable { onSourceClick(src.screenName) }
                .padding(spacing.Separation1),
                verticalAlignment = Alignment.CenterVertically) {
                Column {
                    Text(src.displayName)
                    Text("@${src.screenName}")
                    Text("${src.highlightsCount} publications")
                }
            }
        }
    }
}
