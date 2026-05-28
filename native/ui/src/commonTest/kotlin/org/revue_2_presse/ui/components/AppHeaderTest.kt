package org.revue_2_presse.ui.components

import androidx.compose.material3.Text
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class AppHeaderTest {
    @Test fun renders_logo_title_and_right_slot() = runComposeUiTest {
        setContent {
            RdpTheme {
                AppHeader(
                    title = { Text("Revue de presse") },
                    right = { Text("EN") },
                )
            }
        }
        onNodeWithTag("AppHeader.root").assertIsDisplayed()
        onNodeWithTag("Logo.image").assertIsDisplayed()
        onNodeWithText("Revue de presse").assertIsDisplayed()
        onNodeWithText("EN").assertIsDisplayed()
    }
}
