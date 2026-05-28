package org.revue_2_presse.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.style.TextAlign
import org.revue_2_presse.design.theme.LocalRdpSpacing
import org.revue_2_presse.design.RdpColors

@Composable
fun AuthCard(
    title: String,
    email: String,
    onEmailChange: (String) -> Unit,
    password: String,
    onPasswordChange: (String) -> Unit,
    onSubmit: () -> Unit,
    submitLabel: String,
    modifier: Modifier = Modifier,
    emailError: String? = null,
    passwordError: String? = null,
    formError: String? = null,
) {
    val spacing = LocalRdpSpacing.current
    Card(
        modifier = modifier.testTag("AuthCard.root").fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = RdpColors.White),
    ) {
        Column(Modifier.padding(spacing.Separation2), verticalArrangement = Arrangement.spacedBy(spacing.Separation2)) {
            Text(title, modifier = Modifier.fillMaxWidth().testTag("AuthCard.title"), textAlign = TextAlign.Center)
            FormError(formError)
            EmailField(email, onEmailChange, isError = emailError != null)
            FieldError(emailError)
            PasswordField(password, onPasswordChange, isError = passwordError != null)
            FieldError(passwordError)
            RdpButton(onClick = onSubmit, modifier = Modifier.fillMaxWidth().testTag("AuthCard.submit")) {
                Text(submitLabel)
            }
        }
    }
}
