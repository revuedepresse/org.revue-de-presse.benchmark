package org.revue_2_presse.ui.components
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class FormErrorTest {
    @Test fun renders_alert_warning_variant() = runComposeUiTest {
        setContent { RdpTheme { FormError(message = "Identifiants invalides") } }
        onNodeWithTag("FormError.root").assertIsDisplayed()
        onNodeWithTag("Alert.root--warning").assertIsDisplayed()
    }
}
