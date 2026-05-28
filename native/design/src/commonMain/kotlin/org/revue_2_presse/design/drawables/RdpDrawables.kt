package org.revue_2_presse.design.drawables

import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.painter.Painter
import org.jetbrains.compose.resources.painterResource
import native.design.generated.resources.Res
import native.design.generated.resources.bluesky
import native.design.generated.resources.logo
import native.design.generated.resources.netlify

@Composable
fun rdpLogoPainter(): Painter = painterResource(Res.drawable.logo)

@Composable
fun rdpBlueskyPainter(): Painter = painterResource(Res.drawable.bluesky)

@Composable
fun rdpNetlifyPainter(): Painter = painterResource(Res.drawable.netlify)
