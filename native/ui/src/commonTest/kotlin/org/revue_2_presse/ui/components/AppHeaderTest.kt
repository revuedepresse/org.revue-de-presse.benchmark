package org.revue_2_presse.ui.components

import androidx.compose.material3.Text
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class AppHeaderTest {
    @Test fun renders_logo_and_right_slot() = runComposeUiTest {
        setContent {
            RdpTheme {
                AppHeader(right = { Text("EN") })
            }
        }
        onNodeWithTag("AppHeader.root").assertIsDisplayed()
        onNodeWithTag("AppHeader.inner").assertIsDisplayed()
        onNodeWithTag("Logo.image").assertIsDisplayed()
        onNodeWithText("EN").assertIsDisplayed()
    }
}
