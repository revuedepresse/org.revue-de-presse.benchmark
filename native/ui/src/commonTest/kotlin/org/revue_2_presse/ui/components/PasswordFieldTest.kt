package org.revue_2_presse.ui.components
import androidx.compose.runtime.*
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class PasswordFieldTest {
    @Test fun masks_input_by_default() = runComposeUiTest {
        setContent {
            RdpTheme {
                var v by remember { mutableStateOf("") }
                PasswordField(value = v, onValueChange = { v = it })
            }
        }
        onNodeWithTag("PasswordField.input").performTextInput("hunter2")
        onNodeWithTag("PasswordField.visibilityToggle").performClick()
    }
}
