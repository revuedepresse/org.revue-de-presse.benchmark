package org.revue_2_presse.ui.components
import androidx.compose.material3.Text
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class IntroCardTest {
    @Test fun renders_title_and_body() = runComposeUiTest {
        setContent {
            RdpTheme {
                IntroCard(title = { Text("Bienvenue") }, body = { Text("Revue de presse") })
            }
        }
        onNodeWithTag("IntroCard.root").assertIsDisplayed()
        onNodeWithText("Bienvenue").assertIsDisplayed()
        onNodeWithText("Revue de presse").assertIsDisplayed()
    }
}
