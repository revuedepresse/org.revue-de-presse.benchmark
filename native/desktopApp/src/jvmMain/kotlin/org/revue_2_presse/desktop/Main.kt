package org.revue_2_presse.desktop

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import androidx.compose.ui.window.rememberWindowState
import org.revue_2_presse.design.theme.RdpTheme
import org.revue_2_presse.ui.components.Alert
import org.revue_2_presse.ui.components.AlertVariant
import org.revue_2_presse.ui.components.AuthCard
import org.revue_2_presse.ui.components.EmailField
import org.revue_2_presse.ui.components.FieldError
import org.revue_2_presse.ui.components.FormError
import org.revue_2_presse.ui.components.Logo
import org.revue_2_presse.ui.components.MediaPlaceholder
import org.revue_2_presse.ui.components.Notice
import org.revue_2_presse.ui.components.PasswordField
import org.revue_2_presse.ui.components.RdpButton
import org.revue_2_presse.ui.components.RdpCheckbox
import org.revue_2_presse.ui.components.RdpIcon
import org.revue_2_presse.ui.components.RdpLink
import org.revue_2_presse.ui.components.RdpTextField
import org.revue_2_presse.ui.components.Spinner

fun main() = application {
    val windowState = rememberWindowState(size = DpSize(960.dp, 720.dp))
    Window(onCloseRequest = ::exitApplication, state = windowState, title = "Revue de presse — desktop preview") {
        App()
    }
}

@Composable
fun App() {
    RdpTheme {
        Scaffold { padding ->
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .padding(16.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(16.dp),
            ) {
                Text("Component gallery — Plan 04")

                // Primitives
                Alert(variant = AlertVariant.Info) { Text("info") }
                Alert(variant = AlertVariant.Warning) { Text("warning") }
                RdpButton(onClick = {}) { Text("Continuer") }
                RdpCheckbox(checked = true, onCheckedChange = {}, label = { Text("Accept") })
                RdpIcon(name = "menu")
                RdpLink(href = "https://x", onClick = {}) { Text("link") }
                Logo()
                MediaPlaceholder()
                Notice { Text("nothing yet") }
                Spinner()

                // Forms
                RdpTextField(value = "", onValueChange = {}, label = "Texte")
                EmailField(value = "", onValueChange = {})
                PasswordField(value = "", onValueChange = {})
                FieldError(message = "Too short")
                FormError(message = "Bad creds")
                AuthCard(
                    title = "Connexion",
                    email = "", onEmailChange = {},
                    password = "", onPasswordChange = {},
                    onSubmit = {},
                    submitLabel = "Continuer",
                )
            }
        }
    }
}
