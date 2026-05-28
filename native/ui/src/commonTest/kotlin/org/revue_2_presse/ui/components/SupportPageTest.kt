package org.revue_2_presse.ui.components
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import org.revue_2_presse.domain.i18n.RdpLocale
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class SupportPageTest {
    @Test fun renders_heading_and_github_link() = runComposeUiTest {
        setContent { RdpTheme(locale = RdpLocale.FR_FR) { SupportPage(onDonateClick = {}) } }
        onNodeWithTag("SupportPage.root").assertIsDisplayed()
        onNodeWithText("Nous soutenir").assertIsDisplayed()
        onNodeWithTag("SupportPage.githubLink").assertIsDisplayed()
    }
}
