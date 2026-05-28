package org.revue_2_presse.ui.components

import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import org.revue_2_presse.design.i18n.rdpString
import org.revue_2_presse.domain.i18n.RdpStrings

@Composable
fun PasswordField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    isError: Boolean = false,
) {
    var visible by remember { mutableStateOf(false) }
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(rdpString(RdpStrings.Key.AuthPasswordLabel)) },
        modifier = modifier.testTag("PasswordField.input"),
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
        visualTransformation = if (visible) VisualTransformation.None else PasswordVisualTransformation(),
        isError = isError,
        trailingIcon = {
            IconButton(onClick = { visible = !visible }, modifier = Modifier.testTag("PasswordField.visibilityToggle")) {
                Icon(if (visible) Icons.Filled.VisibilityOff else Icons.Filled.Visibility, contentDescription = null)
            }
        },
    )
}
