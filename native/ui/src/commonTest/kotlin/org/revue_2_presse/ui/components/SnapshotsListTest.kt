package org.revue_2_presse.ui.components

import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import org.revue_2_presse.domain.entities.AppError
import org.revue_2_presse.domain.entities.Highlight
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class SnapshotsListTest {
    @Test fun loading_state_shows_spinner() = runComposeUiTest {
        setContent { RdpTheme { SnapshotsList(state = SnapshotsState.Loading) } }
        onNodeWithTag("Spinner.root").assertIsDisplayed()
    }
    @Test fun empty_state_shows_notice() = runComposeUiTest {
        setContent { RdpTheme { SnapshotsList(state = SnapshotsState.Loaded(items = emptyList())) } }
        onNodeWithTag("Notice.root").assertIsDisplayed()
    }
    @Test fun error_state_shows_alert() = runComposeUiTest {
        setContent { RdpTheme { SnapshotsList(state = SnapshotsState.Failed(error = AppError.Offline)) } }
        onNodeWithTag("Alert.root--warning").assertIsDisplayed()
    }
}
