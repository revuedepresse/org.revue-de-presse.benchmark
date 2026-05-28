package org.revue_2_presse.ui.screens

import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class ContactScreenTest {
    @Test fun renders_root() = runComposeUiTest {
        setContent { RdpTheme { ContactScreen(onSubmit = { _, _, _ -> }) } }
        onNodeWithTag("ContactScreen.root").assertIsDisplayed()
    }
}
