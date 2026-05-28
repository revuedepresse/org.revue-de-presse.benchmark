package org.revue_2_presse.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import org.revue_2_presse.design.theme.LocalRdpSpacing

@Composable
fun ContactPage(
    onSubmit: (email: String, subject: String, message: String) -> Unit,
    modifier: Modifier = Modifier,
) {
    val spacing = LocalRdpSpacing.current
    var email by remember { mutableStateOf("") }
    var subject by remember { mutableStateOf("") }
    var message by remember { mutableStateOf("") }

    Column(modifier
        .testTag("ContactPage.root")
        .fillMaxSize()
        .padding(spacing.Separation2),
        verticalArrangement = Arrangement.spacedBy(spacing.Separation2)) {
        Text("Nous contacter")
        EmailField(value = email, onValueChange = { email = it })
        RdpTextField(value = subject, onValueChange = { subject = it },
                     label = "Sujet",
                     modifier = Modifier.testTag("ContactPage.subject"))
        RdpTextField(value = message, onValueChange = { message = it },
                     label = "Message",
                     modifier = Modifier.testTag("ContactPage.message"))
        RdpButton(
            onClick = { onSubmit(email, subject, message) },
            modifier = Modifier.fillMaxWidth().testTag("ContactPage.submit"),
        ) { Text("Envoyer") }
    }
}
