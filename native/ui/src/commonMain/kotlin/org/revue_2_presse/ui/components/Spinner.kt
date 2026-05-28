package org.revue_2_presse.ui.components
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import org.revue_2_presse.design.RdpColors

@Composable
fun Spinner(modifier: Modifier = Modifier) {
    CircularProgressIndicator(modifier = modifier.testTag("Spinner.root"), color = RdpColors.Brand)
}
