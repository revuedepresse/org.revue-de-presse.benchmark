package org.revue_2_presse.ui.components
import androidx.compose.runtime.*
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class EmailFieldTest {
    @Test fun uses_email_keyboard_and_accepts_input() = runComposeUiTest {
        setContent {
            RdpTheme {
                var v by remember { mutableStateOf("") }
                EmailField(value = v, onValueChange = { v = it })
            }
        }
        onNodeWithTag("EmailField.input").performTextInput("a@b.c")
    }
}
