package org.revue_2_presse.ui.components
import androidx.compose.runtime.*
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test
import kotlin.test.assertEquals

@OptIn(ExperimentalTestApi::class)
class TextFieldTest {
    @Test fun captures_input_changes() = runComposeUiTest {
        var captured = ""
        setContent {
            RdpTheme {
                var v by remember { mutableStateOf("") }
                RdpTextField(value = v, onValueChange = { v = it; captured = it }, label = "Nom")
            }
        }
        onNodeWithTag("TextField.input").performTextInput("Hello")
        assertEquals("Hello", captured)
    }
}
