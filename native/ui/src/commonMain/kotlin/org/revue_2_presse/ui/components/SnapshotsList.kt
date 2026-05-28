package org.revue_2_presse.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import org.revue_2_presse.design.i18n.rdpString
import org.revue_2_presse.design.theme.LocalRdpSpacing
import org.revue_2_presse.domain.entities.AppError
import org.revue_2_presse.domain.entities.Highlight
import org.revue_2_presse.domain.i18n.RdpStrings

sealed interface SnapshotsState {
    data object Loading : SnapshotsState
    data class Loaded(val items: List<Highlight>) : SnapshotsState
    data class Failed(val error: AppError) : SnapshotsState
}

@Composable
fun SnapshotsList(state: SnapshotsState, modifier: Modifier = Modifier) {
    val spacing = LocalRdpSpacing.current
    when (state) {
        SnapshotsState.Loading -> Box(modifier.fillMaxWidth().padding(spacing.Separation3),
                                       contentAlignment = Alignment.Center) { Spinner() }
        is SnapshotsState.Loaded -> {
            if (state.items.isEmpty()) Notice { Text(rdpString(RdpStrings.Key.NoticesEmptyDay)) }
            else LazyColumn(modifier.testTag("SnapshotsList.root"),
                            verticalArrangement = Arrangement.spacedBy(spacing.Separation2),
                            contentPadding = PaddingValues(spacing.Separation2)) {
                items(state.items, key = { it.id }) { BlueskyPostCard(post = it) }
            }
        }
        is SnapshotsState.Failed -> {
            val key = when (state.error) {
                AppError.Offline -> RdpStrings.Key.ErrorsOffline
                AppError.Timeout -> RdpStrings.Key.ErrorsTimeout
                AppError.Unauthorized -> RdpStrings.Key.ErrorsUnauthorized
                is AppError.UpstreamFailure -> RdpStrings.Key.ErrorsUpstream
                AppError.EmptyDay -> RdpStrings.Key.NoticesEmptyDay
            }
            Alert(variant = AlertVariant.Warning) { Text(rdpString(key)) }
        }
    }
}
