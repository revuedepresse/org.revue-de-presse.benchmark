package org.revue_2_presse.ui.components

import androidx.compose.material3.Text
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class AppTest {
    @Test fun renders_root_content_slot() = runComposeUiTest {
        setContent {
            RdpTheme {
                RdpApp(currentRoute = "/", onNavigate = {}) {
                    Text("child")
                }
            }
        }
        onNodeWithTag("App.root").assertIsDisplayed()
        onNodeWithText("child").assertIsDisplayed()
    }
}
