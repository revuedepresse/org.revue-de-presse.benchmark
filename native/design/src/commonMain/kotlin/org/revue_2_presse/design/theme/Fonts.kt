package org.revue_2_presse.design.theme

import androidx.compose.runtime.Composable
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import org.jetbrains.compose.resources.Font
import native.design.generated.resources.Res
import native.design.generated.resources.Roboto_Medium
import native.design.generated.resources.Roboto_Regular
import native.design.generated.resources.Signika_Regular

@Composable
fun RobotoFamily(): FontFamily = FontFamily(
    Font(Res.font.Roboto_Regular, weight = FontWeight.Normal),
    Font(Res.font.Roboto_Medium,  weight = FontWeight.Medium),
)

@Composable
fun SignikaFamily(): FontFamily = FontFamily(
    Font(Res.font.Signika_Regular, weight = FontWeight.Normal),
)
