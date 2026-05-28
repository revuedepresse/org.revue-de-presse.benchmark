package org.revue_2_presse.design.theme

import androidx.compose.runtime.compositionLocalOf
import androidx.compose.runtime.staticCompositionLocalOf
import org.revue_2_presse.design.RdpColors
import org.revue_2_presse.design.RdpRadii
import org.revue_2_presse.design.RdpSizes
import org.revue_2_presse.design.RdpSpacing
import org.revue_2_presse.design.RdpType
import org.revue_2_presse.domain.i18n.RdpLocale

val LocalRdpLocale = compositionLocalOf<RdpLocale> { error("RdpTheme not set") }
val LocalRdpColors = staticCompositionLocalOf { RdpColors }
val LocalRdpSpacing = staticCompositionLocalOf { RdpSpacing }
val LocalRdpRadii = staticCompositionLocalOf { RdpRadii }
val LocalRdpSizes = staticCompositionLocalOf { RdpSizes }
val LocalRdpType = staticCompositionLocalOf { RdpType }
