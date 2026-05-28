package org.revue_2_presse.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.OpenInNew
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import org.revue_2_presse.design.theme.LocalRdpSpacing

@Composable
fun WebIntents(
    url: String,
    onOpen: (String) -> Unit,
    onShare: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    val spacing = LocalRdpSpacing.current
    Row(modifier.testTag("WebIntents.root"), horizontalArrangement = Arrangement.spacedBy(spacing.Separation1)) {
        IconButton(onClick = { onOpen(url) }, modifier = Modifier.testTag("WebIntents.openButton")) {
            Icon(Icons.Filled.OpenInNew, contentDescription = null)
        }
        IconButton(onClick = { onShare(url) }, modifier = Modifier.testTag("WebIntents.shareButton")) {
            Icon(Icons.Filled.Share, contentDescription = null)
        }
    }
}
