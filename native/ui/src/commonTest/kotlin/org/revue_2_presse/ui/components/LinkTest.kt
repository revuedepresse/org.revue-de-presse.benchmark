package org.revue_2_presse.ui.components

import androidx.compose.material3.Text
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test
import kotlin.test.assertEquals

@OptIn(ExperimentalTestApi::class)
class LinkTest {
    @Test fun fires_callback_on_click_with_url() = runComposeUiTest {
        var clicked: String? = null
        setContent {
            RdpTheme {
                RdpLink(href = "https://revue-de-presse.org", onClick = { clicked = it }) {
                    Text("home")
                }
            }
        }
        onNodeWithTag("Link.root").performClick()
        assertEquals("https://revue-de-presse.org", clicked)
    }
}
