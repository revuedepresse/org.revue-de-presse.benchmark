package org.revue_2_presse.ui.screens

import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class TermsOfServiceScreenTest {
    @Test fun renders_root() = runComposeUiTest {
        setContent { RdpTheme { TermsOfServiceScreen() } }
        onNodeWithTag("TermsOfServiceScreen.root").assertIsDisplayed()
    }
}
