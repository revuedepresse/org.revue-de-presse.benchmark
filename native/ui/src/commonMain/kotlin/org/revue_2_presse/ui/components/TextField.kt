package org.revue_2_presse.ui.components
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.input.KeyboardType
import org.revue_2_presse.design.RdpColors

@Composable
fun RdpTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    keyboardType: KeyboardType = KeyboardType.Text,
    isError: Boolean = false,
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label) },
        modifier = modifier.fillMaxWidth().testTag("TextField.input"),
        keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
        isError = isError,
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = RdpColors.Brand,
            unfocusedBorderColor = RdpColors.Border,
            errorBorderColor = RdpColors.VanityMetricLike,
        ),
    )
}
