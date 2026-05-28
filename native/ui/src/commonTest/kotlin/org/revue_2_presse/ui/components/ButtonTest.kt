package org.revue_2_presse.ui.components

import androidx.compose.material3.Text
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test
import kotlin.test.assertTrue

@OptIn(ExperimentalTestApi::class)
class ButtonTest {
    @Test fun renders_label_and_fires_click() = runComposeUiTest {
        var clicked = false
        setContent {
            RdpTheme {
                RdpButton(onClick = { clicked = true }) { Text("Continuer") }
            }
        }
        onNodeWithTag("Button.root").assertIsDisplayed()
        onNodeWithText("Continuer").performClick()
        assertTrue(clicked)
    }

    @Test fun disabled_button_does_not_fire_click() = runComposeUiTest {
        var clicked = false
        setContent {
            RdpTheme {
                RdpButton(enabled = false, onClick = { clicked = true }) { Text("Off") }
            }
        }
        onNodeWithText("Off").performClick()
        assertTrue(!clicked)
    }
}
