package org.revue_2_presse.design.drawables

import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.painter.Painter
import org.jetbrains.compose.resources.painterResource
import native.design.generated.resources.Res
import native.design.generated.resources.bluesky
import native.design.generated.resources.icon_funding
import native.design.generated.resources.icon_introducing
import native.design.generated.resources.icon_sharing
import native.design.generated.resources.logo
import native.design.generated.resources.netlify
import native.design.generated.resources.play_store_badge

@Composable
fun rdpLogoPainter(): Painter = painterResource(Res.drawable.logo)

@Composable
fun rdpBlueskyPainter(): Painter = painterResource(Res.drawable.bluesky)

@Composable
fun rdpNetlifyPainter(): Painter = painterResource(Res.drawable.netlify)

@Composable
fun rdpSharingIconPainter(): Painter = painterResource(Res.drawable.icon_sharing)

@Composable
fun rdpIntroducingIconPainter(): Painter = painterResource(Res.drawable.icon_introducing)

@Composable
fun rdpFundingIconPainter(): Painter = painterResource(Res.drawable.icon_funding)

@Composable
fun rdpPlayStoreBadgePainter(): Painter = painterResource(Res.drawable.play_store_badge)
