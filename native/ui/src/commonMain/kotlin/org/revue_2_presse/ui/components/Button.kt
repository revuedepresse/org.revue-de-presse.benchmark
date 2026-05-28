package org.revue_2_presse.ui.components

import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import org.revue_2_presse.design.theme.LocalRdpRadii
import org.revue_2_presse.design.theme.LocalRdpSpacing
import org.revue_2_presse.design.RdpColors

@Composable
fun RdpButton(
    onClick: () -> Unit,
    enabled: Boolean = true,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    val radii = LocalRdpRadii.current
    val spacing = LocalRdpSpacing.current
    Button(
        onClick = onClick,
        enabled = enabled,
        modifier = modifier.testTag("Button.root"),
        shape = RoundedCornerShape(radii.Default),
        colors = ButtonDefaults.buttonColors(
            containerColor = RdpColors.Brand,
            contentColor = RdpColors.White,
        ),
        contentPadding = PaddingValues(horizontal = spacing.Separation2, vertical = spacing.Separation1),
    ) { content() }
}
