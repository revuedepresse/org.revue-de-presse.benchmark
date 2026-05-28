package org.revue_2_presse.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import org.revue_2_presse.design.i18n.rdpString
import org.revue_2_presse.design.theme.LocalRdpSpacing
import org.revue_2_presse.design.RdpColors
import org.revue_2_presse.domain.i18n.RdpStrings

// NOTE: RdpStrings has no BannerAboutLabel key; FooterAboutHeading ("À propos"/"About") is used
// as the closest semantic substitute until the key is added to the design-system locales.
@Composable
fun BannerAbout(onClick: () -> Unit, modifier: Modifier = Modifier) {
    val spacing = LocalRdpSpacing.current
    Box(modifier
        .testTag("BannerAbout.root")
        .fillMaxWidth()
        .background(RdpColors.Brand)
        .clickable(onClick = onClick)
        .padding(spacing.Separation2),
        contentAlignment = Alignment.Center) {
        Text(rdpString(RdpStrings.Key.FooterAboutHeading), color = RdpColors.White)
    }
}
