package org.revue_2_presse.ui.components

import androidx.compose.material3.Text
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class CheckboxTest {
    @Test fun toggle_emits_callback() = runComposeUiTest {
        setContent {
            RdpTheme {
                var checked by remember { mutableStateOf(false) }
                RdpCheckbox(checked = checked, onCheckedChange = { checked = it }, label = { Text("Accept") })
            }
        }
        onNodeWithTag("Checkbox.box").assertIsToggleable().assertIsOff().performClick()
        onNodeWithTag("Checkbox.box").assertIsOn()
    }
}
