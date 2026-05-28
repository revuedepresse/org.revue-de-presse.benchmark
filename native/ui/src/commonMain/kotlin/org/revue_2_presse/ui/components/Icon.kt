package org.revue_2_presse.ui.components

import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import org.revue_2_presse.design.icons.RdpIcons
import org.revue_2_presse.design.RdpColors

@Composable
fun RdpIcon(
    name: String,
    modifier: Modifier = Modifier,
    contentDescription: String? = null,
) {
    val vector: ImageVector = when (name) {
        "menu" -> RdpIcons.Menu
        "close" -> RdpIcons.Close
        "share" -> RdpIcons.Share
        else -> return
    }
    Icon(
        imageVector = vector,
        contentDescription = contentDescription,
        modifier = modifier.testTag("Icon.$name"),
        tint = RdpColors.ContentText,
    )
}
