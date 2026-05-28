package org.revue_2_presse.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import kotlinx.coroutines.flow.collectLatest
import kotlinx.datetime.*
import org.revue_2_presse.domain.entities.AppError
import org.revue_2_presse.domain.repositories.HighlightsRepository
import org.revue_2_presse.ui.components.SnapshotsList
import org.revue_2_presse.ui.components.SnapshotsState

@Composable
fun HomeScreen(repo: HighlightsRepository, onNavigate: (String) -> Unit, modifier: Modifier = Modifier) {
    var state by remember { mutableStateOf<SnapshotsState>(SnapshotsState.Loading) }
    val today = remember { Clock.System.todayIn(TimeZone.of("Europe/Paris")) }
    val yesterday = remember { today.minus(DatePeriod(days = 1)) }

    LaunchedEffect(yesterday) {
        repo.forDay(yesterday).collectLatest { result ->
            state = result.fold(
                onSuccess = { SnapshotsState.Loaded(it) },
                onFailure = { SnapshotsState.Failed(AppError.from(it)) },
            )
        }
    }

    Box(modifier.testTag("HomeScreen.root")) {
        SnapshotsList(state = state)
    }
}
