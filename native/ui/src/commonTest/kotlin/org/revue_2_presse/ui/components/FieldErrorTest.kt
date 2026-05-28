package org.revue_2_presse.ui.components
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class FieldErrorTest {
    @Test fun renders_message_in_error_colour() = runComposeUiTest {
        setContent { RdpTheme { FieldError(message = "Trop court") } }
        onNodeWithTag("FieldError.root").assertIsDisplayed()
        onNodeWithText("Trop court").assertIsDisplayed()
    }
    @Test fun hides_when_message_is_null() = runComposeUiTest {
        setContent { RdpTheme { FieldError(message = null) } }
        onNodeWithTag("FieldError.root").assertDoesNotExist()
    }
}
