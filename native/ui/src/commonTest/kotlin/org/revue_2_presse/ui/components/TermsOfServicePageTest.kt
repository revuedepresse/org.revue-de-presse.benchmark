package org.revue_2_presse.ui.components
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class TermsOfServicePageTest {
    @Test fun renders_root_and_heading() = runComposeUiTest {
        setContent { RdpTheme { TermsOfServicePage() } }
        onNodeWithTag("TermsOfServicePage.root").assertIsDisplayed()
        onNodeWithTag("TermsOfServicePage.heading").assertIsDisplayed()
    }
}
