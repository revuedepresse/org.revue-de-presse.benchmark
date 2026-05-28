package org.revue_2_presse.ui.components
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import org.revue_2_presse.design.RdpColors

@Composable
fun FieldError(message: String?, modifier: Modifier = Modifier) {
    if (message.isNullOrBlank()) return
    Text(
        text = message,
        modifier = modifier.testTag("FieldError.root"),
        color = RdpColors.VanityMetricLike,
    )
}
