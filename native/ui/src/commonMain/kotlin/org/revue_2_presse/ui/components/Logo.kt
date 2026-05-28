package org.revue_2_presse.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import org.revue_2_presse.design.drawables.rdpLogoPainter
import org.revue_2_presse.design.i18n.rdpString
import org.revue_2_presse.design.theme.LocalRdpSizes
import org.revue_2_presse.domain.i18n.RdpStrings

@Composable
fun Logo(modifier: Modifier = Modifier) {
    val sizes = LocalRdpSizes.current
    Image(
        painter = rdpLogoPainter(),
        contentDescription = rdpString(RdpStrings.Key.LogoAlt),
        modifier = modifier.height(sizes.LogoHeight).testTag("Logo.image"),
    )
}
