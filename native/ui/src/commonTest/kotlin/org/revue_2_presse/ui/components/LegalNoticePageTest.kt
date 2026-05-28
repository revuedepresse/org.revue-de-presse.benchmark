package org.revue_2_presse.ui.components
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class LegalNoticePageTest {
    @Test fun renders_root_and_heading() = runComposeUiTest {
        setContent { RdpTheme { LegalNoticePage() } }
        onNodeWithTag("LegalNoticePage.root").assertIsDisplayed()
        onNodeWithTag("LegalNoticePage.heading").assertIsDisplayed()
    }
}
