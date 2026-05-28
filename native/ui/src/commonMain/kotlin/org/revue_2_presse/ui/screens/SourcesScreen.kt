package org.revue_2_presse.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import kotlinx.coroutines.flow.collectLatest
import org.revue_2_presse.domain.entities.Source
import org.revue_2_presse.domain.repositories.SourcesRepository
import org.revue_2_presse.ui.components.SourcesPage

@Composable
fun SourcesScreen(repo: SourcesRepository, onSourceClick: (String) -> Unit, modifier: Modifier = Modifier) {
    var sources by remember { mutableStateOf<List<Source>>(emptyList()) }
    LaunchedEffect(Unit) {
        repo.all().collectLatest { result ->
            sources = result.getOrElse { emptyList() }
        }
    }
    Box(modifier.testTag("SourcesScreen.root")) {
        SourcesPage(sources, onSourceClick)
    }
}
