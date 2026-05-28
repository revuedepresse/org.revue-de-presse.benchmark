package org.revue_2_presse.design.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Shapes
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import org.revue_2_presse.design.i18n.currentRdpLocale
import org.revue_2_presse.design.RdpColors
import org.revue_2_presse.design.RdpRadii
import org.revue_2_presse.design.RdpSizes
import org.revue_2_presse.design.RdpSpacing
import org.revue_2_presse.design.RdpType
import org.revue_2_presse.domain.i18n.RdpLocale

@Composable
fun RdpTheme(
    locale: RdpLocale = currentRdpLocale(),
    content: @Composable () -> Unit,
) {
    CompositionLocalProvider(
        LocalRdpLocale provides locale,
        LocalRdpColors provides RdpColors,
        LocalRdpSpacing provides RdpSpacing,
        LocalRdpRadii provides RdpRadii,
        LocalRdpSizes provides RdpSizes,
        LocalRdpType provides RdpType,
    ) {
        MaterialTheme(
            colorScheme = rdpLightColorScheme(),
            typography = rdpTypography(),
            shapes = Shapes(
                extraSmall = RoundedCornerShape(RdpRadii.DatePicker),
                small = RoundedCornerShape(RdpRadii.Selectable),
                medium = RoundedCornerShape(RdpRadii.Default),
                large = RoundedCornerShape(RdpRadii.Default),
                extraLarge = RoundedCornerShape(RdpRadii.Default),
            ),
            content = content,
        )
    }
}
