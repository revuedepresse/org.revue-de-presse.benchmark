package org.revue_2_presse.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.InlineTextContent
import androidx.compose.foundation.text.appendInlineContent
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.input.pointer.PointerIcon
import androidx.compose.ui.input.pointer.pointerHoverIcon
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.Placeholder
import androidx.compose.ui.text.PlaceholderVerticalAlign
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.datetime.Clock
import kotlinx.datetime.TimeZone
import kotlinx.datetime.todayIn
import org.revue_2_presse.design.RdpColors
import org.revue_2_presse.design.RdpRadii
import org.revue_2_presse.design.drawables.rdpFundingIconPainter
import org.revue_2_presse.design.drawables.rdpIntroducingIconPainter
import org.revue_2_presse.design.drawables.rdpNetlifyPainter
import org.revue_2_presse.design.drawables.rdpPlayStoreBadgePainter
import org.revue_2_presse.design.drawables.rdpSharingIconPainter
import org.revue_2_presse.design.i18n.rdpString
import org.revue_2_presse.design.theme.LocalRdpSpacing
import org.revue_2_presse.domain.i18n.RdpStrings

// Parity target: Nuxt-side Mitosis source design-system/src/components/BannerAbout.lite.tsx
// plus its token values in design-system/src/tokens/tokens.css (the values the
// Nuxt app actually renders — NOT RdpType, whose footer tokens are scraped from
// production research and diverge, e.g. title 26px vs the app's 20px).
//
// Font sizes (tokens.css): title 20 / paragraph 16 / outer-link 14 / copyright 12.
// Line-height: 1.4em (title overridden to a literal 30px in the Mitosis CSS).
// Margins (CSS): section titles 24 top (first 0) / 8 bottom; paragraphs 8 bottom
// (sharing paragraph 0); subscribe 6 top; play-store 8 top; copyright 24 top,
// 16 bottom, centered.
@Composable
fun BannerAbout(
    onNavigate: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    val spacing = LocalRdpSpacing.current
    val titleTop = spacing.Separation1 * 3 // 24dp — calc(3 * --separation-1)

    val titleStyle = TextStyle(
        fontSize = 20.sp,
        lineHeight = 30.sp,
        fontWeight = FontWeight.Bold,
        color = RdpColors.White,
    )
    val paragraphStyle = TextStyle(
        fontSize = 16.sp,
        lineHeight = 22.4.sp, // 16 * 1.4em
        color = RdpColors.ContentFont,
    )
    val linkStyle = paragraphStyle.copy(
        color = RdpColors.White,
        textDecoration = TextDecoration.Underline,
    )
    // subscribe-to: bold, 14sp, white, underlined. The CSS sets the link's own
    // text-decoration to none, but the less-specific `.rdp-banner-about a`
    // (0,1,1) outranks `.rdp-banner-about__subscribe-to` (0,1,0), so the
    // underline wins — confirmed against the Nuxt parity capture.
    val subscribeStyle = TextStyle(
        fontSize = 14.sp,
        lineHeight = 19.6.sp, // 14 * 1.4em
        fontWeight = FontWeight.Bold,
        color = RdpColors.White,
        textDecoration = TextDecoration.Underline,
    )
    val copyrightStyle = TextStyle(
        fontSize = 12.sp,
        lineHeight = 16.8.sp, // 12 * 1.4em
        color = RdpColors.White,
    )
    val inlineLinkSpan = SpanStyle(
        color = RdpColors.White,
        textDecoration = TextDecoration.Underline,
    )

    Column(
        modifier
            .testTag("BannerAbout.root")
            .fillMaxWidth()
            .clip(RoundedCornerShape(RdpRadii.Default))
            .background(RdpColors.ContentBackground)
            .padding(
                PaddingValues(
                    start = spacing.Separation2,
                    end = spacing.Separation2,
                    top = spacing.Separation2,
                    bottom = spacing.Separation3,
                ),
            ),
    ) {
        val openExternalUrl = LocalOpenExternalUrl.current

        // ----- Social / sharing -----
        SectionTitle("social", rdpString(RdpStrings.Key.FooterSocialHeading), rdpSharingIconPainter(), titleStyle, topPadding = 0.dp)
        Text(
            rdpString(RdpStrings.Key.FooterSharingBody),
            style = paragraphStyle,
            modifier = Modifier.padding(top = spacing.Separation1).testTag("BannerAbout.sharing.body"),
        )
        Text(
            rdpString(RdpStrings.Key.FooterSubscribeToLabel),
            style = subscribeStyle,
            modifier = Modifier
                .padding(top = spacing.Separation0)
                .testTag("BannerAbout.sharing.subscribe")
                .pointerHoverIcon(PointerIcon.Hand)
                .clickable {
                    openExternalUrl("https://bsky.app/profile/revue-de-presse.org")
                },
        )
        Image(
            painter = rdpPlayStoreBadgePainter(),
            contentDescription = "Disponible sur Google Play",
            modifier = Modifier
                .padding(top = spacing.Separation1)
                .width(193.dp)
                .height(75.dp)
                .testTag("BannerAbout.sharing.playStore")
                .pointerHoverIcon(PointerIcon.Hand)
                .clickable {
                    openExternalUrl("https://play.google.com/store/apps/details?id=org.revue_2_presse")
                },
        )

        // ----- About -----
        // No about-body paragraph: the Nuxt BannerAbout jumps straight from the
        // heading to the view-button links. footer.about.body exists in the
        // dictionary but the banner never renders it (confirmed via the parity
        // capture). The first link carries the title's 8dp bottom-margin gap.
        SectionTitle("about", rdpString(RdpStrings.Key.FooterAboutHeading), rdpIntroducingIconPainter(), titleStyle, topPadding = titleTop)
        FooterLink("legal", rdpString(RdpStrings.Key.FooterAboutPrivacyPolicy), linkStyle, topPadding = spacing.Separation1) { onNavigate("/mentions-legales") }
        FooterLink("terms", rdpString(RdpStrings.Key.FooterAboutTermsOfService), linkStyle) { onNavigate("/conditions-utilisation") }
        FooterLink("contact", rdpString(RdpStrings.Key.FooterAboutContact), linkStyle) { onNavigate("/nous-contacter") }
        FooterLink("support", rdpString(RdpStrings.Key.FooterAboutSupport), linkStyle) { onNavigate("/nous-soutenir") }
        FooterLink("sources", rdpString(RdpStrings.Key.FooterAboutSources), linkStyle) { onNavigate("/sources") }

        // ----- Pro bono publico -----
        SectionTitle("proBono", rdpString(RdpStrings.Key.FooterProBonoHeading), rdpFundingIconPainter(), titleStyle, topPadding = titleTop)
        val proBonoBody = buildAnnotatedString {
            append(rdpString(RdpStrings.Key.FooterProBonoBodyBeforeAuthor1))
            withStyle(inlineLinkSpan) { append("@sylvainegarderet.bsky.social") }
            append(rdpString(RdpStrings.Key.FooterProBonoBodyBetweenAuthors))
            withStyle(inlineLinkSpan) { append("@thierry.marianne.io") }
            append(rdpString(RdpStrings.Key.FooterProBonoBodyAfterAuthor2))
            append("\n\n")
            appendInlineContent("netlify-mark", "[Netlify]")
            append(" ")
            withStyle(inlineLinkSpan) { append("Netlify") }
            append(rdpString(RdpStrings.Key.FooterProBonoBodyNetlifySuffix))
            withStyle(inlineLinkSpan) { append(rdpString(RdpStrings.Key.FooterProBonoBodyNetlifyProgram)) }
            append(rdpString(RdpStrings.Key.FooterProBonoBodyTail))
        }
        val inlineContent = mapOf(
            "netlify-mark" to InlineTextContent(
                Placeholder(20.sp, 20.sp, PlaceholderVerticalAlign.TextCenter),
            ) {
                Image(
                    painter = rdpNetlifyPainter(),
                    contentDescription = null,
                )
            }
        )
        Text(
            proBonoBody,
            style = paragraphStyle,
            inlineContent = inlineContent,
            modifier = Modifier.padding(top = spacing.Separation1).testTag("BannerAbout.proBono.body"),
        )

        // ----- Copyright -----
        val year = Clock.System.todayIn(TimeZone.of("Europe/Paris")).year
        val copyright = buildAnnotatedString {
            // RdpStrings.Key.FooterCopyrightPrefix is "© {year} · Design original de ".
            append(rdpString(RdpStrings.Key.FooterCopyrightPrefix).replace("{year}", year.toString()))
            withStyle(inlineLinkSpan) { append("@CcelestinC") }
        }
        Text(
            copyright,
            style = copyrightStyle,
            textAlign = TextAlign.Center,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = titleTop, bottom = spacing.Separation2)
                .testTag("BannerAbout.copyright"),
        )
    }
}

@Composable
private fun SectionTitle(slug: String, label: String, icon: Painter, style: TextStyle, topPadding: Dp) {
    Row(
        modifier = Modifier.padding(top = topPadding),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Image(
            painter = icon,
            contentDescription = null,
            modifier = Modifier.size(24.dp),
        )
        Spacer(Modifier.width(8.dp)) // --separation-1 gap between icon and label
        Text(label, style = style, modifier = Modifier.testTag("BannerAbout.title.$slug"))
    }
}

@Composable
private fun FooterLink(view: String, label: String, style: TextStyle, topPadding: Dp = 0.dp, onClick: () -> Unit) {
    Text(
        label,
        style = style,
        modifier = Modifier
            .padding(top = topPadding)
            .testTag("BannerAbout.viewButton.$view")
            .pointerHoverIcon(PointerIcon.Hand)
            .clickable { onClick() },
    )
}
