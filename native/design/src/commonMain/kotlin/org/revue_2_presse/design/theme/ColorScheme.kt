package org.revue_2_presse.design.theme

import androidx.compose.material3.ColorScheme
import androidx.compose.material3.lightColorScheme
import org.revue_2_presse.design.RdpColors

fun rdpLightColorScheme(): ColorScheme = lightColorScheme(
    primary       = RdpColors.Brand,
    onPrimary     = RdpColors.White,
    secondary     = RdpColors.BrandActive,
    onSecondary   = RdpColors.White,
    background    = RdpColors.TaupeGrey,
    onBackground  = RdpColors.ContentText,
    surface       = RdpColors.White,
    onSurface     = RdpColors.ContentText,
    error         = RdpColors.Error,
    onError       = RdpColors.White,
    outline       = RdpColors.Border,
)
