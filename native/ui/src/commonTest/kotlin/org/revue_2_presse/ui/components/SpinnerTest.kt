package org.revue_2_presse.ui.components
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class SpinnerTest {
    @Test fun renders() = runComposeUiTest {
        setContent { RdpTheme { Spinner() } }
        onNodeWithTag("Spinner.root").assertIsDisplayed()
    }
}
