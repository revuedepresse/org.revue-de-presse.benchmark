package org.revue_2_presse.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import kotlinx.coroutines.flow.collectLatest
import org.revue_2_presse.domain.entities.SourceDetail
import org.revue_2_presse.domain.repositories.SourcesRepository
import org.revue_2_presse.ui.components.SnapshotsList
import org.revue_2_presse.ui.components.SnapshotsState

@Composable
fun SourceScreen(slug: String, repo: SourcesRepository, modifier: Modifier = Modifier) {
    var detail by remember { mutableStateOf<SourceDetail?>(null) }
    LaunchedEffect(slug) {
        repo.forSlug(slug).collectLatest { result ->
            detail = result.getOrNull()
        }
    }
    val state = detail?.let { SnapshotsState.Loaded(it.recentHighlights) } ?: SnapshotsState.Loading
    Box(modifier.testTag("SourceScreen.root")) {
        SnapshotsList(state)
    }
}
