package org.revue_2_presse.ui.components

import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test
import kotlin.test.assertTrue

@OptIn(ExperimentalTestApi::class)
class AuthCardTest {
    @Test fun renders_title_email_password_and_submit_button() = runComposeUiTest {
        var submitted = false
        setContent {
            RdpTheme {
                var email by remember { mutableStateOf("") }
                var pw by remember { mutableStateOf("") }
                AuthCard(
                    title = "Connexion",
                    email = email, onEmailChange = { email = it },
                    password = pw, onPasswordChange = { pw = it },
                    onSubmit = { submitted = true },
                    submitLabel = "Continuer",
                )
            }
        }
        onNodeWithTag("AuthCard.root").assertIsDisplayed()
        onNodeWithText("Connexion").assertIsDisplayed()
        onNodeWithTag("EmailField.input").assertIsDisplayed()
        onNodeWithTag("PasswordField.input").assertIsDisplayed()
        onNodeWithText("Continuer").performClick()
        assertTrue(submitted)
    }
}
