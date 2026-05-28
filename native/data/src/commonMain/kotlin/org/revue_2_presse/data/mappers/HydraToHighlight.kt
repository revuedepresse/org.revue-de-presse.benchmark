package org.revue_2_presse.data.mappers

import kotlinx.datetime.Instant
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toInstant
import org.revue_2_presse.data.api.HydraCollection
import org.revue_2_presse.data.api.HydraHighlight
import org.revue_2_presse.domain.entities.Highlight
import org.revue_2_presse.domain.entities.Metrics

object HydraToHighlight {
    fun map(payload: HydraCollection<HydraHighlight>): List<Highlight> =
        payload.member.map(::mapOne)

    private fun mapOne(h: HydraHighlight): Highlight = Highlight(
        id = h.publicationId.ifBlank { h.url },
        authorName = DeriveAuthorName.from(h.screenName),
        authorHandle = h.screenName,
        authorAvatarUrl = h.avatarUrl,
        body = CleanText.clean(h.text),
        publishedAt = parseDate(h.date),
        metrics = Metrics(replies = h.replies, reposts = h.reposts, likes = h.likes),
        url = h.url,
    )

    private fun parseDate(s: String): Instant =
        runCatching { Instant.parse(s) }.getOrElse {
            // Upstream sometimes omits the Z suffix; assume UTC.
            kotlinx.datetime.LocalDateTime.parse(s).toInstant(TimeZone.UTC)
        }
}
