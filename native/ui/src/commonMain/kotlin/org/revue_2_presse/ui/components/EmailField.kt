package org.revue_2_presse.ui.components
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.input.KeyboardType
import org.revue_2_presse.design.i18n.rdpString
import org.revue_2_presse.domain.i18n.RdpStrings

@Composable
fun EmailField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    isError: Boolean = false,
) {
    RdpTextField(
        value = value,
        onValueChange = onValueChange,
        label = rdpString(RdpStrings.Key.AuthEmailLabel),
        modifier = modifier.testTag("EmailField.input"),
        keyboardType = KeyboardType.Email,
        isError = isError,
    )
}
