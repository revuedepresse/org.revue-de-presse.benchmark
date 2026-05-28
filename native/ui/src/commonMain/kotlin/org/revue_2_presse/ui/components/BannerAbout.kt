package org.revue_2_presse.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.input.pointer.PointerIcon
import androidx.compose.ui.input.pointer.pointerHoverIcon
import androidx.compose.ui.platform.testTag
import androidx.compose.foundation.text.appendInlineContent
import androidx.compose.ui.text.Placeholder
import androidx.compose.ui.text.PlaceholderVerticalAlign
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.text.InlineTextContent
import org.revue_2_presse.design.drawables.rdpNetlifyPainter
import kotlinx.datetime.Clock
import kotlinx.datetime.TimeZone
import kotlinx.datetime.todayIn
import org.revue_2_presse.design.RdpColors
import org.revue_2_presse.design.RdpRadii
import org.revue_2_presse.design.RdpType
import org.revue_2_presse.design.i18n.rdpString
import org.revue_2_presse.design.theme.LocalRdpSpacing
import org.revue_2_presse.domain.i18n.RdpStrings

// Parity target: e2e/parity/captures/home.json (BannerAbout + BannerAboutTitle + BannerAboutPara)
// AND the Nuxt-side Mitosis source design-system/src/components/BannerAbout.lite.tsx.
// Container: #2f394d bg, #e6e6e6 color, padding 16/16/19/16, radius 8.
// Title: Signika 20sp Bold white, line-height 30.
// Paragraph: Roboto 16sp, line-height 22.4 (1.4em), color #e6e6e6.
// Links: underlined, white, Roboto 16sp.
@Composable
fun BannerAbout(
    onNavigate: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    val spacing = LocalRdpSpacing.current
    val titleStyle = TextStyle(
        fontSize = 20.sp,
        lineHeight = 30.sp,
        fontWeight = FontWeight.Bold,
        color = RdpColors.White,
    )
    val paragraphStyle = TextStyle(
        fontSize = RdpType.FontSizeFooterParagraph,
        lineHeight = RdpType.LineSpacingFooterParagraph,
        color = RdpColors.ContentFont,
    )
    val linkStyle = paragraphStyle.copy(
        color = RdpColors.White,
        textDecoration = TextDecoration.Underline,
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
        verticalArrangement = Arrangement.spacedBy(spacing.Separation1),
    ) {
        // ----- Social / sharing -----
        SectionTitle("social", rdpString(RdpStrings.Key.FooterSocialHeading), titleStyle)
        Text(
            rdpString(RdpStrings.Key.FooterSharingBody),
            style = paragraphStyle,
            modifier = Modifier.testTag("BannerAbout.sharing.body"),
        )
        val openExternalUrl = LocalOpenExternalUrl.current
        Text(
            rdpString(RdpStrings.Key.FooterSubscribeToLabel),
            style = linkStyle.copy(fontWeight = FontWeight.Bold),
            modifier = Modifier
                .testTag("BannerAbout.sharing.subscribe")
                .pointerHoverIcon(PointerIcon.Hand)
                .clickable {
                    openExternalUrl("https://bsky.app/profile/revue-de-presse.org")
                },
        )

        // ----- About -----
        SectionTitle("about", rdpString(RdpStrings.Key.FooterAboutHeading), titleStyle)
        Text(
            rdpString(RdpStrings.Key.FooterAboutBody),
            style = paragraphStyle,
            modifier = Modifier.testTag("BannerAbout.about.body"),
        )
        FooterLink("legal", rdpString(RdpStrings.Key.FooterAboutPrivacyPolicy), linkStyle) { onNavigate("/mentions-legales") }
        FooterLink("terms", rdpString(RdpStrings.Key.FooterAboutTermsOfService), linkStyle) { onNavigate("/conditions-utilisation") }
        FooterLink("support", rdpString(RdpStrings.Key.FooterAboutSupport), linkStyle) { onNavigate("/nous-soutenir") }
        FooterLink("sources", rdpString(RdpStrings.Key.FooterAboutSources), linkStyle) { onNavigate("/sources") }

        // ----- Pro bono publico -----
        SectionTitle("proBono", rdpString(RdpStrings.Key.FooterProBonoHeading), titleStyle)
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
            modifier = Modifier.testTag("BannerAbout.proBono.body"),
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
            style = paragraphStyle.copy(color = RdpColors.White),
            modifier = Modifier.testTag("BannerAbout.copyright"),
        )
    }
}

@Composable
private fun SectionTitle(slug: String, label: String, style: TextStyle) {
    Text(label, style = style, modifier = Modifier.testTag("BannerAbout.title.$slug"))
}

@Composable
private fun FooterLink(view: String, label: String, style: TextStyle, onClick: () -> Unit) {
    Text(
        label,
        style = style,
        modifier = Modifier
            .testTag("BannerAbout.viewButton.$view")
            .pointerHoverIcon(PointerIcon.Hand)
            .clickable { onClick() },
    )
}
