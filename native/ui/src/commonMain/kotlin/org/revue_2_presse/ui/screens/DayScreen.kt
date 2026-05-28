package org.revue_2_presse.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import kotlinx.coroutines.flow.collectLatest
import kotlinx.datetime.LocalDate
import org.revue_2_presse.domain.entities.AppError
import org.revue_2_presse.domain.repositories.HighlightsRepository
import org.revue_2_presse.ui.components.SnapshotsList
import org.revue_2_presse.ui.components.SnapshotsState

@Composable
fun DayScreen(day: LocalDate, repo: HighlightsRepository, modifier: Modifier = Modifier) {
    var state by remember { mutableStateOf<SnapshotsState>(SnapshotsState.Loading) }
    LaunchedEffect(day) {
        repo.forDay(day).collectLatest { result ->
            state = result.fold(
                onSuccess = { SnapshotsState.Loaded(it) },
                onFailure = { SnapshotsState.Failed(AppError.from(it)) },
            )
        }
    }
    Box(modifier.testTag("DayScreen.root")) {
        SnapshotsList(state = state)
    }
}
