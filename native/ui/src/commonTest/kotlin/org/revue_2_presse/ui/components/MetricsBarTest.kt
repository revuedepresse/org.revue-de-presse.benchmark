package org.revue_2_presse.ui.components
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import org.revue_2_presse.domain.entities.Metrics
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class MetricsBarTest {
    @Test fun renders_3_metric_counts() = runComposeUiTest {
        setContent { RdpTheme { MetricsBar(metrics = Metrics(replies = 12, reposts = 80, likes = 127)) } }
        onNodeWithTag("MetricsBar.root").assertIsDisplayed()
        onNodeWithText("12").assertIsDisplayed()
        onNodeWithText("80").assertIsDisplayed()
        onNodeWithText("127").assertIsDisplayed()
    }
}
