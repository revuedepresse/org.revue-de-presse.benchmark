package org.revue_2_presse.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import org.revue_2_presse.design.theme.LocalRdpSpacing
import org.revue_2_presse.design.RdpColors

@Composable
fun RdpCheckbox(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    label: @Composable (() -> Unit)? = null,
) {
    val spacing = LocalRdpSpacing.current
    Row(modifier = modifier.testTag("Checkbox.root"),
        horizontalArrangement = Arrangement.spacedBy(spacing.Separation1),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Checkbox(
            checked = checked,
            onCheckedChange = onCheckedChange,
            modifier = Modifier.testTag("Checkbox.box"),
            colors = CheckboxDefaults.colors(
                checkedColor = RdpColors.Brand,
                uncheckedColor = RdpColors.Border,
                checkmarkColor = RdpColors.White,
            ),
        )
        label?.invoke()
    }
}
