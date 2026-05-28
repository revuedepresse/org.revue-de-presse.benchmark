package org.revue_2_presse.ui.components
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class SupportPageTest {
    @Test fun renders_heading_and_link() = runComposeUiTest {
        setContent { RdpTheme { SupportPage(onDonateClick = {}) } }
        onNodeWithTag("SupportPage.root").assertIsDisplayed()
        onNodeWithTag("SupportPage.donateLink").assertIsDisplayed()
    }
}
