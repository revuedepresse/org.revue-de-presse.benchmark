package org.revue_2_presse.ui.components
import androidx.compose.material3.Text
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class NoticeTest {
    @Test fun renders_message_and_default_styling() = runComposeUiTest {
        setContent { RdpTheme { Notice { Text("Aucune publication") } } }
        onNodeWithTag("Notice.root").assertIsDisplayed()
        onNodeWithText("Aucune publication").assertIsDisplayed()
    }
}
