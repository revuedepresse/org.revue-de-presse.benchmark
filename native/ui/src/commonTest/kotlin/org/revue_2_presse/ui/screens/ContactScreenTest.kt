package org.revue_2_presse.ui.screens

import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class ContactScreenTest {
    @Test fun renders_root_with_email() = runComposeUiTest {
        setContent { RdpTheme { ContactScreen() } }
        onNodeWithTag("ContactScreen.root").assertIsDisplayed()
        onNodeWithTag("ContactPage.email").assertIsDisplayed()
    }
}
