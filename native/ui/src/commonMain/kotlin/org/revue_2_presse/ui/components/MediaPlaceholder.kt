package org.revue_2_presse.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.testTag
import org.revue_2_presse.design.theme.LocalRdpRadii
import org.revue_2_presse.design.RdpColors

@Composable
fun MediaPlaceholder(aspect: Float = 16f / 9f, modifier: Modifier = Modifier) {
    val radii = LocalRdpRadii.current
    Box(modifier
        .testTag("MediaPlaceholder.root")
        .fillMaxWidth()
        .aspectRatio(aspect)
        .clip(RoundedCornerShape(radii.Default))
        .background(RdpColors.BackgroundOtherMonth))
}
