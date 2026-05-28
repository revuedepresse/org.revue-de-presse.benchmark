package org.revue_2_presse.ui.components

import androidx.compose.runtime.*
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test
import kotlin.test.assertTrue

@OptIn(ExperimentalTestApi::class)
class ContactPageTest {
    @Test fun renders_form_and_submits() = runComposeUiTest {
        var submitted = false
        setContent {
            RdpTheme {
                ContactPage(onSubmit = { _, _, _ -> submitted = true })
            }
        }
        onNodeWithTag("ContactPage.root").assertIsDisplayed()
        onNodeWithTag("EmailField.input").performTextInput("a@b.c")
        onNodeWithTag("ContactPage.subject").performTextInput("Bonjour")
        onNodeWithTag("ContactPage.message").performTextInput("Salut")
        onNodeWithTag("ContactPage.submit").performClick()
        assertTrue(submitted)
    }
}
