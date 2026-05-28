package org.revue_2_presse.ui.components

import androidx.compose.foundation.layout.Box
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag

@Composable
fun FormError(message: String?, modifier: Modifier = Modifier) {
    if (message.isNullOrBlank()) return
    Box(modifier = modifier.testTag("FormError.root")) {
        Alert(variant = AlertVariant.Warning) { Text(message) }
    }
}
