package org.revue_2_presse.design.theme

import androidx.compose.material3.Typography
import androidx.compose.runtime.Composable
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.sp
import org.revue_2_presse.design.RdpColors
import org.revue_2_presse.design.RdpType

@Composable
fun rdpTypography(): Typography {
    val roboto = RobotoFamily()
    val signika = SignikaFamily()
    return Typography(
        bodyMedium = TextStyle(
            fontFamily = roboto,
            fontSize = RdpType.FontSizeContent,
            lineHeight = RdpType.LineSpacingContent,
            color = RdpColors.ContentText,
        ),
        bodyLarge = TextStyle(
            fontFamily = roboto,
            fontSize = RdpType.FontSizeStatusText,
            lineHeight = RdpType.LineSpacingStatusText,
            color = RdpColors.ContentText,
        ),
        labelSmall = TextStyle(
            fontFamily = roboto,
            fontSize = RdpType.FontSizePublicationDate,
            color = RdpColors.LightGrey,
        ),
        titleLarge = TextStyle(
            fontFamily = signika,
            fontSize = 24.sp,
            lineHeight = 29.sp,
            color = RdpColors.Brand,
        ),
        titleMedium = TextStyle(
            fontFamily = signika,
            fontSize = RdpType.FontSizeFooterTitle,
            color = RdpColors.Brand,
        ),
    )
}
